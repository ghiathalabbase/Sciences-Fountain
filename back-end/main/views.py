from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status
from .models import Academy
from .serializers import AcademySerializer
# Create your views here.
from collections.abc import Iterable
from django.db.models.query import QuerySet
from django.db.models import Q
def get_limited_objects(
        model,
        unretrieved_fields: Iterable[str] = None,
        related_objects: Iterable[str] = None,
        limit:int = None,
        offset: int = 0,
    ) -> dict:
    
    """
    Retrieve a set of objects of ``model`` from database according to ``limit`` and ``offset``,
    and determines whether the table(``model`` refer to) finished or not.\n

    Return a ``dict`` has two keys:\n
        1-``objects`` refer to retrieved objects.\n
        2-``exhausted`` True if  the table finished and False if not.
    """

    if not hasattr(model, 'objects'):
        raise TypeError("%s model is and invalid model, it does not have an objects manager"% model.__name__)
    
    objects = None

    def check_iterability(value) -> bool:
        if value is not None and value:
            try:
                iter(value)
                if isinstance(value, (str, dict)):
                    raise TypeError("'unretrieved_fields' attribute can be any iterable except str and dict.")
                
            except TypeError as error:
                raise TypeError(f"'unretrieved_fields' must be an iterable, {error}")
            
            return True
        return False

    if check_iterability(related_objects):
        objects = model.objects.all().select_related(*related_objects)
    else:
        objects = model.objects.all()
    
    if check_iterability(unretrieved_fields):
        objects = objects.defer(*unretrieved_fields)

    returned_dict = {'objects': [], 'exhausted': None}
    if limit is None:
        objects = objects[offset:]
        returned_dict['objects'], returned_dict['exhausted'] = objects, True
    elif limit > 0:
        objects = objects[offset:offset+limit]
        returned_dict['objects'] = objects
        if not len(objects) or len(objects) < limit:
            returned_dict['exhausted'] = True
        else:
            returned_dict['exhausted'] = False
    return returned_dict
    
class CSRFView(View):
    def get(self, request):
        return HttpResponse()
    

class Academies(APIView):
    def get(self, request):
        offset : str = request.GET.get('offset')
        if not offset.isdigit():
            return Response("'offset' must be a digit", status=status.HTTP_406_NOT_ACCEPTABLE)
        offset = int(offset)
        limit = 3
        academies = get_limited_objects(Academy, limit=limit, offset=offset, unretrieved_fields=['dashboard_password'])
        if len(academies['objects']):
            academies_serialized = AcademySerializer(instance=academies['objects'], many=True)
            academies['objects'] = academies_serialized.data
            return Response(academies)
        return Response
