from django.shortcuts import render,redirect,get_object_or_404
from django.views import View
from .forms import ArticleModelForm,CommentForm,UserRegistrationForm
from .models import Article,Comment,Tags,UserName
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User

class IndexView(View):
    def get(self,request):
        form=ArticleModelForm()
        tag_id=request.GET.get('tag')
        if tag_id:
            articles=Article.objects.filter(tag__id=tag_id)
        else:
            articles=Article.objects.all()
        comments=Comment.objects.all()
        tags=Tags.objects.all()
        user = request.user
        print("ユーザーは"+str(user))
        return render(request,"app1/index.html",{"form":form,"articles":articles,"comments":comments,"tags":tags})
    def post(self,request):
        form=ArticleModelForm(request.POST,request.FILES)
        if form.is_valid():
            form_body = form.cleaned_data.get('body')
            form.save()
            print("投稿を保存しました")
            article=get_object_or_404(Article,body=form_body)
            print("article.title="+article.title)
            user = request.user
            article.user_name=str(user)
            article.save()
    
        else:
            print("投稿を保存できませんでした")
        form=ArticleModelForm()
        tag_id=request.GET.get('tag')
        if tag_id:
            articles=Article.objects.filter(tag__id=tag_id)
        else:
            articles=Article.objects.all()
        comments=Comment.objects.all()
        tags=Tags.objects.all()
        return render(request,"app1/index.html",{"form":form,"articles":articles,"comments":comments,"tags":tags})


class CommentView(View):
    def get(self,request,id):
        article = get_object_or_404(Article, id=id)
        form = CommentForm()
        # Load post's comment
        comments = Comment.objects.filter(article_id=article).order_by('created')
        return render(request, "app1/comment_post.html", {
            "form": form,
            "article": article,
            "comments": comments,
        })
    def post(self,request,id):
        form = CommentForm(request.POST)
        article = get_object_or_404(Article, id=id)
        if form.is_valid():
            form_body = form.cleaned_data.get('body')
            comment = Comment()
            comment.article_id = article
            comment.body = str(form_body)
            comment.user_name=request.user
            comment.save()

            article.comments = article.comments + 1
            article.save()
            # After add comment, reload post's comment
            comments = Comment.objects.filter(article_id=article).order_by('created')
            form = CommentForm()
            return render(request, "app1/comment_post.html", {
                "form": form,
                "article": article,
                "comments": comments,
            })
        comments = Comment.objects.filter(article_id=article).order_by('created')
        return render(request, "app1/comment_post.html", {
            "form": form,
            "article": article,
            "comments": comments,
        })

class SearchView(View):
    def get(self,request):
        tag_id=request.GET.get('tag')
        if tag_id:
            return redirect(f"/?tag={tag_id}")
        else:
            return redirect("")


class LikeView(View):
    def get(self,request,id):
        article=get_object_or_404(Article,id=id)
        article.likes=article.likes+1
        article.save()
        if article.user_name != "ゲスト":
            user=get_object_or_404(UserName,user_name=article.user_name)
            user.score=user.score+1
            user.save()
        return redirect("app1:index")


class DislikeView(View):
    def get(self,request,id):
        article=get_object_or_404(Article,id=id)
        article.dislikes=article.dislikes+1
        article.save()
        if article.user_name != "ゲスト":
            user=get_object_or_404(UserName,user_name=article.user_name)
            user.score=user.score-2
            user.save()
        return redirect("app1:index")

class UserRegistrationView(View):
    def get(self,request):
        form = UserRegistrationForm()
        return render(request,"app1/user_registration.html",{"form":form})
    def post(self,request):
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form_user_name = form.cleaned_data.get('user_name')
            form_password=form.cleaned_data.get('password')
            form.save()
            user = User.objects.create_user(form_user_name,"", form_password)
            user=get_object_or_404(UserName,user_name=form_user_name)
            user.password=""
            #print("ユーザ名："+form_user_name+"パスワード："+form_password)
        return redirect("app1:index")

class RankingView(View):
    def get(self,request):     
        users = UserName.objects.all().order_by('-score')
        return render(request,"app1/ranking.html",{"users":users})



index=IndexView.as_view()
comment_post=CommentView.as_view()
search=SearchView.as_view()
like_add=LikeView.as_view()
dislike_add=DislikeView.as_view()
user_resistration=UserRegistrationView.as_view()
ranking=RankingView.as_view()