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
    
    def get_elided_page_range(self, number=1, *, on_each_side=3, on_ends=2):
        """
        Return a 1-based range of pages with some values elided.

        If the page range is larger than a given size, the whole range is not
        provided and a compact form is returned instead.
        """
        number = self.validate_number(number)

        # If the number of pages is less than or equal to 9, return the whole range
        if self.num_pages <= 9:
            yield from self.page_range
            return

        # If the current page is within the first 3 pages, return the first 4 pages and an ellipsis,
        # followed by the last 4 pages
        if number <= 3:
            yield from range(1, 5)
            yield self.ELLIPSIS
            yield from range(self.num_pages - 3, self.num_pages + 1)
        # If the current page is within the last 3 pages, return the first 4 pages, an ellipsis,
        # and the last 4 pages
        elif number > self.num_pages - 3:
            yield from range(1, 5)
            yield self.ELLIPSIS
            yield from range(self.num_pages - 3, self.num_pages + 1)
        # If the current page is somewhere in the middle, return the first page, an ellipsis,
        # 5 pages centered around the current page, another ellipsis, and the last page
        else:
            yield 1
            yield self.ELLIPSIS
            start = max(number - 2, 2)
            end = min(number + 2, self.num_pages - 1)
            yield from range(start, end+1)
            yield self.ELLIPSIS
            yield self.num_pages

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
