from django.shortcuts import render,redirect
from django.views import View
from .forms import ArticleForm,ArticleModelForm
# Create your views here.

class IndexView(View):
    def get(self,request):
        form=ArticleModelForm()
        return render(request,"app1/index.html",{"form":form})
    def post(self,request):
        form=ArticleModelForm(request.POST,request.FILES)
        if form.is_valid():
            form.save()
            return redirect("app1:index")
        return render(request,"app1/index.html",{"form":form})


index=IndexView.as_view()