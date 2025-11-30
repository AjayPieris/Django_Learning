from django.contrib import admin
from django.urls import path
from api.views import say_hello  # <--- Import your view
from api.views import add_project  # <--- Import your view
from api.views import login_view # <--- Add this
from api.views import delete_project # <--- Add this
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', say_hello),   # <--- Add this path
    path('add-project/', add_project),  # <--- Add this path
    path('login/', login_view),
    path('delete-project/<int:project_id>/', delete_project),  # <--- Add this path
]

# Add this magic code at the bottom:
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)