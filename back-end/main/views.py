from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response 

from .models import Academy
from .serializers import AcademySerializer
# Create your views here.

class CSRFView(View):
    # @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return HttpResponse()
    

class Academies(APIView):
    def get(self, request):
        academies = Academy.objects.all()[0:10]
        academies_serialized = AcademySerializer(instance=academies, many=True)
        return Response(academies_serialized.data)
