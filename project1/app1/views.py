from django.shortcuts import render,redirect,get_object_or_404
from django.views import View
from .forms import ArticleModelForm,CommentForm
from .models import Article,Comment
# Create your views here.

class IndexView(View):
    def get(self,request):
        form=ArticleModelForm()
        articles=Article.objects.all()
        comments=Comment.objects.all()
        return render(request,"app1/index.html",{"form":form,"articles":articles,"comments":comments})
    def post(self,request):
        form=ArticleModelForm(request.POST,request.FILES)
        if form.is_valid():
            form.save()
            return redirect("app1:index")
        form=ArticleModelForm()
        return render(request,"app1/index.html",{"form":form})


class CommentView(View):
    def get(self,request,id):
        article=get_object_or_404(Article,id=id)
        form=CommentForm()
        return render(request,"app1/comment_post.html",{"form":form,"article":article})
    def post(self,request,id):
        form = CommentForm(request.POST)
        article=get_object_or_404(Article,id=id)
        if form.is_valid():
            form_body = form.cleaned_data.get('body')
            comment=Comment()
            comment.article_id=article
            comment.body=str(form_body)
            comment.save()

            article=get_object_or_404(Article,id=id)
            article.comments=article.comments+1
            article.save()
            return redirect("app1:index")
        return render(request,"app1/index.html",{"form":form})

class SearchView(View):
    def get(self,request):
        all_article=Article.object.all()
        return render(request,"app1/index.html",{"select_article":all_article})


class LikeView(View):
    def get(self,request,id):
        article=get_object_or_404(Article,id=id)
        article.likes=article.likes+1
        article.save()
        return redirect("app1:index")


class DislikeView(View):
    def get(self,request,id):
        article=get_object_or_404(Article,id=id)
        article.dislikes=article.dislikes+1
        article.save()
        return redirect("app1:index")



index=IndexView.as_view()
comment_post=CommentView.as_view()
search=SearchView.as_view()
like_add=LikeView.as_view()
dislike_add=DislikeView.as_view()