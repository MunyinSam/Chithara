from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    suno = None  # set in ready()

    def ready(self):
        from django.conf import settings
        from .services.real_suno import RealSunoService
        from .services.mock_suno import MockSunoService
        from .services.context import SunoContext

        provider = getattr(settings, 'SUNO_PROVIDER', 'real').lower()
        threshold = int(getattr(settings, 'SUNO_CREDIT_THRESHOLD', 14))

        if provider == 'mock':
            self.suno = MockSunoService()
            print('[suno] Using MockSunoService (SUNO_PROVIDER=mock)')
        else:
            self.suno = SunoContext(
                real=RealSunoService(),
                mock=MockSunoService(),
                credit_threshold=threshold,
            )
            print(f'[suno] Using SunoContext with credit_threshold={threshold}')
