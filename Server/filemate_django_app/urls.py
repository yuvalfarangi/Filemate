from django.urls import path
from .routes.user import RetrieveAllUsers, RetrieveUserById, register_user, login_user
from .routes.files import (
    FilesHistoryView, FilesCompressionView, FilesDownloadView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # GET '/api/users' - Retrieve all users
    path('users/', RetrieveAllUsers.as_view(), name='retrieve-all-users'),

    # GET '/api/user/:id' - Retrieve user by ID
    path('user/<int:pk>/', RetrieveUserById.as_view(), name='retrieve-user-by-id'),

    # POST '/api/auth/register/' - register new user
    path('auth/register/', register_user, name='user-register'),

    # POST '/api/auth/login/' - register new user
    path('auth/login/', login_user, name='user-login'),

    # GET '/api/file/history/' - Retrieve file upload history
    path('file/history/', FilesHistoryView.as_view(), name='file-history'),

    # POST '/api/file/compress/' - Compress a file
    path('file/compress/', FilesCompressionView.as_view(), name='file-compress'),

    # POST '/api/file/download/' - Download a file
    path('file/download/', FilesDownloadView.as_view(), name='file-download'),

    # api/auth/token/refresh - Generate refresh token
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]