from django.contrib import admin
from .models import Article,Comment,UserName,Tags,GuideBook

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    readonly_fields=["id"]

admin.site.register(Comment)
admin.site.register(UserName)

@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    readonly_fields=["id"]

@admin.register(GuideBook)
class TagsAdmin(admin.ModelAdmin):
    readonly_fields=["id"]