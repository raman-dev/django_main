from django.db import models
import uuid
# Create your models here.
# all things fall into a category


class Watchable(models.Model):
    class Genre(models.TextChoices):
        ACTION = 'Action'
        THRILLER = 'Thriller'
        COMEDY = 'Comedy'
        MYSTERY = 'Mystery'
        HORROR = 'Horror'
        FANTASY = 'Fantasy'

    title = models.CharField(max_length=100)
    genre = models.CharField(max_length=10,default=Genre.ACTION,choices=Genre.choices)
    year = models.IntegerField(default=2000, verbose_name='Release Year')
    source_url = models.CharField(max_length=256, default='#')
    #runtime in seconds
    runtime = models.IntegerField(default=3600, verbose_name="Runtime")


class TvShow(Watchable):
    season = models.PositiveIntegerField(default=1)
    episode = models.PositiveIntegerField(default=1)
    thumbnail_url = models.CharField(max_length=256, default='notflix/media/thumbnails/placeholder_thumbnail_tv.jpg')
    preview_url = models.CharField(max_length=256, default='notflix/media/previews/placeholder_preview_tv.mp4')

#pretty much thats it no season
class Movie(Watchable):
    thumbnail_url = models.CharField(max_length=256, default='notflix/media/thumbnails/placeholder_thumbnail_movie.jpg')
    preview_url = models.CharField(max_length=256, default='notflix/media/previews/placeholder_preview_movie.mp4')