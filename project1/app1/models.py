from django.db import models
import uuid

# Create your models here.

class  Article(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    title=models.TextField(verbose_name="title")
    country=models.TextField(verbose_name="country")
    body=models.TextField(verbose_name="content")
    tag=models.TextField(default="なし",verbose_name="tag")
    picture=models.ImageField(upload_to="app1/picture/",null=True,blank=True,verbose_name="picture")
    created=models.DateTimeField(auto_now_add=True,verbose_name="created_date_time")
    edited=models.DateTimeField(auto_now_add=True,verbose_name="edited_date_time")
    likes=models.IntegerField(default=0,verbose_name="likes_count")
    dislikes=models.IntegerField(default=0,verbose_name="dislikes_count")
    comments=models.IntegerField(default=0,verbose_name="comments_count")
    
    def __str__(self):
        return self.title


class Article_tag(models.Model):
    article_id=models.ForeignKey(Article,verbose_name="ArticleID",on_delete=models.CASCADE)
    tag=models.CharField(max_length=100,verbose_name="tag")

    def __str__(self):
        return self.tag