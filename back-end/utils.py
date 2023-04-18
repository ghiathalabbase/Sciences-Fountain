from django.core.paginator import Paginator
from django.core.cache import cache
ALLOWED_CACHED_MODELS = ["Academy"]
class OptimizedPaginator(Paginator):
    def __init__(self, object_list, per_page, orphans=0, allow_empty_first_page=True, count:int = None):
        super().__init__(object_list, per_page, orphans, allow_empty_first_page)
        if count is not None:
            self.count = int(count)
        else:
            model = object_list.model.__name__
            if model in ALLOWED_CACHED_MODELS:
                model_count = cache.get(model)
                if model_count is not None:
                    self.count = model_count
                else: 
                    print(model_count)
                    cache.set(model, self.count, 7200)