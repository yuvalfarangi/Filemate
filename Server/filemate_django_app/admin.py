from django.contrib import admin
from .models import User, FileCompression, FileDownload

# Register models to show them in Django Admin
admin.site.register(User)
admin.site.register(FileCompression)
admin.site.register(FileDownload)