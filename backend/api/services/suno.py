"""
Suno API client for api.sunoapi.org
  POST /api/v1/generate  → returns { taskId }
  Suno calls our callBackUrl when done with the finished clip data
"""

import requests
from django.conf import settings

HEADERS = {
    'Authorization': f'Bearer {settings.SUNO_API_KEY}',
    'Content-Type': 'application/json',
}


def submit_generation(prompt: str, style: str, title: str, instrumental: bool = False) -> str:
    """
    Submit a generation job to Suno.
    Returns the taskId string.
    """
    payload = {
        'customMode': True,
        'instrumental': instrumental,
        'model': 'V4_5ALL',
        'callBackUrl': settings.SUNO_CALLBACK_URL,
        'prompt': prompt,
        'style': style,
        'title': title,
    }

    response = requests.post(
        f'{settings.SUNO_API_BASE_URL}/generate',
        json=payload,
        headers=HEADERS,
        timeout=30,
    )
    response.raise_for_status()

    data = response.json()
    if data.get('code') != 200:
        raise RuntimeError(f"Suno error: {data.get('msg', 'Unknown error')}")

    return data['data']['taskId']
