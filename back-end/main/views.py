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

from utils import OptimizedPaginator, check_integer

class Academies(APIView):
    def get(self, request):
        count = request.GET.get("count")
        page_num = request.GET.get("page_num")
        per_page = request.GET.get("per_page")
        if page_num is None: page_num = 1
        academies = Academy.objects.all()
        academies_paginator = OptimizedPaginator(object_list=academies, per_page=per_page, count=count)
        academies_serialized = AcademySerializer(academies_paginator.get_page(page_num).object_list, many=True)
        print(page_num)
        pages_list = list(academies_paginator.get_elided_page_range(page_num, on_each_side=2))
        return Response({'count': academies_paginator.count, 'num_pages':academies_paginator.num_pages, 'pages_list': pages_list, 'page_objects': academies_serialized.data})