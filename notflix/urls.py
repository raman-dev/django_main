from django.urls import path,re_path
from . import views

urlpatterns = [
    path('',views.index),
    re_path(r'^logout',views.logout_user),
    re_path(r'^signup',views.show_signup),
    re_path(r'^auth/signup',views.signup_user),
    re_path(r'^login/$',views.show_login),
    re_path(r'^auth/login$',views.login_user),
    re_path(r'^search/$',views.search_watchables),
    re_path(r'^movies/',views.movies),
    re_path(r'^tvshows/',views.tvshows),
    re_path(r'^watch/movie/(?P<id>[0-9]+)',views.show_movie),
    re_path(r'^watch/tvshow/(?P<id>[0-9]+)',views.show_tvshow),
    # re_path(r'^like/movie/(?P<id>[0-9]+)',views.get_movie_likes),
    # re_path(r'^like/tvshow/(?P<id>[0-9]+)',views.get_tvshow_likes),
    re_path(r'^(?P<preference>(like|dislike))/(?P<type>(movie|tvshow))/(?P<id>[0-9]+)',views.toggle_preference),
    re_path(r'^status/preference/(?P<type>(movie|tvshow))/(?P<id>[0-9]+)',views.get_pref)
]