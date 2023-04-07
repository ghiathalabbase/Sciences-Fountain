from django.urls import path
from . import views
from django.views.decorators.csrf import ensure_csrf_cookie
urlpatterns = [
    path('get-csrftoken', ensure_csrf_cookie(views.CSRFView.as_view()), name='get-csrftoken'),
]