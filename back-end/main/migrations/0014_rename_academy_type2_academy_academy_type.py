# Generated by Django 4.0.6 on 2023-05-30 06:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_remove_academy_academy_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='academy',
            old_name='academy_type2',
            new_name='academy_type',
        ),
    ]
