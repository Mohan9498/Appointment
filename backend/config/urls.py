from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return JsonResponse({"message": "API is running"})

urlpatterns = [

    path('', home),

    # ✅ MAIN API
    path("api/", include("api.urls")),

    # ✅ OTHER APPS (NO "api/" prefix here)
    path("accounts/", include("accounts.urls")),
    path("programs/", include("programs.urls")),
    path("api/contact/", include("contact.urls")),

    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)