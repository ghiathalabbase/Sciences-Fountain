from django.core.paginator import Paginator
from django.core.cache import cache

def check_integer(value):
    try:
        return int(value)
    except:
        return False
    
ALLOWED_CACHED_MODELS = ["Academy"]
class OptimizedPaginator(Paginator):
    def __init__(self, object_list, per_page=None, orphans=0, allow_empty_first_page=True, count:int = None):
        per_page = self.validate_per_page(per_page)
        count = self.validate_count(count)
        super().__init__(object_list, per_page, orphans, allow_empty_first_page)
        
        if count is not None and count > 0:
            self.count = count
        else:
            model = object_list.model.__name__
            """This will result in unpredictable results in case the cache key can contain something else combined with the model name."""
            if model in ALLOWED_CACHED_MODELS:
                model_count = cache.get(model)
                if model_count is not None :
                    self.count = model_count
                    # print(model_count)
                else:
                    cache.set(model, self.count, 7200)

    @staticmethod
    def validate_per_page(value):
        if value is None: value = 100
        try: value = min(int(value), 1000)
        except: value = 100

        return value
    
    @staticmethod
    def validate_count(value):
        try: value = int(value)
        except: value = None

        return value
