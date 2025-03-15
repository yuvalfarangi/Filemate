from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.response import Response
from filemate_django_app.models import User, FileCompression, FileDownload
from filemate_django_app.serializers import UserSerializer
from filemate_django_app.integrations.cloudinary_intergration import upload_file, fetch_file
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model

User = get_user_model() 


# Generate JWT Tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }



@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    print(f"Attempting login: {username}")  # Debugging

    try:
        user = User.objects.get(username=username)  # Ensure correct model
        print(f"User found: {user}")  # Debugging

        if check_password(password, user.password):  # Manually verify password
            print("Password matches manually!")

            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Log in successfully!',
                'token': tokens['access'],
                'refresh_token': tokens['refresh'],
                'user': user
            })
        else:
            print("Manual password check failed!")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        print("User not found!")  # Debugging
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)





#'/api/users' route
class RetrieveAllUsers(generics.ListAPIView): 
    queryset = User.objects.all()
    serializer_class = UserSerializer



#'/api/user/:id' route
class RetrieveUserById(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer



# /api/auth/login route
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    print(f"Attempting login: {username}")  # Debugging

    try:
        user = User.objects.get(username=username)  # Ensure correct model
        print(f"User found: {user}")  # Debugging

        if check_password(password, user.password):  # Manually verify password
            print("Password matches manually!")

            tokens = get_tokens_for_user(user)
            return Response({
                'token': tokens['access'],
                'refresh_token': tokens['refresh'],
                'user': UserSerializer(user).data 
            })
        else:
            print("Manual password check failed!")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        print("User not found!")  # Debugging
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# /api/auth/register route
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    firstname = request.data.get('firstname')
    lastname = request.data.get('lastname')
    email = request.data.get('email')
    password = request.data.get('password')
    profile_picture = request.data.get('profile_picture')  

    User = get_user_model()  # ✅ Ensure correct model is used

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already in use'}, status=status.HTTP_400_BAD_REQUEST)

    if not firstname or not lastname or not email or not password:
        return Response({'error': 'One or more required fields are missing.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        username=username,
        first_name=firstname,  
        last_name=lastname,    
        email=email,
        password=make_password(password),  
        profile_picture=profile_picture if profile_picture else "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
    )

    return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)



# /auth/token/refresh/ route