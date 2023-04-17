from django.core.paginator import Paginator

class OptimizedPaginator(Paginator):
    def __init__(self, object_list, per_page, orphans=0, allow_empty_first_page=True, count:int = None):
        super().__init__(object_list, per_page, orphans, allow_empty_first_page)
        if count is not None:
            self.count = int(count)