# Generated by Django 3.2 on 2021-04-20 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0003_screenshot_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='name',
            field=models.CharField(default='project-name', max_length=128),
        ),
    ]
