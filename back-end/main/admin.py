from django.contrib import admin
from .models import *
admin.site.register((Profile, Country, Academy,AcademyAdmin, AcademyDetail, AcademyFeautre, Batch, BatchAdmin, BatchLink, Level, Stage, PathInfo, Student, Section, Topic, Subject, Lesson, Note, Attachment, SubjectQuestion, UserFavourites, Exercise, ExerciseSolution, SubjectDegree, Exam))