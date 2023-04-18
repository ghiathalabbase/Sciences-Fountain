from django.core.paginator import Paginator
from django.core.cache import cache


def check_integer(value):
    try:
        return int(value)
    except:
        return False
    
ALLOWED_CACHED_MODELS = ["Academy"]
class OptimizedPaginator(Paginator):
    def __init__(self, object_list, per_page, orphans=0, allow_empty_first_page=True, count:int = None, model:str=None):
        per_page = self.validate_per_page(per_page)
        count = self.validate_count(count)
        super().__init__(object_list, per_page, orphans, allow_empty_first_page)
        
        if count is not None and count >= 0:
            self.count = count
        elif model is not None and model in ALLOWED_CACHED_MODELS:
            model_count = cache.get(model)
            if model_count is not None :
                self.count = model_count
            else:
                cache.set(model, self.count, 7200)

    def validate_per_page(self, value):
        if value is None: value = 100
        try: value = min(int(value), 1000)
        except: value = 100

        return value
    
    def validate_count(self, value):
        try: value = int(value)
        except: value = None

        return value

