from django.shortcuts import render
# Create your views here.
def index(request):
    return render(request,'main_app/index.html')#context)


def index_alt(request):
    return render(request,'main_app/index_alt.html')