import uuid
from pathlib import Path
from django.conf import settings

MOCK_SONGS_DIR = Path(settings.BASE_DIR) / 'mock'

_STYLE_SONGS: dict[str, dict] = {
    'lo-fi':      {'file': 'lofi.mp3',        'title': 'Late Night Lo-fi'},
    'pop':        {'file': 'pop.mp3',          'title': 'Summer Pop Vibes'},
    'hip-hop':    {'file': 'hip-hop.mp3',      'title': 'Urban Flow'},
    'r&b':        {'file': 'randb.mp3',        'title': 'Smooth R&B Groove'},
    'jazz':       {'file': 'jazz.mp3',         'title': 'Jazz at 2AM'},
    'classical':  {'file': 'classical.mp3',    'title': 'Classical Interlude'},
    'rock':       {'file': 'rock.mp3',         'title': 'Electric Rock'},
    'electronic': {'file': 'electronic.mp3',   'title': 'Synthwave Drive'},
    'acoustic':   {'file': 'acoustic.mp3',     'title': 'Acoustic Evening'},
    'cinematic':  {'file': 'cinematic.mp3',    'title': 'Cinematic Score'},
}

_FALLBACK = {'file': 'lofi.mp3', 'title': 'Mock Song'}

MOCK_PREFIX = 'mock__'


def _song_for_style(style: str) -> dict:
    return _STYLE_SONGS.get(style.lower().strip(), _FALLBACK)


class MockSunoService:
    def submit_generation(self, prompt: str, style: str, title: str, instrumental: bool = False, api_key: str = '') -> str:
        style_slug = style.lower().strip().replace(' ', '-').replace('&', 'and')[:20]
        task_id = f'{MOCK_PREFIX}{style_slug}__{uuid.uuid4().hex}'
        print(f'[mock suno] submit_generation → task_id={task_id}')
        return task_id

    def fetch_task_result(self, task_id: str) -> dict:
        style_slug = ''
        if task_id.startswith(MOCK_PREFIX):
            remainder = task_id[len(MOCK_PREFIX):]
            style_slug = remainder.split('__')[0].replace('-', ' ').replace('and', '&')

        song = _song_for_style(style_slug)
        local_path = MOCK_SONGS_DIR / song['file']

        if not local_path.exists():
            print(f'[mock suno] WARNING: mock file not found at {local_path}, returning FAILED')
            return {'data': {'status': 'GENERATE_AUDIO_FAILED'}}

        print(f'[mock suno] fetch_task_result → SUCCESS using {song["file"]}')
        return {
            'data': {
                'response': {
                    'sunoData': [{
                        'status': 'SUCCESS',
                        'title': song['title'],
                        'style': style_slug or 'Lo-fi',
                        'audioUrl': '',
                        '_local_path': str(local_path),
                    }]
                }
            }
        }

    def fetch_credits(self) -> int:
        return 999
