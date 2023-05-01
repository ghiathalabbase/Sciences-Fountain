from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status
from main.models import Academy, PathInfo, Student
from .serializers import AcademySerializer
from utils import OptimizedPaginator
# Create your views here.

class CSRFView(View):
    def get(self, request):
        return HttpResponse()

def get_paginator(request, Model, ModelSerializer):
    count = request.GET.get("count")
    page_num = request.GET.get("page_num")
    per_page = request.GET.get("per_page")
    if page_num is None: page_num = 1
    objects = Model.objects.all()
    objects_paginator = OptimizedPaginator(object_list=objects, per_page=per_page, count=count)
    serialized_objects = ModelSerializer(objects_paginator.get_page(page_num).object_list, many=True)
    pages_list = list(objects_paginator.get_elided_page_range(page_num, on_each_side=2, on_ends=1))
    return Response({'count': objects_paginator.count, 'num_pages':objects_paginator.num_pages, 'pages_list': pages_list, 'page_objects': serialized_objects.data})

class Academies(APIView):
    def get(self, request):
        return get_paginator(request, Academy, AcademySerializer)
    
class AcademyDetailView(APIView):
    def get(self, request, slug):
        academy = Academy.objects.filter(slug=slug)
        academy_data = academy.first()
        if academy_data is not None:
            academy_id = academy_data.id
            queryset = PathInfo.objects.filter(academy_id=academy_id, student__student_id=request.user.id).\
            values("id", "academy_id", "batch_id","level_id", "stage_id", "student__student_id")
            print(queryset.__len__())
            if queryset.__len__() == 0:
                print("no such student")
            else:
                print(queryset)

        return Response()

        # Voter.objects.annotate(value=F('vote__value'), year=F('vote__year')).values('name', 'value', 'year').filter(Q(year=2020) | Q(year__isnull=True))
        # Voter.objects.annotate(votes2020=FilteredRelation('vote', condition=Q(vote__year=2020))).values('name', 'votes2020__value', 'votes2020__year')

class AcademyListView(APIView):
    def get(self, request, format=None):
        academies = Academy.objects.all()[:10]
        serialized_academies = AcademySerializer(academies, many=True)

        return JsonResponse({"academies": serialized_academies.data}, status=status.HTTP_200_OK)