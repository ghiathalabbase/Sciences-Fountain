from django.shortcuts import render, redirect
from django.views import View
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login, logout
from django.core.mail import EmailMessage
from django.conf import settings
from django.core.cache import caches, cache
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import status
from .models import User
from main.models import Profile
from .serializers import UserSerializer
from main.serializers import ProfileSerializer
from json import loads, dumps
from secrets import choice
register_cache = caches["register_cache"]

    
    

class RegisterView(APIView):
  """
  Receive a request has a ``json object`` contains two objects: one for creating ``user(email, password)``
  and the second one for creating ``profile(name, birth_date, gender, country)``.  

  It pushes this object to the cache until the user verify its account via a link sent as an email.  
  It rejects the request if ``email`` is already found in the database or the cache.
  """
  ALLOWED_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  SECRET_LENGTH = 30
  TIME_TO_EXPIRE = 3600 * 3
  
  @staticmethod
  def generate_random_string(length:int):
    secret_code = ""
    for i in range(length):
      secret_code += choice(RegisterView.ALLOWED_CHARS)
    return secret_code
  
  @staticmethod
  def cipher_verfication_code(code:str):
    mask = RegisterView.generate_random_string(RegisterView.SECRET_LENGTH)
    cipher = ""
    for i in range(RegisterView.SECRET_LENGTH):
      cipher += RegisterView.ALLOWED_CHARS[(RegisterView.ALLOWED_CHARS.index(code[i]) + RegisterView.ALLOWED_CHARS.index(mask[i])) % len(RegisterView.ALLOWED_CHARS)] 
    return mask+cipher
  
  @staticmethod
  def generate_verification_code():
    return RegisterView.generate_random_string(RegisterView.SECRET_LENGTH)
  
  def post(self, request):
    register_info: dict = loads(request.body)
    email = register_info['user']['email']
    print(register_info)
    if register_cache.get(email) is None:
      user_serializered = UserSerializer(data=register_info['user'])

      if user_serializered.is_valid():
        verifcation_code = RegisterView.generate_verification_code()
        while register_cache.get(verifcation_code) is not None:
          verifcation_code = RegisterView.generate_verification_code()
        print(verifcation_code)
        register_cache.set_many({email: register_info, verifcation_code: email}, RegisterView.TIME_TO_EXPIRE)
        print('http://127.0.0.1:8000/auth/verification?code=%s'% RegisterView.cipher_verfication_code(verifcation_code))

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

from rest_framework.response import Response
class VerificatoinView(APIView):
    def decipher_code(self):
        cipher = self.request.GET.get('code')
        mask = cipher[:RegisterView.SECRET_LENGTH]
        cipher = cipher[RegisterView.SECRET_LENGTH:]
        code = ""
        for i in range(RegisterView.SECRET_LENGTH):
            code += RegisterView.ALLOWED_CHARS[RegisterView.ALLOWED_CHARS.index(cipher[i]) - RegisterView.ALLOWED_CHARS.index(mask[i])]
        return code
    
    def get(self, request):
        code = self.decipher_code()
        email = register_cache.get(code)
        if email is None:
            return HttpResponse('Error 404: this code is not found', status=status.HTTP_404_NOT_FOUND)
        
        register_info = register_cache.get(email)
        new_user = User.objects.create_user(**register_info['user'])
        Profile.objects.create(user=new_user, **register_info['user_profile'], academic_number=1000000+new_user.id)
        login(request, new_user)
        register_cache.delete_many([code, email])
        # return redirect('http://127.0.0.1:8000')
        return Response('http://127.0.0.1:8000')

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
            serialized_profile = ProfileSerializer(instance=Profile.objects.get(user_id=user.id))
            return JsonResponse({** serialized_profile.data, **serialized_user.data,  'is_authenticated': True})
        else:
            return JsonResponse('Wrong Password', safe=False)

class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponse()
    
class ProfileView(View):
    def get(self, request):
        if request.user.is_authenticated:
            # print(dir(self.request.user.date_joined))
            # print(self.request.user.date_joined.astimezone())
            # print(self.request.user.date_joined.ctime())
            # print(self.request.user.date_joined.time())
            # print(self.request.user.date_joined.tzinfo)
            # print(self.request.user.date_joined.tzname())
            # print(self.request.user.date_joined.utcoffset())
            serialized_user = UserSerializer(instance=self.request.user)
            serialized_profile = ProfileSerializer(instance=Profile.objects.get(user_id=self.request.user))
            return JsonResponse({**serialized_profile.data, **serialized_user.data,  'is_authenticated': True})
        else:
            return JsonResponse({'is_authenticated': False})
from main.models import Academy
def index(request):
    return render(request, 'index.html')
    