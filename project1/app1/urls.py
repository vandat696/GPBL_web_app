from django.urls import path
from . import views
app_name="app1"

urlpatterns=[
  path("",views.index , name="index"),
  path("comment/post/<uuid:id>",views.comment_post , name="comment_post"),
  path("search",views.search , name="search"),
  path("like/add/<uuid:id>",views.like_add , name="like_add"),
  path("dislike/add/<uuid:id>",views.dislike_add , name="dislike_add"),

] 