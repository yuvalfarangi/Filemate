from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# User Model (Extends Django's Built-in User Model)
class User(AbstractUser):
    profile_picture = models.URLField(blank=True, null=True)  # Cloudinary URL
    created_at = models.DateTimeField(auto_now_add=True)

    # Avoid conflicts with Django's built-in auth.User model
    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

    def __str__(self):
        return self.username

#File Compression Model
class FileCompression(models.Model):
    COMPRESSION_TYPES = [
        ('zip', 'ZIP'),
        ('rar', 'RAR'),
        ('7z', '7z'),
        ('tar', 'TAR')
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('compressing', 'Compressing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    original_file = models.URLField()  # Cloudinary URL
    compressed_file = models.URLField()  # Cloudinary URL
    compression_type = models.CharField(max_length=10, choices=COMPRESSION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    size = models.IntegerField()  # File size in KB/MB
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Compression ({self.compression_type}) - {self.user.username}"

#File Download Model
class FileDownload(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('downloading', 'Downloading'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField()  # Original video URL
    file_path = models.URLField()  # Cloudinary file URL
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    size = models.IntegerField()  # File size in KB/MB
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Download - {self.user.username} ({self.status})"