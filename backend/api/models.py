from .modules.User import User
from .modules.Song import Song
from .modules.GenerationHistory import GenerationHistory
from .modules.GenerationQuota import GenerationQuota

# Just imports all db tables from /modules
__all__ = ['User', 'Song', 'GenerationHistory', 'GenerationQuota']
