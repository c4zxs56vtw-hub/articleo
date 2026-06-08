from django.db import models
from django.contrib.auth.models import User

class Categorie(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return self.nom

class Article(models.Model):
    titre = models.CharField(max_length=100)
    contenu = models.TextField()
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True, blank=True, related_name='articles')
    likes = models.ManyToManyField(User, related_name='liked_articles', blank=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titre
    
class Commentaire(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='commentaires')
    auteur = models.CharField(max_length=50)
    texte = models.TextField()
    likes = models.ManyToManyField(User, related_name='liked_commentaires', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Commentaire de {self.auteur} '    

from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    location = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return f"Profil de {self.user.username}"

@receiver(post_save, sender=User)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
        else:
            UserProfile.objects.create(user=instance)

class Signet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='signets')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='signets')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'article')

    def __str__(self):
        return f"Signet de {self.user.username} sur {self.article.titre}"

class Quiz(models.Model):
    titre = models.CharField(max_length=150)
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE, related_name='quizzes')
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre} ({self.categorie.nom})"

class Question(models.Model):
    CHOIX_REPONSE = [
        ('A', 'Option A'),
        ('B', 'Option B'),
        ('C', 'Option C'),
        ('D', 'Option D')
    ]
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    texte = models.TextField()
    choix_a = models.CharField(max_length=200)
    choix_b = models.CharField(max_length=200)
    choix_c = models.CharField(max_length=200)
    choix_d = models.CharField(max_length=200)
    reponse_correcte = models.CharField(max_length=1, choices=CHOIX_REPONSE)
    explication = models.TextField(blank=True, default='')

    def __str__(self):
        return f"Q: {self.texte[:50]}..."
