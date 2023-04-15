# Generated by Django 4.0.6 on 2023-04-11 14:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Academy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('slug', models.SlugField(unique=True)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='images/academies_images')),
                ('dashboard_password', models.CharField(max_length=128)),
                ('theme_color', models.CharField(default='', max_length=10)),
                ('academy_type', models.CharField(max_length=40, null=True)),
                ('allow_comments', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('rate', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='AcademyDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=80)),
                ('description', models.TextField()),
                ('about', models.TextField()),
                ('academy', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='main.academy')),
            ],
        ),
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveSmallIntegerField()),
                ('created_at', models.DateField(auto_now_add=True)),
                ('academy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.academy')),
            ],
        ),
        migrations.CreateModel(
            name='Complaint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=400)),
            ],
        ),
        migrations.CreateModel(
            name='ContactMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('academy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.academy')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='Exam',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('start_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('end_date', models.DateTimeField()),
                ('duration', models.SmallIntegerField(blank=True, null=True)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exams', to='main.batch')),
            ],
        ),
        migrations.CreateModel(
            name='ExamOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=300)),
                ('is_correct', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ExamQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=300)),
                ('degrees', models.SmallIntegerField(default=1)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='main.exam')),
            ],
        ),
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.TextField()),
                ('option_one', models.CharField(max_length=300)),
                ('option_two', models.CharField(blank=True, max_length=300, null=True)),
                ('option_three', models.CharField(blank=True, max_length=300, null=True)),
                ('correct_option', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveSmallIntegerField()),
                ('title', models.CharField(max_length=120)),
                ('exercise_count', models.PositiveSmallIntegerField()),
                ('url', models.URLField(null=True)),
                ('date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveSmallIntegerField()),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.batch')),
            ],
        ),
        migrations.CreateModel(
            name='PathInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('academy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.academy')),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.batch')),
                ('level', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.level')),
            ],
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.batch')),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
                ('author_name', models.CharField(blank=True, max_length=40, null=True)),
                ('image', models.ImageField(null=True, upload_to='images/academies_images')),
                ('source_url', models.URLField()),
                ('exercise_count', models.PositiveSmallIntegerField()),
                ('lesson_count', models.PositiveSmallIntegerField()),
                ('path_info', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.pathinfo')),
                ('section', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.section')),
            ],
        ),
        migrations.CreateModel(
            name='SubjectQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('favourite_count', models.PositiveIntegerField(default=0)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.lesson')),
                ('publisher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.subject')),
            ],
        ),
        migrations.CreateModel(
            name='UserFavourites',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject_question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.subjectquestion')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.batch')),
            ],
        ),
        migrations.CreateModel(
            name='SubjectQuestionReply',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='main.subjectquestion')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SubjectDegree',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('degree', models.SmallIntegerField()),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.subject')),
            ],
        ),
        migrations.AddField(
            model_name='subject',
            name='topic',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.topic'),
        ),
        migrations.CreateModel(
            name='StudentExamAnswer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.examoption')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='student_answers', to='main.examquestion')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path_info', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.pathinfo')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Stage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveSmallIntegerField()),
                ('level', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.level')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('profile_image', models.ImageField(blank=True, null=True, upload_to='images/profiles_images')),
                ('academic_number', models.BigIntegerField(blank=True, unique=True)),
                ('birth_date', models.DateField()),
                ('gender', models.BooleanField()),
                ('country', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.country')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='pathinfo',
            name='stage',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.stage'),
        ),
        migrations.AddField(
            model_name='pathinfo',
            name='students',
            field=models.ManyToManyField(through='main.Student', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=120)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to='main.lesson')),
            ],
        ),
        migrations.AddField(
            model_name='lesson',
            name='subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.subject'),
        ),
        migrations.CreateModel(
            name='ExerciseSolution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('solution', models.TextField()),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.exercise')),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.lesson')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='exercise',
            name='lesson',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.lesson'),
        ),
        migrations.AddField(
            model_name='examoption',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='options', to='main.examquestion'),
        ),
        migrations.CreateModel(
            name='ExamDegrees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('degree', models.SmallIntegerField()),
                ('exam', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.exam')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='exam',
            name='path_info',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exams', to='main.pathinfo'),
        ),
        migrations.CreateModel(
            name='ContactReply',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('contact_message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='main.contactmessage')),
            ],
        ),
        migrations.CreateModel(
            name='ComplaintReply',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=500)),
                ('complaint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.complaint')),
            ],
        ),
        migrations.AddField(
            model_name='complaint',
            name='exam',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.exam'),
        ),
        migrations.AddField(
            model_name='complaint',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='BatchLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=30)),
                ('link', models.URLField()),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.batch')),
            ],
        ),
        migrations.CreateModel(
            name='BatchAdmin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.batch')),
            ],
        ),
        migrations.AddField(
            model_name='batch',
            name='admins',
            field=models.ManyToManyField(through='main.BatchAdmin', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=120)),
                ('url', models.URLField()),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='main.lesson')),
            ],
        ),
        migrations.CreateModel(
            name='Advertisement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=100)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('image', models.ImageField(upload_to='images/ads_images')),
                ('academy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.academy')),
            ],
        ),
        migrations.CreateModel(
            name='AcademyFeautre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feature', models.CharField(max_length=180)),
                ('academy_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.academydetail')),
            ],
        ),
        migrations.CreateModel(
            name='AcademyAdmin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('academy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.academy')),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='academy',
            name='admins',
            field=models.ManyToManyField(related_name='admin_in', through='main.AcademyAdmin', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='academy',
            name='creator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='academies', to=settings.AUTH_USER_MODEL),
        ),
    ]
