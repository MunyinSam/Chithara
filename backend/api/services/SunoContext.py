from .SunoService import SunoService
from .MockSunoService import MOCK_PREFIX


class SunoContext:
    def __init__(self, real: SunoService, mock: SunoService, credit_threshold: int = 14):
        self._real = real
        self._mock = mock
        self._threshold = credit_threshold

    def _select(self) -> SunoService:
        try:
            credits = self._real.fetch_credits()
            if credits < self._threshold:
                print(f'[suno] credits={credits} < threshold={self._threshold} → MockSunoService')
                return self._mock
        except Exception as exc:
            print(f'[suno] credit check failed ({exc}) → MockSunoService')
            return self._mock
        return self._real

    def submit_generation(self, prompt: str, style: str, title: str, instrumental: bool = False, api_key: str = '') -> str:
        return self._select().submit_generation(prompt, style, title, instrumental, api_key)

    def fetch_task_result(self, task_id: str) -> dict:
        if task_id.startswith(MOCK_PREFIX):
            return self._mock.fetch_task_result(task_id)
        return self._real.fetch_task_result(task_id)

    def fetch_credits(self) -> int:
        return self._real.fetch_credits()
