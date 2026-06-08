from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Article, Commentaire, Categorie, Signet
from .serializers import ArticleSerializer, ArticleReadSerializer, CommentaireSerializer, CommentaireReadSerializer, CategorieSerializer, SignetSerializer, SignetReadSerializer

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'description']
    ordering_fields = ['nom']
    ordering = ['nom']

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titre', 'contenu']
    ordering_fields = ['created_at', 'titre', 'views_count']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ArticleReadSerializer
        return ArticleSerializer

    def get_queryset(self):
        queryset = Article.objects.all().order_by('-created_at')
        categorie_id = self.request.query_params.get('categorie')
        if categorie_id is not None:
            queryset = queryset.filter(categorie=categorie_id)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def similaires(self, request, pk=None):
        article = self.get_object()
        if article.categorie:
            queryset = Article.objects.filter(categorie=article.categorie).exclude(id=article.id).order_by('-views_count', '-created_at')
        else:
            queryset = Article.objects.none()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ArticleReadSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = ArticleReadSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        article = self.get_object()
        user = request.user
        if article.likes.filter(id=user.id).exists():
            article.likes.remove(user)
            liked = False
        else:
            article.likes.add(user)
            liked = True
        return Response({
            "liked": liked,
            "likes_count": article.likes.count()
        })


class CommentaireViewSet(viewsets.ModelViewSet):
    queryset = Commentaire.objects.all().order_by('-created_at')
    serializer_class = CommentaireSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['auteur', 'texte']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CommentaireReadSerializer
        return CommentaireSerializer

    def get_queryset(self):
        commentaires = Commentaire.objects.all().order_by('-created_at')

        article_id = self.request.query_params.get('article')
        if article_id is not None:
            commentaires = commentaires.filter(article=article_id)
        return commentaires    

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        commentaire = self.get_object()
        user = request.user
        if commentaire.likes.filter(id=user.id).exists():
            commentaire.likes.remove(user)
            liked = False
        else:
            commentaire.likes.add(user)
            liked = True
        return Response({
            "liked": liked,
            "likes_count": commentaire.likes.count()
        })

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import UserRegisterSerializer, UserSerializer, UserProfileSerializer

class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            user_serializer = UserSerializer(user)
            return Response({
                "token": token.key,
                "user": user_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        # Mettre à jour l'utilisateur
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        # Mettre à jour les infos de profil si elles sont fournies
        profile_data = request.data.get('profile', {})
        profile_serializer = UserProfileSerializer(user.profile, data=profile_data, partial=True)

        if user_serializer.is_valid() and profile_serializer.is_valid():
            user_serializer.save()
            profile_serializer.save()
            return Response(UserSerializer(user).data)
        
        errors = {}
        errors.update(user_serializer.errors)
        errors.update(profile_serializer.errors)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)

class SignetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return SignetReadSerializer
        return SignetSerializer

    def get_queryset(self):
        return Signet.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)