import jwt
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from datetime import datetime, timezone


User = get_user_model()

class JWTAuthenticationMiddleware(MiddlewareMixin):
    """ Middleware to authenticate requests using JWT tokens. """

    def process_request(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None  # Let Django handle unauthenticated users

        try:
            # Extract the token (remove "Bearer " prefix)
            token = auth_header.split(" ")[1]

            # Decode the JWT token
            access_token = AccessToken(token)
            user_id = access_token["user_id"]

            # Retrieve user from database
            user = User.objects.get(id=user_id)

            # Attach the user to the request
            request.user = user

        except IndexError:
            raise AuthenticationFailed("Invalid Authorization header format")
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        return None



class TokenRefreshMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        access_token = auth_header.split(" ")[1]

        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(access_token)
            request.user = jwt_auth.get_user(validated_token)

            # Check if token is about to expire
            exp_timestamp = validated_token["exp"]
            current_timestamp = datetime.now(timezone.utc).timestamp()

            if exp_timestamp - current_timestamp < 300:  # Less than 5 minutes left
                refresh_token = request.COOKIES.get("refresh_token")
                
                if refresh_token:
                    new_token = RefreshToken(refresh_token).access_token
                    return JsonResponse({"token": str(new_token)}, status=200)

        except Exception as e:
            return JsonResponse({"error": "Token expired or invalid"}, status=401)

        return None