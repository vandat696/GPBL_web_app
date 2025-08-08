from django.db import models
import uuid

# Create your models here.

class  Article(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    #user_name=models.TextField(default="なし",null=True,verbose_name="user_name")
    title=models.TextField(verbose_name="title")
    country=models.TextField(verbose_name="country")
    body=models.TextField(verbose_name="content")
    tag=models.ManyToManyField(default="なし",verbose_name="tag")
    picture=models.ImageField(upload_to="app1/picture/",null=True,blank=True,verbose_name="picture")
    created=models.DateTimeField(auto_now_add=True,verbose_name="created_date_time")
    edited=models.DateTimeField(auto_now_add=True,verbose_name="edited_date_time")
    likes=models.IntegerField(default=0,verbose_name="likes_count")
    dislikes=models.IntegerField(default=0,verbose_name="dislikes_count")
    comments=models.IntegerField(default=0,verbose_name="comments_count")
    
    def __str__(self):
        return self.title
    
class Tags(models.Model):
    name=models.CharField(max_length=30,unique=True)
    
    def __str__(self):
        return self.name


class Comment(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    article_id=models.ForeignKey(Article,verbose_name="ArticleID",on_delete=models.CASCADE)
    body=models.TextField(verbose_name="comment")
    created=models.DateTimeField(auto_now_add=True,verbose_name="created_date_time")

    def __str__(self):
        return self.body

# class UserName(models.Model):
#     id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
#     user_name=models.TextField(verbose_name="UserID")
#     score=models.IntegerField(default=0,verbose_name="score")

#     def __str__(self):
#         return self.user_name
