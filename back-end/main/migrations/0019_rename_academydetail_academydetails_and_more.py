# Generated by Django 4.2.1 on 2023-07-27 18:29

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0018_alter_academy_name'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='AcademyDetail',
            new_name='AcademyDetails',
        ),
        migrations.RenameField(
            model_name='academyfeature',
            old_name='academy_detail',
            new_name='academy_details',
        ),
        migrations.AddField(
            model_name='lesson',
            name='type_id',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='academy',
            name='admins',
            field=models.ManyToManyField(related_name='admins', through='main.AcademyAdmin', to=settings.AUTH_USER_MODEL),
        ),
    ]