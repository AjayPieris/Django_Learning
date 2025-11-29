from django.contrib import admin
from .models import Project  # <--- Import your Blueprint

# Register your model here
admin.site.register(Project)