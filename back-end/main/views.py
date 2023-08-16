from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpRequest, FileResponse, HttpResponseBadRequest
from django.views import View
from django.core.cache import cache
from django.views.decorators.clickjacking import xframe_options_exempt
from django.core.files.storage import FileSystemStorage
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status
from .models import (
  Academy, PathInfo, Student, Subject, Lesson,
  AcademyDetails, AcademyFeature, Batch, BatchLink, AcademyType
)
from authentication.models import User
from .serializers import (
  AcademySerializer, AcademyDetailsSerializer,
  PathInfoSerializer,BatchSerializer,
  LessonSerializer, FeatureSerializer, BatchLinkSerializer,AcademyTypeSerializer
)
from utils import OptimizedPaginator, Academy404Response, AcademyDetails404Response, convert_to_int
# Create your views here.

class CSRFView(View):
    def get(self, request):
        return HttpResponse()

def get_specific_params(request_data, required_params_list):
    found_params = dict()
    for param in required_params_list :
        p_value = request_data.get(param["name"])
        if p_value:
            if param["type"] == int and p_value.isdigit():
                    found_params[param["name"]] = p_value
            elif param["type"] == float and not p_value.isdigit():
                try:
                    no = float(p_value)
                    found_params[param["name"]] = p_value
                except:
                    continue
            elif isinstance(p_value, param["type"]):
                found_params[param["name"]] = p_value
    return found_params

def get_paginator(request, Model, ModelSerializer, related_fields=[], filters=None):
    count = request.GET.get("count")
    page_num = request.GET.get("page_num")
    per_page = request.GET.get("per_page")
    if page_num is None: page_num = 1
    objects = Model.objects.select_related(*related_fields).all() if related_fields else Model.objects.all()
    objects = objects.filter(**filters) if filters else objects
    objects_paginator = OptimizedPaginator(object_list=objects, per_page=per_page, count=count)
    serialized_objects = ModelSerializer(objects_paginator.get_page(page_num).object_list, many=True)
    pages_list = list(objects_paginator.get_elided_page_range(page_num, on_each_side=2, on_ends=1))
    return {'count': objects_paginator.count, 'num_pages':objects_paginator.num_pages, 'pages_list': pages_list, 'page_objects': serialized_objects.data}


class Academies(APIView):
    def get(self, request):
        related_fields = ['academy_type']
        required_filters = [{"name": "academy_type_id", "type": str}, {"name": "rate", "type": float}, {"name": "name", "type": str}]
        filters = get_specific_params(request.GET, required_filters)
        try:
            filters["rate__gte"] = filters.pop("rate")
        except:
            pass
        try:
            filters["name__contains"] = filters.pop("name")
        except:
            pass
        data = get_paginator(request, Academy, AcademySerializer, related_fields, filters)
        return Response(data)

class AcademyListView(APIView):
  def get(self, request, format=None):
    academies = Academy.objects.all()[:10]
    serialized_academies = AcademySerializer(academies, many=True)

    return JsonResponse({"academies": serialized_academies.data}, status=status.HTTP_200_OK)
  
class AcademyTypeView(APIView):
    def get(self, request, format=None):
        types = AcademyType.objects.all()
        serialized_types = AcademyTypeSerializer(types, many=True).data
        return Response(serialized_types, status=status.HTTP_200_OK)

class AcademyView(APIView):
  cache_timeout = 3600 * 3
  def get(self, request: HttpRequest, slug: str):

    academy_id = convert_to_int(request.GET.get("academy_id"))
    returned_data = {}
    if academy_id is None:
      academy = cache.get(slug)
      if academy is None:
        try:
          academy = Academy.objects.get(slug=slug)
        except ObjectDoesNotExist:
          return Academy404Response(slug)
        academy = AcademySerializer(academy).data
        cache.set(slug, academy, self.cache_timeout)
      returned_data["academy"] = academy
      academy_id = academy["id"]

    student_paths = None
    if request.user.is_authenticated:
      student_paths = PathInfo.objects.filter(
        student__student_id=request.user.id,
        academy_id=academy_id
      ).select_related("batch", "level", "phase")
      if student_paths:
        student_paths = PathInfoSerializer(student_paths, many=True).data
      
    returned_data["paths"] = student_paths
      
    return Response(returned_data)


   
class AcademyDetailsView(APIView):
  cache_timeout = AcademyView.cache_timeout

  @staticmethod
  def create_details_cache_key(slug:str): 
    return f"{slug}_details"
  
  def get(self, request: HttpRequest, slug):

    details_cache_key = self.create_details_cache_key(slug)
    academy_details = cache.get(details_cache_key) 
    if academy_details is not None:
      return Response(academy_details)
    
    academy_id = convert_to_int(request.GET.get("academy_id"))
    if not academy_id:
      return HttpResponseBadRequest("'academy_id' query must be an integer")
    
    try:
      academy_details = AcademyDetailsSerializer(AcademyDetails.objects.get(academy_id=academy_id)).data
    except ObjectDoesNotExist:
      return AcademyDetails404Response()
    
    features = FeatureSerializer(
      AcademyFeature.objects.filter(academy_details_id=academy_details["id"]), many=True
    ).data
    academy_details.update({"features": features}) 
    cache.set(details_cache_key, academy_details, self.cache_timeout)

    return Response(academy_details) 
    