from django.urls import path
from . import views
app_name="app1"

urlpatterns=[
  path("",views.index , name="index"),
  path('general/', views.general, name='general'),
  path('discussions/', views.discussions, name='discussions'),
  path("comment/post/<uuid:id>",views.comment_post , name="comment_post"),
  path("search",views.search , name="search"),
  path("like/add/<uuid:id>",views.like_add , name="like_add"),
  path("dislike/add/<uuid:id>",views.dislike_add , name="dislike_add"),
  path("user_resistration/",views.user_resistration , name="user_resistration"),
  path("discussions/ranking/",views.ranking , name="ranking"),
  path("calculate/score",views.caluculate_score , name="caluculate_score"),
  path("create_guide_book/<int:id>",views.create_guide_book, name="create_guide_book"),
  path("search/guide",views.search_guide , name="search_guide"),
  path("general/detail/<str:tag>",views.guidebookdetail,name="guidebookdetail"),
]