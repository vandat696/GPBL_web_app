from django.contrib import admin
from .models import Article,Comment,UserName,Tags

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    readonly_fields=["id"]

admin.site.register(Comment)
admin.site.register(UserName)

@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    readonly_fields=["id"]