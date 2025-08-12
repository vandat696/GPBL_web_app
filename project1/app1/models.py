from django.db import models
import uuid

# Create your models here.

class  Article(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    title=models.TextField(verbose_name="title")
    country=models.TextField(verbose_name="country")
    user_name=models.TextField(default="ゲスト",verbose_name="user_name")
    body=models.TextField(verbose_name="content")
    tag=models.ManyToManyField('Tags',verbose_name="tag",blank=True)
    picture=models.ImageField(upload_to="app1/picture/",null=True,blank=True,verbose_name="picture")
    created=models.DateTimeField(auto_now_add=True,verbose_name="created_date_time")
    edited=models.DateTimeField(auto_now_add=True,verbose_name="edited_date_time")
    likes=models.IntegerField(default=0,verbose_name="likes_count")
    dislikes=models.IntegerField(default=0,verbose_name="dislikes_count")
    comments=models.IntegerField(default=0,verbose_name="comments_count")
    score=models.IntegerField(default=0,verbose_name="score")
    
    def __str__(self):
        return self.title
    
class Tags(models.Model):
    name=models.CharField(max_length=41,unique=True)
    
    def __str__(self):
        return self.name


class Comment(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    article_id=models.ForeignKey(Article,verbose_name="ArticleID",on_delete=models.CASCADE)
    user_name=models.TextField(default="ゲスト",verbose_name="user_name")
    body=models.TextField(verbose_name="comment")
    created=models.DateTimeField(auto_now_add=True,verbose_name="created_date_time")

    def __str__(self):
        return self.body

class UserName(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    user_name=models.CharField(max_length=50,verbose_name="ユーザ名")
    password=models.CharField(max_length=50,null=True,blank=True,verbose_name="パスワード")
    score=models.IntegerField(default=0,verbose_name="スコア")
    def __str__(self):
        return self.user_name

class GuideBook(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    title=models.TextField(verbose_name="タイトル")
    body=models.TextField(verbose_name="本文")
    tag=models.TextField(default="タグ指定なし",verbose_name="タグ")
    created=models.DateTimeField(null=True,auto_now_add=True,verbose_name="作成時間")
    articles=models.IntegerField(null=True,verbose_name="参照した投稿の数")
    def __str__(self):
        return self.title