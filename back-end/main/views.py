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
        page_num : str  = request.GET.get("page_num") 
        count = request.GET.get("count")
        if page_num is not None and page_num.isdigit():
            page_num = int(page_num)
        # else:
        #     raise
        if count is not None and count.isdigit():
            count = int(count)
        # else:
        #     raise ValueError("'count' must be an integer")
        academies = Academy.objects.all().select_related('creator')
        if count is not None:
            count = int(count)
            academies_paginator = OptimizedPaginator(object_list=academies, per_page=20)
        else:
            academies_paginator = OptimizedPaginator(object_list=academies, per_page=20)
        academies_serialized = AcademySerializer(academies_paginator.get_page('asdf').object_list, many=True)
        return Response({'num_pages':academies_paginator.num_pages, 'page_objects': academies_serialized.data, 'count': academies_paginator.count})