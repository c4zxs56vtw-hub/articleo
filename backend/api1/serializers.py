from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Article, Commentaire, UserProfile, Categorie, Signet, Quiz, Question
from rest_framework.authtoken.models import Token

def get_user_has_liked_helper(serializer, obj):
    request = serializer.context.get('request')
    if request and request.user and request.user.is_authenticated:
        return obj.likes.filter(id=request.user.id).exists()
    return False

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    user_has_liked = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = '__all__'

    def get_user_has_liked(self, obj):
        return get_user_has_liked_helper(self, obj)

class ArticleReadSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    user_has_liked = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = '__all__'
        depth = 1

    def get_user_has_liked(self, obj):
        return get_user_has_liked_helper(self, obj)

class CommentaireSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    user_has_liked = serializers.SerializerMethodField()

    class Meta:
        model = Commentaire
        fields = '__all__'  

    def get_user_has_liked(self, obj):
        return get_user_has_liked_helper(self, obj)

class CommentaireReadSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    user_has_liked = serializers.SerializerMethodField()

    class Meta:
        model = Commentaire
        fields = '__all__'
        depth = 1  # Permet d'inclure les données de l'article lié dans la réponse du commentaire

    def get_user_has_liked(self, obj):
        return get_user_has_liked_helper(self, obj)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'location']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    bio = serializers.CharField(write_only=True, required=False, allow_blank=True, default='')
    location = serializers.CharField(write_only=True, required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'bio', 'location']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        if not attrs.get('email'):
            raise serializers.ValidationError({"email": "L'adresse email est requise."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Cette adresse email est déjà utilisée."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        bio = validated_data.pop('bio', '')
        location = validated_data.pop('location', '')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        profile = user.profile
        profile.bio = bio
        profile.location = location
        profile.save()
        
        return user

class SignetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signet
        fields = ['id', 'article', 'created_at']
        read_only_fields = ['user']

class SignetReadSerializer(serializers.ModelSerializer):
    article = ArticleReadSerializer(read_only=True)

    class Meta:
        model = Signet
        fields = ['id', 'article', 'created_at']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    categorie_name = serializers.CharField(source='categorie.nom', read_only=True)
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'titre', 'description', 'categorie', 'categorie_name', 'questions_count', 'created_at']

class QuizDetailSerializer(serializers.ModelSerializer):
    categorie_name = serializers.CharField(source='categorie.nom', read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'titre', 'description', 'categorie', 'categorie_name', 'questions', 'created_at']