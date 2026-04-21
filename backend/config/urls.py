import mimetypes
import os
import re

from django.contrib import admin
from django.http import FileResponse, HttpResponse, Http404
from django.urls import path, include, re_path
from django.conf import settings
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def media_serve(request, path):
    """
    Serve media files with HTTP 206 Partial Content support so browsers
    can seek audio/video without re-downloading from the start.
    """
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.exists(full_path):
        raise Http404

    file_size = os.path.getsize(full_path)
    content_type = mimetypes.guess_type(full_path)[0] or 'application/octet-stream'
    range_header = request.META.get('HTTP_RANGE', '')

    if range_header:
        match = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if match:
            first = int(match.group(1))
            last = int(match.group(2)) if match.group(2) else file_size - 1
            last = min(last, file_size - 1)
            length = last - first + 1

            with open(full_path, 'rb') as f:
                f.seek(first)
                data = f.read(length)

            response = HttpResponse(data, status=206, content_type=content_type)
            response['Content-Range'] = f'bytes {first}-{last}/{file_size}'
            response['Content-Length'] = str(length)
            response['Accept-Ranges'] = 'bytes'
            return response

    response = FileResponse(open(full_path, 'rb'), content_type=content_type)
    response['Accept-Ranges'] = 'bytes'
    response['Content-Length'] = str(file_size)
    return response


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/', include('api.urls')),
    re_path(r'^media/(?P<path>.*)$', media_serve),
]
