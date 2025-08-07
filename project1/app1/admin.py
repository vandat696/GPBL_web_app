from django.contrib import admin
from .models import Article,Comment

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    readonly_fields=["id"]

admin.site.register(Comment)