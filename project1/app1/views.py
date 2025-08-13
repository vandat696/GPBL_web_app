from datetime import timedelta, timezone
from django.shortcuts import render,redirect,get_object_or_404
from django.views import View
from .forms import ArticleModelForm,CommentForm,UserRegistrationForm
from .models import Article,Comment,Tags,UserName,GuideBook
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.db.models import Q
from google import genai
cliant=genai.Client(api_key="AIzaSyCprYIJp44VWLGc-DK3pZigDmYapOAucDE")
#apiキーはこのアプリ以外で使用しないでください
#commentcomment

def create_summary(id):
    #反応が上位10件の投稿を抽出する
    articles = Article.objects.filter(tag__id=id).order_by('-score')
    max=10
    if max>len(articles):
        max=len(articles)
    tag_name=str(Tags.objects.get(id=id))
    #プロンプトを決める
    prompt="""
    以下の投稿とコメントを制約条件に基づいて要約してください。
    制約条件
    ・「分かりました」などの返事はせず、要約の文章のみを答えてください。
    ・要約はガイドブックの文章風に作成して、一つの文章にまとめてください。
    ・文章には何かの問題を解決する方法を必ず入れてください。
    ・全体が"""+tag_name+"""に一切関係ない投稿や、明らかに嘘の投稿は無視してください。
    ・「質問に対する返答または情報の補足」以外のコメントは無視してください。
    ・太文字や改行は使わずに、文字のみを使ってください。
    """
    article_count=1
    for article in articles:
        prompt=prompt+"\n投稿"+str(article_count)+"\n"
        prompt=prompt+str(article.body)+"\n"
        comments = Comment.objects.filter(article_id=article).order_by('created')
        if len(comments)!=0:
            prompt=prompt+"投稿"+str(article_count)+"に対するコメント\n"
            for comment in comments:
                prompt=prompt+"・"+str(comment.body)+"\n"
        article_count=article_count+1
    #print(prompt)
    response=cliant.models.generate_content(model="gemini-2.0-flash-lite",contents=prompt)
    response=str(response.text)
    #print(response)
    guidebook = GuideBook.objects.get(tag__name=tag_name)
    guidebook.body=response
    guidebook.save()
    return response




class IndexView(View):
    def get(self,request):
        form=ArticleModelForm()
        tag_id=request.GET.getlist('tag')
        keyword=request.GET.get('q')
        articles=Article.objects.all()
        if tag_id:
            for tid in tag_id:
                articles = articles.filter(tag__id=tid)
            articles=articles.distinct()
        if keyword:
            articles=articles.filter(Q(title__icontains=keyword) | Q(body__icontains=keyword))
        comments=Comment.objects.all()
        tags=Tags.objects.all()
        return render(request,"app1/index.html",{"form":form,"articles":articles,"comments":comments,"tags":tags,"selected_tags":tag_id,"keyword":keyword})
    
class GeneralView(View):
    def get(self, request):
        # Logic for FAQ page
        tags = Tags.objects.all()
        tag_id = request.GET.getlist('tag')
        keyword = request.GET.get('q')
        guidebooks = GuideBook.objects.all()
        
        if tag_id:
            for tid in tag_id:
                guidebooks = guidebooks.filter(tag__id=tid)
            guidebooks = guidebooks.distinct()
        
        if keyword:
            guidebooks = guidebooks.filter(Q(title__icontains=keyword) | Q(body__icontains=keyword))
        context = {
            'tags': tags,
            'guidebooks' :guidebooks
        }
        return render(request, 'app1/general.html', context)

class DiscussionsView(View):
    def get(self, request):
        # Logic for discussions
        form = ArticleModelForm()
        tag_id = request.GET.getlist('tag')
        keyword = request.GET.get('q')
        articles = Article.objects.all().order_by("-created")
        
        if tag_id:
            for tid in tag_id:
                articles = articles.filter(tag__id=tid)
            articles = articles.distinct()
        
        if keyword:
            articles = articles.filter(Q(title__icontains=keyword) | Q(body__icontains=keyword))
        
        for article in articles:
            try:
                if article.user_name != "ゲスト":
                    user_obj = UserName.objects.get(user_name=article.user_name)
                    score = user_obj.score
                    if score < 100:
                        article.rank1_user = True
                    elif 200 <= score < 300:
                        article.rank2_user = True
                    elif 300 <= score < 400:
                        article.rank3_user = True
                    elif 400 <= score < 500:
                        article.rank4_user = True
                    elif 500 <= score < 600:
                        article.rank5_user = True
                    elif 600 <= score < 700:
                        article.rank6_user = True
                    elif 700 <= score < 800:
                        article.rank7_user = True
                    elif 800 <= score < 900:
                        article.rank8_user = True
                    elif 900 <= score < 1000:
                        article.rank9_user = True
                    elif score >= 1000:
                        article.rank10_user = True
                    else:
                        article.rank1_user = True
                else:
                    article.is_new_user = False
            except UserName.DoesNotExist:
                article.is_new_user = False
        
        comments = Comment.objects.all()
        tags = Tags.objects.all()
        
        context = {
            'form': form,
            'articles': articles,
            'comments': comments,
            'tags': tags,
            'selected_tags': tag_id,
            'keyword': keyword
        }
        return render(request, 'app1/discussions.html', context)
    
    def post(self, request):
        # Logic post same as IndexView
        form = ArticleModelForm(request.POST, request.FILES)
        if form.is_valid():
            form_body = form.cleaned_data.get('body')
            form.save()
            print("投稿を保存しました")
            article = Article.objects.get(body=form_body)
            #print("タグ一覧："+str(article.tag.all()))
            if article.tag.all():
                for tag in article.tag.all():
                    #print("タグ："+str(tag.id))
                    create_summary(int(tag.id))
            user = str(request.user)
            print("user:" + user)
            if user == "AnonymousUser":
                article.user_name = "ゲスト"
            else:
                article.user_name = str(user)
            article.save()
        else:
            print("投稿を保存できませんでした")
        
        return redirect('app1:discussions')

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
            user = str(request.user)
            if user=="AnonymousUser":
                comment.user_name="ゲスト"
            else:
                comment.user_name=str(user)
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
        keyword=request.GET.get('q')
        if tag_id=='1':
            return redirect("app1:discussions")
        params=request.GET.copy()
        if tag_id:
            if not tag_id in request.GET.getlist('tag'):
                params.appendlist('tag',tag_id)
        if keyword:
            params['q']=keyword
        return redirect(f"/discussions/?{params.urlencode()}")
    
class SearchGuidebookView(View):
    def get(self,request):
        tag_id=request.GET.get('tag')
        keyword=request.GET.get('q')
        if tag_id=='1':
            return redirect("app1:discussions")
        params=request.GET.copy()
        if tag_id:
            if not tag_id in request.GET.getlist('tag'):
                params.appendlist('tag',tag_id)
        if keyword:
            params['q']=keyword
        return redirect(f"/general/?{params.urlencode()}")


class LikeView(View):
    def get(self,request,id):
        article=get_object_or_404(Article,id=id)
        article.likes=article.likes+1
        article.score=article.likes-article.dislikes*2
        article.save()
        if article.user_name != "ゲスト":
            user=get_object_or_404(UserName,user_name=article.user_name)
            user.score=user.score+1
            user.save()
        return redirect("app1:discussions")


class DislikeView(View):
    def get(self,request,id):
        article=get_object_or_404(Article,id=id)
        article.dislikes=article.dislikes+1
        article.score=article.likes-article.dislikes*2
        article.save()
        if article.user_name != "ゲスト":
            user=get_object_or_404(UserName,user_name=article.user_name)
            user.score=user.score-2
            user.save()
        return redirect("app1:discussions")


class CommentLikeView(View):
    def get(self,request,id):
        comment=get_object_or_404(Comment,id=id)
        comment.likes=comment.likes+1
        comment.save()
        if comment.user_name != "ゲスト":
            user=get_object_or_404(UserName,user_name=comment.user_name)
            user.score=user.score+1
            user.save()
        return redirect("app1:discussions")


class CommentDislikeView(View):
    def get(self,request,id):
        comment=get_object_or_404(Comment,id=id)
        comment.dislikes=comment.dislikes+1
        comment.save()
        if comment.user_name != "ゲスト":
            user=get_object_or_404(UserName,user_name=comment.user_name)
            user.score=user.score-2
            user.save()
        return redirect("app1:discussions")


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

class CreateGuideBookView(View):
    def get(self,request,id):
        create_summary(id)
        return redirect("app1:index")
            

class CalculateScoreView(View):
    def get(self,request):
        articles = Article.objects.all()
        for article in articles:
            article.score=article.likes-article.dislikes*2
            article.save()
        return redirect("app1:index")

class GuideBookDetailView(View):
    def get(self,request,tag):
        guidebook=GuideBook.objects.get(tag__name=tag)
        articles = Article.objects.all().order_by('-score')
        tid=Tags.objects.get(name=tag).id
        articles = articles.filter(tag__id=tid).order_by('-score')
        articles = articles.distinct()
        comments = Comment.objects.all()
        tags = Tags.objects.all()
        return render(request,"app1/guidebookdetail.html",{"guidebook":guidebook,"articles":articles,"comments":comments})



index=IndexView.as_view()
general = GeneralView.as_view()
discussions = DiscussionsView.as_view()
comment_post=CommentView.as_view()
search=SearchView.as_view()
like_add=LikeView.as_view()
dislike_add=DislikeView.as_view()
comment_like_add=CommentLikeView.as_view()
comment_dislike_add=CommentDislikeView.as_view()
user_resistration=UserRegistrationView.as_view()
ranking=RankingView.as_view()
caluculate_score=CalculateScoreView.as_view()
create_guide_book=CreateGuideBookView.as_view()
search_guide=SearchGuidebookView.as_view()
guidebookdetail=GuideBookDetailView.as_view()