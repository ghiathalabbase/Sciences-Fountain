from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status
from .models import (
    Academy, PathInfo, Student, Subject, Lesson,
    AcademyDetail, AcademyFeature
)
from authentication.models import User
from django.contrib.auth.models import AnonymousUser
from .serializers import (
    AcademySerializer, AcademyDetailSerializer,
    PathInfoSerializer,BatchSerializer,
    LessonSerializer, FeatureSerializer
)
from utils import OptimizedPaginator, check_integer
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
    

class AcademyListView(APIView):
    def get(self, request, format=None):
        academies = Academy.objects.all()[:10]
        serialized_academies = AcademySerializer(academies, many=True)

        return JsonResponse({"academies": serialized_academies.data}, status=status.HTTP_200_OK)

class AcademyView(APIView):
    @staticmethod
    def get_academy_detail(academy_id: int) -> dict:
        if not isinstance(academy_id, int):
            raise TypeError(f"'academy_id' must be type of 'int', not {type(academy_id)}")
        serialized_academy_detail = AcademyDetailSerializer(instance=get_object_or_404(AcademyDetail, academy_id=academy_id))
        print(serialized_academy_detail.data)
        serialized_features = FeatureSerializer(instance=AcademyFeature.objects.filter(academy_detail_id = serialized_academy_detail.data['id']), many=True)
        return {'academy_detail': serialized_academy_detail.data, 'features': serialized_features.data}
    
    def get_operations_flow(self, academy_id: int) -> dict:
        """
        Takes ``academy_id`` argument which is an academy id in addition to ``self``.\n 
        If the `user is:\n
            -1 not authenticated,  ``AcademyDetail`` with ``academy_id``  and related ``AcademyFeature`` objects data will be returned in a dictionary.\n
            -2 authenticated, and related to one of ``PathInfo`` objects linked with ``Academy``,  a dictionary with user ``paths``
            ``subjects``, and ``lessons`` will returned, otherwise returned dictionary will be identical to the first status.
        """

        if not self.request.user.is_authenticated:
            return self.get_academy_detail(academy_id)
        
        student_paths = PathInfo.objects.filter(academy_id=academy_id, student__student_id=self.request.user.id).select_related('batch', 'level', 'phase')
        if student_paths: #if len(student_paths)
            serialized_student_paths = PathInfoSerializer(student_paths, many=True)
            last_path = serialized_student_paths.data[-1]
            lessons = Lesson.objects.filter(subject__path_info_id=last_path['id']).select_related('subject')
            serialized_lessons = LessonSerializer(lessons, many=True)
            return {'student_paths': serialized_student_paths.data, 'lessons':serialized_lessons.data}
        
        return self.get_academy_detail(academy_id)
    
    def get(self, request, slug: str):
        """
        This ``get`` method expects the request url to have a ``slug`` value ``(which can only contain lowercase letters, dashes and numbers )`` 
        which referes to a specific academy, but if there is no academy with this ``slug``, it will return ``404 Error``.
        In case a search param called ``id`` was provided this method will consider the academy is already retrieved
        and will depend on this ``id`` for filtering related rows.
        """

        id = check_integer(request.GET.get('id'))
        if id > 0:
            return Response(self.get_operations_flow(id))
        
        academy = Academy.objects.filter(slug=slug)
        if not academy : #if not len(academy):
            return Response(f"Academy With '{slug}' Slug Not Found", status=status.HTTP_404_NOT_FOUND)
        academy=academy[0]
        returnedData = self.get_operations_flow(academy.id)
        returnedData['academy'] = AcademySerializer(academy).data
        return Response(returnedData)
        
        
        
        
        
        
        
        
        
        
        # if not request.user.is_authenticated:
        #     return self.get_academy_detail(academy)
        
        # student_paths = PathInfo.objects.filter(academy_id=academy.id, student__student_id=request.user.id).select_related('batch', 'level', 'phase')
        # if student_paths: #if len(student_paths)
        #     serialized_academy = AcademySerializer(academy)
        #     serialized_student_paths = PathInfoSerializer(student_paths, many=True)
        #     last_path = serialized_student_paths.data[-1]
        #     lessons = Lesson.objects.filter(subject__path_info_id=last_path['id']).select_related('subject')
        #     serialized_lessons = LessonSerializer(lessons, many=True)
        #     return Response({'academy': serialized_academy.data, 'student_paths': serialized_student_paths.data, 'lessons':serialized_lessons.data})
        
        # return self.get_academy_detail(academy)
        
        
        
        

