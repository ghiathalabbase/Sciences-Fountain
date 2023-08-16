# import time

# class LazyProperty:
#     def __init__(self, function):
#         self.function = function

#     def __set_name__(self, owner, name):
#         self.name = name

#     def __get__(self, obj, type=None) -> object:
#         obj.__dict__[self.name] = self.function(obj)
#         return obj.__dict__[self.name]

# class Person:

#     @LazyProperty
#     def age(self):
#         time.sleep(3)
#         return 50
    
# my_deep_thought_instance = Person()
# my_deep_thought_instance.age = 99
# print(my_deep_thought_instance.age)
# print(my_deep_thought_instance.age)
# print(my_deep_thought_instance.age)
print(not 0)