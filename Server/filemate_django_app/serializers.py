from rest_framework import serializers
from .models import User, FileCompression, FileDownload

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_picture', 'created_at']

# File Compression Serializer
class FileCompressionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileCompression
        fields = ['id', 'user', 'original_file', 'compressed_file', 'compression_type', 'status', 'size', 'created_at']
        read_only_fields = ['status', 'compressed_file', 'created_at']  # Prevent modification of these fields

# File Download Serializer
class FileDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileDownload
        fields = ['id', 'user', 'url', 'file_path', 'status', 'size', 'created_at']
        read_only_fields = ['status', 'file_path', 'created_at']  # Prevent modification of these fields