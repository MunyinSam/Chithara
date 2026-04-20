from django.conf import settings
from .base import SunoService
from .real_suno import RealSunoService
from .mock_suno import MockSunoService
from .hybrid_suno import HybridSunoService

_instance: SunoService | None = None


def get_suno_service() -> SunoService:
    global _instance
    if _instance is None:
        provider = getattr(settings, 'SUNO_PROVIDER', 'real').lower()
        if provider == 'mock':
            _instance = MockSunoService()
            print('[suno] Using MockSunoService (SUNO_PROVIDER=mock)')
        elif provider == 'auto':
            _instance = HybridSunoService()
            print('[suno] Using HybridSunoService (SUNO_PROVIDER=auto)')
        else:
            _instance = RealSunoService()
            print('[suno] Using RealSunoService (SUNO_PROVIDER=real)')
    return _instance
