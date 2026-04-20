from django.conf import settings
from .real_suno import RealSunoService
from .mock_suno import MockSunoService, MOCK_PREFIX

CREDIT_THRESHOLD = getattr(settings, 'SUNO_CREDIT_THRESHOLD', 14)


class HybridSunoService:
    """
    Uses RealSunoService when credits are sufficient, MockSunoService otherwise.
    fetch_task_result routes by task_id prefix so polling always hits the right backend.
    """

    def __init__(self):
        self._real = RealSunoService()
        self._mock = MockSunoService()

    def _use_mock(self) -> bool:
        try:
            credits = self._real.fetch_credits()
            if credits < CREDIT_THRESHOLD:
                print(f'[hybrid suno] credits={credits} < threshold={CREDIT_THRESHOLD}, falling back to mock')
                return True
            return False
        except Exception as exc:
            print(f'[hybrid suno] credits check failed ({exc}), falling back to mock')
            return True

    def submit_generation(self, prompt: str, style: str, title: str, instrumental: bool = False, api_key: str = '') -> str:
        if self._use_mock():
            return self._mock.submit_generation(prompt, style, title, instrumental, api_key)
        return self._real.submit_generation(prompt, style, title, instrumental, api_key)

    def fetch_task_result(self, task_id: str) -> dict:
        if task_id.startswith(MOCK_PREFIX):
            return self._mock.fetch_task_result(task_id)
        return self._real.fetch_task_result(task_id)

    def fetch_credits(self) -> int:
        return self._real.fetch_credits()
