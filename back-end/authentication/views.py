from django.shortcuts import render, redirect
from django.views import View
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login, logout
from django.core.mail import EmailMessage
from django.conf import settings
from django.core.cache import cache
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import status
from .models import User
from main.models import Profile
from .serializers import UserSerializer
from main.serializers import ProfileSerializer
from json import loads, dumps
TRY_EMAIL = 'ghiathalabbase@gmail.com'

class RegisterView(View):
    """
    Receive a request has a ``json object`` contains two objects: one for creating ``user(email, password)``
    and the second one for creating ``profile(name, birth_date, gender, country)``.

    It pushes this object to the cache until the user verify its account via a link sent as an email.

    It rejects the request if ``email`` is already found in the database or the cache.
    """
    def post(self, request):
        register_info: dict = loads(request.body)
        print(register_info)
        encoded_email = register_info['user']['email'].encode('utf-8').hex()
        if cache.get(encoded_email) is None:

            user_serializered = UserSerializer(data=register_info['user'])

            if user_serializered.is_valid():
                cache.set(encoded_email, register_info, 3600)
                print('http://127.0.0.1:8000/auth/verification?code=%s'% encoded_email)

                # email = EmailMessage(
                #     subject='Verification Email',
                #     body="""Hello User, welcome to shoponce.
                #     Please click on the link below to verify your account:
                #     http://127.0.0.1:8000/auth/verification?code=%s
                #     """ % code,
                #     from_email=settings.EMAIL_HOST_USER,
                #     to=[TRY_EMAIL],
                # )
                # try:
                #     is_sent = email.send(fail_silently=False)
                # except Exception as error:
                #     return JsonResponse({'errors': {"email": ["Email is Not Found"]}})
                return JsonResponse({
                    'message':
                    'We sent you a verification email containing a verification link, We need to make sure that this email is yours until we can create your account. "Note: you have two hours to verify your account."'
                })
            return JsonResponse({'errors': user_serializered.errors})
        
        return JsonResponse({"errors":{'email': ['This email is already taken, use another.']}})

class VerificatoinView(View):
    def get(self, request):
        code = self.request.GET.get('code')
        register_info = cache.get(code)
        if register_info is not None:
            cache.delete(code)
            # BASE_NUMBER = 1000000
            new_user : User = User.objects.create_user(**register_info['user'])
            Profile.objects.create(user=new_user, **register_info['user_profile'], academic_number=1000000+new_user.id)
            login(request, new_user)
            return redirect('http://127.0.0.1:5173')
        else:
            response = HttpResponse('Error 404: this code is not found', status=status.HTTP_404_NOT_FOUND)
            return response

class LoginView(View):
    def post(self, request):
        credentials: dict = loads(request.body)
        user = None
        try:
            user : User = User.objects.get(email=credentials.get('email'))
        except:
            return JsonResponse('Email Not Found', safe=False, status=400)
        password_authenticity: bool = check_password(credentials.get('password'), user.password)
        if password_authenticity:
            login(self.request, user)
            serialized_user = UserSerializer(instance=user)
            serialized_profile = ProfileSerializer(instance=Profile.objects.select_related('country').get(user_id=user.id))
            return JsonResponse({**serialized_profile.data, **serialized_user.data,  'is_authenticated': True})
        else:
            return JsonResponse('Wrong Password', safe=False)

class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponse()
    
class ProfileView(View):
    def get(self, request):
        if request.user.is_authenticated:
            serialized_user = UserSerializer(instance=self.request.user)
            serialized_profile = ProfileSerializer(instance=Profile.objects.select_related('country').get(user_id=self.request.user))
            return JsonResponse({**serialized_profile.data, **serialized_user.data,  'is_authenticated': True})
        else:
            return JsonResponse({'is_authenticated': False})
            
def index(request):
    # from utils import OptimizedPaginator
    # userlist = User.objects.all().order_by('email')
    # pg = OptimizedPaginator(object_list=userlist, per_page=2)
    # print(pg.num_pages)
    return render(request, 'index.html')
    