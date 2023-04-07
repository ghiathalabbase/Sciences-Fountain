from django.db import models
from authentication.models import User
from django.utils import timezone
from django.db.models import F
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

ACADEMY_IMAGES_PATH = "images/academies_images"
SITE_THEME = ""


class Profile(models.Model):
    name = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(
        upload_to="images/profiles_images",
        null=True,
        blank=True
    )
    academic_number = models.BigIntegerField(unique=True, blank=True)
    country = models.ForeignKey('Country', on_delete=models.SET_NULL, null=True)
    birth_date = models.DateField()
    gender = models.BooleanField()

    def __str__(self) -> str:
        return self.name

class Country(models.Model):
    name = models.TextField(max_length=40)
    def __str__(self) -> str:
        return self.name

class Academy(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to=ACADEMY_IMAGES_PATH, null=True, blank=True)
    dashboard_password = models.CharField(max_length=128)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="academies")
    theme_color = models.CharField(max_length = 10, default=SITE_THEME)
    academy_type = models.CharField(max_length = 40, null=True)
    allow_comments = models.BooleanField(default = False)
    created_at = models.DateTimeField(auto_now_add=True)
    admins = models.ManyToManyField(User, through="AcademyAdmin", related_name="admin_in")
    rate = models.PositiveIntegerField(default=0)

class AcademyDetail(models.Model):
    title = models.CharField(max_length = 80)
    description = models.TextField()
    about = models.TextField()
    academy = models.OneToOneField(Academy, on_delete=models.CASCADE)
    # Other Fields

class AcademyFeautre(models.Model):
    feature = models.CharField(max_length = 180)
    academy_detail = models.ForeignKey(AcademyDetail, on_delete=models.CASCADE)

class AcademyAdmin(models.Model):
    academy = models.ForeignKey(Academy, on_delete=models.CASCADE)
    admin = models.ForeignKey(User, on_delete=models.CASCADE)

class Batch(models.Model):
    number = models.PositiveSmallIntegerField()
    academy = models.ForeignKey(Academy, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    admins = models.ManyToManyField(User, through="BatchAdmin")

class BatchAdmin(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    admin = models.ForeignKey(User, on_delete=models.CASCADE)

class BatchLink(models.Model):
    text = models.CharField(max_length=30)
    link = models.URLField()
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)

class Level(models.Model):
    number = models.PositiveSmallIntegerField()
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)

class Stage(models.Model):
    number = models.PositiveSmallIntegerField()
    level = models.ForeignKey(Level, on_delete=models.CASCADE)

class PathInfo(models.Model):
    academy = models.ForeignKey(Academy, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, through='Student')

class Student(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    path_info = models.ForeignKey(PathInfo, on_delete=models.CASCADE)

class Section(models.Model):
    name = models.CharField(max_length=40)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)

class Topic(models.Model):
    name = models.CharField(max_length=40)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)

class Subject(models.Model):
    name = models.CharField(max_length=40)
    author_name = models.CharField(max_length=40, null=True, blank=True)
    image = models.ImageField(upload_to=ACADEMY_IMAGES_PATH, null=True)
    source_url = models.URLField()
    exercise_count = models.PositiveSmallIntegerField() 
    lesson_count = models.PositiveSmallIntegerField()
    section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    path_info = models.ForeignKey(PathInfo, on_delete=models.CASCADE)

class Lesson(models.Model):
    number = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=120)
    exercise_count = models.PositiveSmallIntegerField()
    url = models.URLField(null=True)
    date = models.DateField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

class Note(models.Model):
    text = models.CharField(max_length=120)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='notes')

class Attachment(models.Model):
    text = models.CharField(max_length=120)
    url = models.URLField()
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='attachments')

class SubjectQuestion(models.Model):
    content = models.TextField()
    favourite_count = models.PositiveIntegerField(default=0)
    publisher = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

class SubjectQuestionReply(models.Model):
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(SubjectQuestion, on_delete=models.CASCADE, related_name='replies')
    
class UserFavourites(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject_question = models.ForeignKey(SubjectQuestion, on_delete=models.CASCADE)

class Exercise(models.Model):
    question = models.TextField()
    option_one = models.CharField(max_length=300)
    option_two = models.CharField(max_length=300, null=True, blank=True)
    option_three = models.CharField(max_length=300, null=True, blank=True)
    correct_option = models.CharField(max_length=300)
    lesson_id = models.ForeignKey(Lesson, on_delete=models.CASCADE)

class ExerciseSolution(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    solution = models.TextField()
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)

class SubjectDegree(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    subject=models.ForeignKey(Subject, on_delete=models.CASCADE)
    degree = models.SmallIntegerField()

class Exam(models.Model):
    name = models.CharField(max_length=50)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    duration = models.SmallIntegerField(null=True, blank=True)
    batch = models.ForeignKey(Batch, on_delete = models.CASCADE, related_name='exams')
    path_info = models.ForeignKey(PathInfo, on_delete=models.CASCADE, related_name='exams')

class ExamQuestion(models.Model):
    content = models.CharField(max_length=300)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    degrees = models.SmallIntegerField(default=1)

class ExamOption(models.Model):
    content = models.CharField(max_length=300)
    question = models.ForeignKey(ExamQuestion, on_delete=models.CASCADE, related_name='options')
    is_correct = models.BooleanField(default=False)

class StudentExamAnswer(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(ExamQuestion, on_delete=models.CASCADE, related_name='student_answers')
    answer = models.ForeignKey(ExamOption, on_delete=models.CASCADE)

class ExamDegrees(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True)
    degree = models.SmallIntegerField()

class Complaint(models.Model):
    content = models.CharField(max_length=400)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)

class ComplaintReply(models.Model):
    content = models.CharField(max_length=500)
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE)


class Advertisement(models.Model):
    text = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    image = models.ImageField(upload_to="images/ads_images")
    academy = models.ForeignKey(Academy, on_delete=models.CASCADE)

class ContactMessage(models.Model):
    message = models.TextField()
    messager = models.ForeignKey(User, on_delete=models.CASCADE)
    academy = models.ForeignKey(Academy, on_delete=models.CASCADE)

class ContactReply(models.Model):
    contact_message = models.ForeignKey(ContactMessage, on_delete=models.CASCADE, related_name='replies')
    content = models.TextField()

