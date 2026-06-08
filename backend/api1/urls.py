from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# On crée le routeur
router = DefaultRouter()
# On y enregistre notre ViewSet
router.register(r'articles', views.ArticleViewSet)
router.register(r'commentaires', views.CommentaireViewSet, basename='commentaires')
router.register(r'categories', views.CategorieViewSet)
router.register(r'signets', views.SignetViewSet, basename='signets')
router.register(r'quizzes', views.QuizViewSet, basename='quizzes')

urlpatterns = [
    # On inclut toutes les URL générées automatiquement par le routeur
    path('api/', include(router.urls)),
    path('api/login/', obtain_auth_token),
    path('api/register/', views.UserRegisterView.as_view(), name='register'),
    path('api/profile/', views.UserProfileView.as_view(), name='profile'),
]