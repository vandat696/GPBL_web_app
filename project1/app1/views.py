from django.shortcuts import render,redirect,get_object_or_404
from django.views import View
from .forms import ArticleForm,ArticleModelForm,CommentForm
from .models import Article 
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


class CommentView(View):
    def get(self,request,id):
        form=CommentForm()
        article=get_object_or_404(Article,id=id)
        return render(request,"app1/comment_post.html",{"form":form,"article":article})


index=IndexView.as_view()
comment_post=CommentView.as_view()