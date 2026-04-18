import requests
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from ..modules.Song import Song
from ..modules.GenerationHistory import GenerationHistory
from ..serializer import GenerationHistorySerializer
from ..services.suno import submit_generation, fetch_task_result, fetch_credits


def _save_song_from_clip(history, clip, task_id):
    """
    Download audio from Suno clip data, create a Song, and mark history COMPLETED.
    Raises on any failure so the caller can mark FAILED.
    """
    audio_url = clip.get('audioUrl') or clip.get('audio_url', '')
    audio_resp = requests.get(audio_url, timeout=60)
    audio_resp.raise_for_status()

    song = Song(
        owner=history.user,
        title=clip.get('title') or history.prompt_used[:50],
        genre=clip.get('style') or '',
        prompt=history.prompt_used,
        privacy_status='PRIVATE',
    )
    song.audio_file.save(f'{task_id}.mp3', ContentFile(audio_resp.content), save=False)
    song.save()

    history.song = song
    history.status = 'COMPLETED'
    history.save()


SUNO_FAILURE_STATUSES = {
    'CREATE_TASK_FAILED', 'GENERATE_AUDIO_FAILED',
    'CALLBACK_EXCEPTION', 'SENSITIVE_WORD_ERROR',
}

def _sync_from_suno(history):
    """
    Ask Suno for the latest task status and update history in-place.
    Called whenever the frontend polls a PROCESSING record.

    Response shape:
      { data: { response: { sunoData: [{ audioUrl, title, style, status }] } } }
    """
    try:
        data = fetch_task_result(history.suno_task_id)
        print(f'[suno sync] raw response for {history.suno_task_id}: {data}')

        inner      = data.get('data') or {}
        response   = inner.get('response') or {}
        suno_data  = response.get('sunoData') or []

        # Some responses put clips at top level
        if not suno_data:
            suno_data = inner.get('sunoData') or data.get('sunoData') or []

        clip        = suno_data[0] if suno_data else {}
        suno_status = clip.get('status', '') or inner.get('status', '') or data.get('status', '')

        print(f'[suno sync] parsed status={suno_status!r} clip keys={list(clip.keys())}')

        if suno_status in ('SUCCESS', 'FIRST_SUCCESS') and clip.get('audioUrl'):
            _save_song_from_clip(history, clip, history.suno_task_id)
        elif suno_status in SUNO_FAILURE_STATUSES:
            history.status = 'FAILED'
            history.error_message = f'Suno status: {suno_status}'
            history.save()
        # PENDING / TEXT_SUCCESS / FIRST_SUCCESS → still running, leave as PROCESSING

    except Exception as exc:
        print(f'[suno sync] error for task {history.suno_task_id}: {exc}')


@extend_schema(tags=['Generation History'])
class GenerationHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = GenerationHistorySerializer

    def get_queryset(self):
        return GenerationHistory.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        """
        On every GET /api/history/{id}/, if the record is still PROCESSING
        we synchronously ask Suno for the latest status before responding.
        This replaces the need for a working callback URL in development.
        """
        instance = self.get_object()
        if instance.status == 'PROCESSING' and instance.suno_task_id:
            _sync_from_suno(instance)
            instance.refresh_from_db()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@extend_schema(
    tags=['Generation'],
    request={'application/json': {
        'type': 'object',
        'properties': {
            'prompt':       {'type': 'string'},
            'style':        {'type': 'string'},
            'title':        {'type': 'string'},
            'instrumental': {'type': 'boolean'},
        },
        'required': ['prompt', 'style', 'title'],
    }},
    responses={202: {'type': 'object', 'properties': {
        'history_id': {'type': 'integer'},
        'task_id':    {'type': 'string'},
        'status':     {'type': 'string'},
    }}},
)
@api_view(['POST'])
def generate_song(request):
    """
    Submit a song generation request to Suno.
    Returns 202 immediately — poll GET /api/history/{id}/ for status.
    Status flow: PENDING → PROCESSING → COMPLETED | FAILED
    """
    prompt = request.data.get('prompt', '').strip()
    style = request.data.get('style', '').strip()
    title = request.data.get('title', '').strip()
    instrumental = request.data.get('instrumental', False)

    if not prompt or not style or not title:
        return Response(
            {'error': 'prompt, style, and title are required'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = request.user

    history = GenerationHistory.objects.create(
        user=user,
        prompt_used=prompt,
        status='PENDING',
    )

    try:
        task_id = submit_generation(prompt, style, title, instrumental)
        history.suno_task_id = task_id
        history.status = 'PROCESSING'
        history.save()
    except Exception as exc:
        history.status = 'FAILED'
        history.error_message = str(exc)
        history.save()
        return Response({'error': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)

    return Response(
        {'history_id': history.id, 'task_id': task_id, 'status': 'PROCESSING'},
        status=status.HTTP_202_ACCEPTED,
    )


@extend_schema(
    tags=['Generation'],
    responses={200: {'type': 'object', 'properties': {
        'credits': {'type': 'integer'},
    }}},
)
@api_view(['GET'])
def get_credits(request):
    """Returns the remaining Suno API credits for this account."""
    try:
        credits = fetch_credits()
        return Response({'credits': credits})
    except Exception as exc:
        return Response({'error': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)


@extend_schema(tags=['Generation'], exclude=True)
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def generation_callback(request):
    """
    Called by Suno when a generation job completes or fails.
    Works in production when the callback URL is publicly reachable.
    In development the retrieve() poll above handles this instead.
    """
    data = request.data
    task_id = (data.get('taskId') or data.get('task_id')
               or data.get('data', {}).get('taskId'))

    if not task_id:
        return Response({'error': 'missing taskId'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        history = GenerationHistory.objects.get(suno_task_id=task_id)
    except GenerationHistory.DoesNotExist:
        return Response({'error': 'unknown taskId'}, status=status.HTTP_404_NOT_FOUND)

    if history.status == 'COMPLETED':
        return Response({'ok': True})  # already handled by polling

    clips = data.get('clips') or data.get('data') or []
    clip = clips[0] if isinstance(clips, list) and clips else data
    suno_status = clip.get('status', '')

    if suno_status == 'complete' or data.get('code') == 200:
        try:
            _save_song_from_clip(history, clip, task_id)
        except Exception as exc:
            history.status = 'FAILED'
            history.error_message = f'Failed to download audio: {exc}'
            history.save()
    else:
        history.status = 'FAILED'
        history.error_message = clip.get('error') or 'Suno reported a failure'
        history.save()

    return Response({'ok': True})
