"""
Suno API client for api.sunoapi.org
  POST /api/v1/generate        → returns { taskId }
  GET  /api/v1/query?taskId=X  → returns task status + clips
"""

import requests
from django.conf import settings

HEADERS = {
    'Authorization': f'Bearer {settings.SUNO_API_KEY}',
    'Content-Type': 'application/json',
}


def submit_generation(prompt: str, style: str, title: str, instrumental: bool = False, api_key: str = '') -> str:
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

    headers = {
        'Authorization': f'Bearer {api_key or settings.SUNO_API_KEY}',
        'Content-Type': 'application/json',
    }

    response = requests.post(
        f'{settings.SUNO_API_BASE_URL}/generate',
        json=payload,
        headers=headers,
        timeout=30,
    )
    print(f'[suno] POST /generate status={response.status_code} body={response.text}')
    response.raise_for_status()

    data = response.json()
    if data.get('code') != 200:
        raise RuntimeError(f"Suno error: {data.get('msg', 'Unknown error')}")

    return data['data']['taskId']


def fetch_credits() -> int:
    """
    Returns the remaining generation credits for the configured API key.
    Endpoint: GET /api/v1/generate/credit
    """
    response = requests.get(
        f'{settings.SUNO_API_BASE_URL}/generate/credit',
        headers=HEADERS,
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    if data.get('code') != 200:
        raise RuntimeError(f"Suno error: {data.get('msg', 'Unknown error')}")
    return data['data']


def fetch_task_result(task_id: str) -> dict:
    """
    Poll Suno for the current status of a task.
    Endpoint: GET /api/v1/generate/record-info?taskId=...
    Returns the raw response dict from Suno.
    """
    response = requests.get(
        f'{settings.SUNO_API_BASE_URL}/generate/record-info',
        params={'taskId': task_id},
        headers=HEADERS,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()
