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
    class WatchableType(models.TextChoices):
        TV_SHOW = 'tvshow'
        MOVIE = 'movie'
    title = models.CharField(max_length=100)
    genre = models.CharField(max_length=10,default=Genre.ACTION,choices=Genre.choices)
    # = models.ManyToManyField(Genre, help_text="Select a genre for this item")
    year = models.IntegerField(default=2000, verbose_name='Release Year')
    source_url = models.CharField(max_length=256, default='#')
    runtime = models.IntegerField(default=3600, verbose_name="Runtime")
    thumbnail_url = models.CharField(max_length=256, default='thumbnails/placeholder_thumbnail_movie.jpg')
    preview_url = models.CharField(max_length=256, default='#')
    type = models.CharField(max_length=6, default=WatchableType.MOVIE, choices=WatchableType.choices)
    # for tv shows or only
    season = models.PositiveIntegerField(default=1)
    # need to change this to a map of season num to list of nums
    episode = models.PositiveIntegerField(default=1)
