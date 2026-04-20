import requests
from django.conf import settings


class RealSunoService:
    def submit_generation(self, prompt: str, style: str, title: str, instrumental: bool = False, api_key: str = '') -> str:
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

    def fetch_task_result(self, task_id: str) -> dict:
        headers = {
            'Authorization': f'Bearer {settings.SUNO_API_KEY}',
            'Content-Type': 'application/json',
        }
        response = requests.get(
            f'{settings.SUNO_API_BASE_URL}/generate/record-info',
            params={'taskId': task_id},
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()
        return response.json()

    def fetch_credits(self) -> int:
        headers = {
            'Authorization': f'Bearer {settings.SUNO_API_KEY}',
            'Content-Type': 'application/json',
        }
        response = requests.get(
            f'{settings.SUNO_API_BASE_URL}/generate/credit',
            headers=headers,
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if data.get('code') != 200:
            raise RuntimeError(f"Suno error: {data.get('msg', 'Unknown error')}")
        return data['data']
