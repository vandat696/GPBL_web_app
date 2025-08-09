from django.contrib import admin
from .models import Article,Comment,UserName,Tags

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    readonly_fields=["id"]

admin.site.register(Comment)
admin.site.register(UserName)
admin.site.register(Tags)