from django.shortcuts import render
from django.views import View
from .forms import ArticleForm
# Create your views here.

class IndexView(View):
    def get(self,request):
        form=ArticleForm()
        return render(request,"app1/index.html",{"form":form})

index=IndexView.as_view()