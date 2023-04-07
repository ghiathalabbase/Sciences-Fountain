from django.urls import path
from authentication import views
# from django.views.generic import TemplateView
from django.views.generic import TemplateView

urlpatterns = [
    path('login', views.LoginView.as_view(), name='login'),
    path('profile', views.ProfileView.as_view(), name='profile'),
    path('logout',views.LogoutView.as_view(), name='logout'),
    path('register', views.RegisterView.as_view(), name='register'),
    path('verification', views.VerificatoinView.as_view(), name='verification'),
    path('', TemplateView.as_view(template_name='authentication/index.html')),
]