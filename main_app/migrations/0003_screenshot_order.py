# Generated by Django 3.2 on 2021-04-20 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0002_rename_project_title_project_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='screenshot',
            name='order',
            field=models.IntegerField(default=-1),
        ),
    ]