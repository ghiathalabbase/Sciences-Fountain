# Generated by Django 4.0.6 on 2023-05-30 06:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_alter_academy_academy_type2'),
    ]

    operations = [
        migrations.AddField(
            model_name='academy',
            name='academy_type',
            field=models.CharField(max_length=40, null=True),
        ),
        migrations.AlterField(
            model_name='academy',
            name='academy_type2',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.SET_DEFAULT, related_name='academies', to='main.academytype'),
        ),
    ]
