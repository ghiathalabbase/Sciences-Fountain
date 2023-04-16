from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status
from .models import Academy
from .serializers import AcademySerializer
# Create your views here.
from django.db.models import Q

class CSRFView(View):
    def get(self, request):
        return HttpResponse()
    
from utils import OptimizedPaginator
class Academies(APIView):
    def get(self, request):
        academies = Academy.objects.all()
        academies_paginator = OptimizedPaginator(object_list=academies, per_page=10)
        academies_serialized = AcademySerializer(academies_paginator.get_page(1).object_list, many=True)
        return Response({'num_pages':academies_paginator.num_pages, 'page_objects': academies_serialized.data})