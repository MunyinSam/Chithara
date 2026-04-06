import requests
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..modules.User import User
from ..modules.Song import Song
from ..modules.GenerationHistory import GenerationHistory
from ..serializer import GenerationHistorySerializer
from ..services.suno import submit_generation


@extend_schema(tags=['Generation History'])
class GenerationHistoryViewSet(viewsets.ModelViewSet):
    queryset = GenerationHistory.objects.all()
    serializer_class = GenerationHistorySerializer


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

    # TODO: swap for request.user once auth is set up
    user = User.objects.first()

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


@extend_schema(tags=['Generation'], exclude=True) # exclude from swagger api doc
@csrf_exempt
@api_view(['POST'])
def generation_callback(request):
    """
    Called by Suno when a generation job completes or fails.
    """
    data = request.data
    task_id = data.get('taskId') or data.get('task_id')

    if not task_id:
        return Response({'error': 'missing taskId'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        history = GenerationHistory.objects.get(suno_task_id=task_id)
    except GenerationHistory.DoesNotExist:
        return Response({'error': 'unknown taskId'}, status=status.HTTP_404_NOT_FOUND)

    clips = data.get('clips') or data.get('data') or []
    clip = clips[0] if isinstance(clips, list) and clips else data
    suno_status = clip.get('status', '')

    if suno_status == 'complete' or data.get('code') == 200:
        audio_url = clip.get('audio_url') or clip.get('audioUrl', '')
        try:
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
        except Exception as exc:
            history.status = 'FAILED'
            history.error_message = f'Failed to download audio: {exc}'
            history.save()
    else:
        history.status = 'FAILED'
        history.error_message = clip.get('error') or 'Suno reported a failure'
        history.save()

    return Response({'ok': True})
