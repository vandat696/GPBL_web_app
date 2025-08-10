from django import forms
from .models import Article,Comment,UserName
from django.forms import ModelForm


class ArticleForm(forms.Form):
    country_coices=(("Vietnam", "Vietnam"),
    ("Japan", "Japan"),
    ("America", "America"),
    ("France", "France"),)
    
    title=forms.CharField(label="title")
    country=forms.ChoiceField(label="country",choices=country_coices)
    body=forms.CharField(label="content")
    tags=forms.CharField(required=True,label="tags")
    picture=forms.ImageField(required=False,label="picture")

    def clean_article(self):
        country=self.cleaned_data["country"]
        if "default" in country:
            raise forms.ValidationError("国を選択してください")
        return country



class ArticleModelForm(ModelForm):
    class Meta:
        model=Article
        fields=["title","country","tag","body","picture"]
        widgets = {
            "tag": forms.CheckboxSelectMultiple()
        }

class CommentForm(ModelForm):
    class Meta:
        model=Comment
        fields=["body"]

class UserRegistrationForm(ModelForm):
    class Meta:
        model=UserName
        fields=["user_name","password"]