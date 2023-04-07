from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import ensure_csrf_cookie
# Create your views here.

class CSRFView(View):
    # @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return HttpResponse()
    