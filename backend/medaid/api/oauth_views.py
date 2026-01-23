"""
OAuth authentication views for Google and GitHub
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
import requests
import os

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def google_oauth(request):
    """
    Handle Google OAuth authentication
    Expects: { "code": "auth_code", "redirect_uri": "callback_url" }
    """
    try:
        code = request.data.get('code')
        redirect_uri = request.data.get('redirect_uri', 'http://localhost:3001/auth/google/callback')
        
        if not code:
            return Response(
                {'error': 'Authorization code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Exchange code for access token
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'code': code,
            'client_id': os.environ.get('GOOGLE_OAUTH_CLIENT_ID'),
            'client_secret': os.environ.get('GOOGLE_OAUTH_CLIENT_SECRET'),
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }
        
        token_response = requests.post(token_url, data=token_data)
        
        if token_response.status_code != 200:
            return Response(
                {'error': 'Failed to obtain access token', 'details': token_response.text},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        access_token = token_response.json().get('access_token')
        
        # Get user info from Google
        user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        user_info_response = requests.get(
            user_info_url,
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if user_info_response.status_code != 200:
            return Response(
                {'error': 'Failed to get user info'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_data = user_info_response.json()
        email = user_data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email not provided by Google'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': user_data.get('given_name', ''),
                'last_name': user_data.get('family_name', ''),
            }
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def github_oauth(request):
    """
    Handle GitHub OAuth authentication
    Expects: { "code": "auth_code", "redirect_uri": "callback_url" }
    """
    try:
        code = request.data.get('code')
        redirect_uri = request.data.get('redirect_uri', 'http://localhost:3001/auth/github/callback')
        
        if not code:
            return Response(
                {'error': 'Authorization code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Exchange code for access token
        token_url = 'https://github.com/login/oauth/access_token'
        token_data = {
            'code': code,
            'client_id': os.environ.get('GITHUB_OAUTH_CLIENT_ID'),
            'client_secret': os.environ.get('GITHUB_OAUTH_CLIENT_SECRET'),
            'redirect_uri': redirect_uri,
        }
        
        token_response = requests.post(
            token_url,
            data=token_data,
            headers={'Accept': 'application/json'}
        )
        
        if token_response.status_code != 200:
            return Response(
                {'error': 'Failed to obtain access token', 'details': token_response.text},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        access_token = token_response.json().get('access_token')
        
        if not access_token:
            return Response(
                {'error': 'No access token received', 'details': token_response.json()},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user info from GitHub
        user_info_url = 'https://api.github.com/user'
        user_info_response = requests.get(
            user_info_url,
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            }
        )
        
        if user_info_response.status_code != 200:
            return Response(
                {'error': 'Failed to get user info'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_data = user_info_response.json()
        
        # Get user email (might be in a separate endpoint)
        email = user_data.get('email')
        if not email:
            email_response = requests.get(
                'https://api.github.com/user/emails',
                headers={
                    'Authorization': f'Bearer {access_token}',
                    'Accept': 'application/json'
                }
            )
            if email_response.status_code == 200:
                emails = email_response.json()
                primary_email = next((e for e in emails if e.get('primary')), None)
                if primary_email:
                    email = primary_email.get('email')
        
        if not email:
            return Response(
                {'error': 'Email not provided by GitHub'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        name_parts = (user_data.get('name') or '').split(' ', 1)
        first_name = name_parts[0] if name_parts else user_data.get('login', '')
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
            }
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_oauth_config(request):
    """
    Return OAuth configuration for frontend
    """
    return Response({
        'google': {
            'client_id': os.environ.get('GOOGLE_OAUTH_CLIENT_ID', ''),
            'enabled': bool(os.environ.get('GOOGLE_OAUTH_CLIENT_ID'))
        },
        'github': {
            'client_id': os.environ.get('GITHUB_OAUTH_CLIENT_ID', ''),
            'enabled': bool(os.environ.get('GITHUB_OAUTH_CLIENT_ID'))
        }
    })
