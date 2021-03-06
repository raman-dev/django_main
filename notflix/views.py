from dis import dis
from this import d
from django.shortcuts import render,redirect
from django.http import HttpResponseRedirect, JsonResponse
from .models import Watchable,Movie,TvShow, Like, DisLike
from .forms import SearchForm,LoginForm,SignupForm,EmailForm, PasswordForm
from django.core import serializers
from django.db.models import Q
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
# return homepage
PREF_SET = 1
PREF_UNSET = 0

def login_user(request):
    if request.method == 'POST':
        login_form = LoginForm(request.POST)
        #this still works with the login form
        # print('logging in')
        # email_form = EmailForm(request.POST)
        # password_form = PasswordForm(request.POST)
        #print(email_form)
        if login_form.is_valid() :
            #authenticate
            user = authenticate(
                request,
                username=login_form.cleaned_data.get('email'),
                password=login_form.cleaned_data.get('password'))
            if user is not None:
                login(request,user)
                print(user.username + " logged in")
                return redirect('/notflix')
            else:
                #login failed 
                print('Failed to login')
                #return some kind of error
    return redirect('/notflix/login')

def show_login(request):
    #show login screen
    email_form = EmailForm()
    email_form.include_confirm = False

    password_form = PasswordForm()
    password_form.include_confirm = False
    context = {
        'email_form':email_form,
        'password_form':password_form,
    }
    return render(request,'notflix/login.html',context)

def show_signup(request):
    context=  {
        'signup_form': SignupForm(),
        'email_form': EmailForm(),
        'password_form':PasswordForm(),        
    }
    return render(request,'notflix/signup.html',context)

def signup_user(request):
    #if successful redirect to login
    if request.method == 'POST':
        #this should still work aswell
        signup_form = SignupForm(request.POST)
        if signup_form.is_valid():
            #create user
            #lets just skip this shit
            email = signup_form.cleaned_data.get('email')
            password = signup_form.cleaned_data.get('password')

            user = User.objects.create_user(email,email,password)
            user.save()
            
            #login_form = LoginForm(initial={'email':email})
            email_form = EmailForm(initial={'email':email})
            context = {
                #'login_form':login_form
                'email_form':email_form,
                'password_form':PasswordForm(),
            }
            return render(request,'notflix/login.html',context)
        else:
            print("signup_form is invalid!")
    return redirect('/signup')

def logout_user(request):
    logout(request)
    return redirect('/')

    
@login_required(login_url='/notflix/login')
def index(request):
    # now we need to query movies and tv shows by genre
    # for every genre get movie list for every other genre get tv show list
    watchable_rows = []
    #
    # what do i want to do
    # for each genre
    i = 0
    for genre in Watchable.Genre:
        watchable_items = []
        if i % 2 == 0:
            # grab movie list
            watchable_items = Movie.objects.filter(genre=genre)
            if watchable_items != None and watchable_items.count() == 0:
                watchable_items = TvShow.objects.filter(genre=genre)

        else:
            # grab tv show_list
            watchable_items = TvShow.objects.filter(genre=genre)
            if watchable_items != None and watchable_items.count() == 0:
                watchable_items = Movie.objects.filter(genre=genre)
        
        watchable_rows.append({
            'genre': genre,
            'list': watchable_items,
            'max_cards': len(watchable_items)
        })
        i += 1
    context = {
        'type':2,
        'watchable_rows': watchable_rows,
        'search_form': SearchForm()
    }
    return render(request, 'notflix/index.html', context)

@login_required(login_url='/notflix/login')
def tvshows(request):
    # now we need to query movies and tv shows by genre
    # for every genre get movie list for every other genre get tv show list
    watchable_rows = []
    #
    # what do i want to do
    # for each genre
    i = 0
    for genre in Watchable.Genre:
        watchable_items = []
        watchable_items = TvShow.objects.filter(genre=genre)
        
        watchable_rows.append({
            'genre': genre,
            'list': watchable_items,
            'max_cards': len(watchable_items)
        })
        i += 1
    context = {
        'type':1,
        'watchable_rows': watchable_rows,
        'search_form': SearchForm()
    }
    return render(request, 'notflix/index.html', context)

@login_required(login_url='/notflix/login')
def movies(request):
    # now we need to query movies and tv shows by genre
    # for every genre get movie list for every other genre get tv show list
    watchable_rows = []
    #
    # what do i want to do
    # for each genre
    i = 0
    for genre in Watchable.Genre:
        watchable_items = []
        watchable_items = Movie.objects.filter(genre=genre)
        
        watchable_rows.append({
            'genre': genre,
            'list': watchable_items,
            'max_cards': len(watchable_items)
        })
        i += 1
    context = {
        'type':0,
        'watchable_rows': watchable_rows,
        'search_form': SearchForm()
    }
    return render(request, 'notflix/index.html', context)



@login_required
def show_movie(request, id):
    # grab file name by movie name
    movie = Movie.objects.get(pk=id)
    context = {'watchable': movie}
    return render(request, 'notflix/player.html', context)


@login_required
def show_tvshow(request, id):
    # grab file name using TV_SHOWname season and episode
    TV_SHOW = TvShow.objects.get(pk=id)
    context = {'watchable': TV_SHOW}
    return render(request, 'notflix/player.html', context)

@login_required
def get_watchables(request):
    # need to return a list of rows
    # each row has movies and genre
    # for every even
    i = 0
    watchable_type = int(request.GET.get('watchable_type'))
    watchable_rows = []

    for genre in Watchable.Genre:
        if watchable_type == 1:
            watchable_rows.append({
                'genre': genre,
                'list': serializers.serialize('json', Watchable.objects.filter(genre=genre,type=Watchable.WatchableType.TV_SHOW))
            })
        else:
            watchable_rows.append({
                'genre': genre,
                'list': serializers.serialize('json', Watchable.objects.filter(genre=genre,type=Watchable.WatchableType.MOVIE))})
        i+=1

    return JsonResponse({'watchableRowList': watchable_rows, 'status': 'ok'})

def getDisLikeObject(user):
    dislike = None
    try:
        dislike = DisLike.objects.get(user=user)
        return dislike
    except ObjectDoesNotExist:
        dislike = DisLike(user=user)
        dislike.save()#need to save since django requires an id field to be set before doing operations filtering for stuff
        return dislike

def getLikeObject(user):
    like = None
    try:
        like = Like.objects.get(user=user)
        return like
    except ObjectDoesNotExist:
        like = Like(user=user)
        like.save()#need to save since django requires an id field to be set before doing operations filtering for stuff
        return like

@login_required
def toggle_preference(request,preference,type,id):
    # print((preference,type,id))
    #set the like status if unset
    #first check current like status so get the like
    prefObject = None
    prefOppositeObject = None
    if preference == 'like':
        prefObject = getLikeObject(request.user)
        prefOppositeObject = getDisLikeObject(request.user)
    else:
        prefObject = getDisLikeObject(request.user)
        prefOppositeObject = getLikeObject(request.user)
    watchableManyToManyField = None
    oppositeM2MField = None
    watchable = None
    if type == 'movie':
        watchable = Movie.objects.get(pk=id)
        watchableManyToManyField = prefObject.movies
        oppositeM2MField = prefOppositeObject.movies
        #maybe none
    else:
        watchable = TvShow.objects.get(pk=id)
        watchableManyToManyField = prefObject.tvshows
        oppositeM2MField = prefOppositeObject.tvshows
    result = None
    opposite = None
    if watchableManyToManyField:
        result = watchableManyToManyField.all().filter(pk=id)
        # #if result is empty means we are going to like the object
        # #if result is non empty means we are going to unlike the object
    if oppositeM2MField:
        opposite = oppositeM2MField.all().filter(pk=id)
    if result:
        like_status = 'unset'
        #print('un '+preference+' '+type+' => '+ str(id))
        watchableManyToManyField.remove(watchable)
    else:
        #print(preference+' '+type+' => '+ str(id))
        watchableManyToManyField.add(watchable)
        like_status = 'set'
        #only need to unset if we are setting
        if opposite:
            oppositeM2MField.remove(watchable)
    
    prefOppositeObject.save()
    prefObject.save()
    return JsonResponse({'status':'ok','like_status':like_status})

def isPrefSet(pref_obj,type,id):
    prefM2M = None
    if type == 'movie':
        prefM2M = pref_obj.movies
    else:
        prefM2M = pref_obj.tvshows
    if prefM2M:
        if prefM2M.all().filter(pk=id):
            return PREF_SET
    return PREF_UNSET

@login_required
def get_pref(request,type,id):
    #get like or dislike status or unset either 
    #just need to know if there is a like object for current thing
    like_status = 'unset'
    if isPrefSet(getLikeObject(request.user),type,id) == PREF_SET:
        like_status = 'like'
    elif isPrefSet(getDisLikeObject(request.user),type,id) == PREF_SET:
        like_status = 'dislike'
    return JsonResponse({'status':'ok','like_status':like_status})
    

@login_required
def get_movies(request):
    watchable_rows = []
    for genre in Watchable.Genre:
            watchable_rows.append({
                'genre': genre,
                'list': serializers.serialize('json', Movie.objects.filter(genre=genre))
            })
    return JsonResponse({'watchableRowList': watchable_rows, 'status': 'ok'})

@login_required
def get_tvshows(request):
    watchable_rows = []
    for genre in Watchable.Genre:
            watchable_rows.append({
                'genre': genre,
                'list': serializers.serialize('json', TvShow.objects.filter(genre=genre))
            })
    return JsonResponse({'watchableRowList': watchable_rows, 'status': 'ok'})

@login_required
def search_watchables(request):
    search_form = SearchForm()
    # get query string and search all watchable titles
    query_string = request.GET.get('search')
    # filter using query string
    # so what should i search
    # should i search only titles or
    # also years and genre
    # i think also year and genre
    # need to search movie and tv for all
    #watchables = []
    movies = Movie.objects.filter(Q(title__contains=query_string) | Q(year__contains=query_string) | Q(genre__contains=query_string))
    tv_shows = TvShow.objects.filter(Q(title__contains=query_string) | Q(year__contains=query_string) | Q(genre__contains=query_string))
    #interleave or what?
    #should be ranked by significance but its fine
    context = {
        'search_form': search_form,
        'query_string': query_string,
        'movies': movies,
        'tv_shows':tv_shows  # title_matches + genre_matches + year_matches
    }
    return render(request, 'notflix/search_result.html', context)
