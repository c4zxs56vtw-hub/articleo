from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Article, Commentaire, Categorie, Signet
import time

class ArticleAPITests(APITestCase):
    def setUp(self):
        # Création d'un utilisateur de test
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Création du Token pour cet utilisateur
        self.token = Token.objects.create(user=self.user)
        # Création d'un article existant
        self.article = Article.objects.create(titre="Article Initial", contenu="Contenu de test")
        
    def test_list_articles_anonymous(self):
        """Les utilisateurs anonymes peuvent lister les articles (avec pagination)."""
        response = self.client.get('/api/articles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Avec la pagination globale activée, la réponse contient les clés 'count', 'next', 'previous', 'results'
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['titre'], "Article Initial")

    def test_retrieve_article_anonymous(self):
        """Les utilisateurs anonymes peuvent lire un article spécifique."""
        response = self.client.get(f'/api/articles/{self.article.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['titre'], "Article Initial")

    def test_create_article_anonymous_fails(self):
        """La création d'un article par un anonyme doit être bloquée (401)."""
        data = {"titre": "Nouvel Article", "contenu": "Contenu du nouvel article"}
        response = self.client.post('/api/articles/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_article_authenticated(self):
        """Un utilisateur authentifié peut créer un article."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        data = {"titre": "Article Connecté", "contenu": "Contenu de l'article connecté"}
        response = self.client.post('/api/articles/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Article.objects.count(), 2)

    def test_update_article_anonymous_fails(self):
        """La modification d'un article par un anonyme doit être bloquée (401)."""
        data = {"titre": "Titre Modifié", "contenu": "Nouveau contenu"}
        response = self.client.put(f'/api/articles/{self.article.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_article_authenticated(self):
        """Un utilisateur authentifié peut modifier un article."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        data = {"titre": "Titre Modifié", "contenu": "Nouveau contenu"}
        response = self.client.put(f'/api/articles/{self.article.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.article.refresh_from_db()
        self.assertEqual(self.article.titre, "Titre Modifié")

    def test_delete_article_anonymous_fails(self):
        """La suppression d'un article par un anonyme doit être bloquée (401)."""
        response = self.client.delete(f'/api/articles/{self.article.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_article_authenticated(self):
        """Un utilisateur authentifié peut supprimer un article."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.delete(f'/api/articles/{self.article.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Article.objects.count(), 0)

    def test_articles_pagination(self):
        """Vérifie que la pagination limite à 10 éléments par page."""
        # On a déjà 1 article issu de setUp. On en crée 11 de plus (total: 12)
        for i in range(11):
            Article.objects.create(titre=f"Article {i}", contenu="Contenu")
        
        response = self.client.get('/api/articles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 12)
        self.assertEqual(len(response.data['results']), 10)  # Limite par page configurée à 10
        self.assertIsNotNone(response.data['next']) # Un lien vers la page suivante existe

    def test_articles_search(self):
        """Vérifie la recherche d'articles via le paramètre ?search=."""
        Article.objects.create(titre="Tutoriel Django", contenu="Apprendre le développement web")
        Article.objects.create(titre="Recette de cuisine", contenu="Faire des crêpes")
        
        response = self.client.get('/api/articles/?search=Django')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['titre'], "Tutoriel Django")

    def test_articles_ordering(self):
        """Vérifie le tri des articles via le paramètre ?ordering=."""
        # On attend un peu pour garantir la différence de timestamp si besoin,
        # ou on vérifie le tri alphabétique sur le titre.
        a = Article.objects.create(titre="Alpha", contenu="Contenu A")
        b = Article.objects.create(titre="Zeta", contenu="Contenu Z")
        
        # Tri ascendant par titre
        response = self.client.get('/api/articles/?ordering=titre')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        titres = [item['titre'] for item in results]
        # On vérifie que "Alpha" apparaît avant "Zeta"
        self.assertTrue(titres.index("Alpha") < titres.index("Zeta"))
        
        # Tri descendant par titre
        response = self.client.get('/api/articles/?ordering=-titre')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        titres_desc = [item['titre'] for item in results]
        self.assertTrue(titres_desc.index("Zeta") < titres_desc.index("Alpha"))


class CommentaireAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.article = Article.objects.create(titre="Article Test", contenu="Description")
        self.commentaire = Commentaire.objects.create(
            article=self.article, 
            auteur="Alice", 
            texte="Premier commentaire"
        )

    def test_list_commentaires(self):
        """Vérifie la récupération de la liste des commentaires (avec pagination)."""
        response = self.client.get('/api/commentaires/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['auteur'], "Alice")
        # Vérification de l'inclusion de la relation grâce à depth = 1
        self.assertEqual(response.data['results'][0]['article']['titre'], "Article Test")

    def test_filter_commentaires_by_article(self):
        """Vérifie le filtrage des commentaires par article (avec pagination)."""
        autre_article = Article.objects.create(titre="Autre Article", contenu="Autre Description")
        Commentaire.objects.create(article=autre_article, auteur="Bob", texte="Commentaire Bob")
        
        response = self.client.get(f'/api/commentaires/?article={self.article.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['auteur'], "Alice")

    def test_create_commentaire_anonymous_fails(self):
        """La création d'un commentaire par un utilisateur anonyme doit être bloquée."""
        data = {
            "article": self.article.id,
            "auteur": "Charlie",
            "texte": "Nouveau commentaire anonyme"
        }
        response = self.client.post('/api/commentaires/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_commentaire_authenticated(self):
        """Un utilisateur authentifié peut créer un commentaire avec succès."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        data = {
            "article": self.article.id,
            "auteur": "Charlie",
            "texte": "Nouveau commentaire de test"
        }
        response = self.client.post('/api/commentaires/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Commentaire.objects.count(), 2)


class UserAccountAPITests(APITestCase):
    def test_user_registration_success(self):
        """L'inscription d'un utilisateur avec des données valides doit réussir."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "strongpassword123",
            "password_confirm": "strongpassword123",
            "first_name": "Jean",
            "last_name": "Dupont",
            "bio": "Développeur Python",
            "location": "Paris"
        }
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], "newuser")
        self.assertEqual(response.data['user']['profile']['bio'], "Développeur Python")
        self.assertEqual(response.data['user']['profile']['location'], "Paris")
        
        # Vérification en base de données
        self.assertTrue(User.objects.filter(username="newuser").exists())
        user = User.objects.get(username="newuser")
        self.assertEqual(user.profile.bio, "Développeur Python")

    def test_user_registration_password_mismatch(self):
        """L'inscription doit échouer si les mots de passe ne correspondent pas."""
        data = {
            "username": "baduser",
            "email": "baduser@example.com",
            "password": "password123",
            "password_confirm": "mismatch123"
        }
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_user_profile_anonymous_fails(self):
        """L'accès au profil doit être refusé pour un utilisateur non connecté."""
        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_profile_authenticated_get(self):
        """Un utilisateur connecté peut consulter son profil."""
        user = User.objects.create_user(username="profileuser", password="password123")
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        
        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], "profileuser")

    def test_user_profile_update(self):
        """Un utilisateur connecté peut modifier son profil et ses informations."""
        user = User.objects.create_user(username="updateuser", password="password123", first_name="OldName")
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        
        data = {
            "first_name": "NewName",
            "profile": {
                "bio": "Ma nouvelle bio",
                "location": "Marseille"
            }
        }
        response = self.client.put('/api/profile/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], "NewName")
        self.assertEqual(response.data['profile']['bio'], "Ma nouvelle bio")
        self.assertEqual(response.data['profile']['location'], "Marseille")


class CategorieAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.categorie = Categorie.objects.create(nom="Tech", description="Technologie")

    def test_list_categories(self):
        """Vérifie que la liste des catégories est accessible publiquement."""
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['nom'], "Tech")

    def test_create_categorie_anonymous_fails(self):
        """Un utilisateur anonyme ne peut pas créer de catégorie."""
        data = {"nom": "Science", "description": "Sciences"}
        response = self.client.post('/api/categories/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_categorie_authenticated(self):
        """Un utilisateur connecté peut créer une catégorie."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        data = {"nom": "Science", "description": "Sciences"}
        response = self.client.post('/api/categories/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Categorie.objects.count(), 2)

    def test_create_article_with_categorie(self):
        """Vérifie la création d'un article lié à une catégorie et sa lecture détaillée (depth=1)."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        data = {
            "titre": "Article Web",
            "contenu": "Contenu du web",
            "categorie": self.categorie.id
        }
        response = self.client.post('/api/articles/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        article_id = response.data['id']

        # Lecture de l'article créé : vérifie l'imbrication des détails de la catégorie (depth=1)
        response_detail = self.client.get(f'/api/articles/{article_id}/')
        self.assertEqual(response_detail.status_code, status.HTTP_200_OK)
        self.assertEqual(response_detail.data['categorie']['nom'], "Tech")

    def test_filter_articles_by_categorie(self):
        """Vérifie le filtrage des articles par catégorie."""
        cat_sport = Categorie.objects.create(nom="Sport")
        Article.objects.create(titre="Article Tech", contenu="Content", categorie=self.categorie)
        Article.objects.create(titre="Article Sport", contenu="Content", categorie=cat_sport)

        response = self.client.get(f'/api/articles/?categorie={self.categorie.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['titre'], "Article Tech")


class LikesAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.article = Article.objects.create(titre="Article à Liker", contenu="Texte")
        self.commentaire = Commentaire.objects.create(article=self.article, auteur="Alice", texte="Commentaire à Liker")

    def test_like_article_anonymous_fails(self):
        """Un utilisateur anonyme ne peut pas liker un article."""
        response = self.client.post(f'/api/articles/{self.article.id}/like/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_like_article_toggle(self):
        """Un utilisateur connecté peut liker puis unliker un article."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        # Premier appel : Like
        response = self.client.post(f'/api/articles/{self.article.id}/like/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['liked'])
        self.assertEqual(response.data['likes_count'], 1)
        self.article.refresh_from_db()
        self.assertEqual(self.article.likes.count(), 1)

        # Deuxième appel : Unlike
        response = self.client.post(f'/api/articles/{self.article.id}/like/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['liked'])
        self.assertEqual(response.data['likes_count'], 0)
        self.article.refresh_from_db()
        self.assertEqual(self.article.likes.count(), 0)

    def test_like_commentaire_toggle(self):
        """Un utilisateur connecté peut liker puis unliker un commentaire."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        # Premier appel : Like
        response = self.client.post(f'/api/commentaires/{self.commentaire.id}/like/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['liked'])
        self.assertEqual(response.data['likes_count'], 1)

        # Deuxième appel : Unlike
        response = self.client.post(f'/api/commentaires/{self.commentaire.id}/like/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['liked'])
        self.assertEqual(response.data['likes_count'], 0)

    def test_likes_info_in_get_response(self):
        """Vérifie que le nombre de likes et le statut de l'utilisateur connecté apparaissent dans le GET."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        # On aime l'article
        self.article.likes.add(self.user)
        
        response = self.client.get(f'/api/articles/{self.article.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 1)
        self.assertTrue(response.data['user_has_liked'])


class SignetAPITests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username='usera', password='password123')
        self.token_a = Token.objects.create(user=self.user_a)
        
        self.user_b = User.objects.create_user(username='userb', password='password123')
        self.token_b = Token.objects.create(user=self.user_b)
        
        self.article = Article.objects.create(titre="Article Sauv", contenu="Texte")
        
    def test_bookmarks_anonymous_fails(self):
        """Un utilisateur anonyme ne peut ni voir ni créer de signets."""
        response_get = self.client.get('/api/signets/')
        self.assertEqual(response_get.status_code, status.HTTP_401_UNAUTHORIZED)
        
        response_post = self.client.post('/api/signets/', {"article": self.article.id})
        self.assertEqual(response_post.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_and_list_bookmarks(self):
        """Un utilisateur connecté peut sauvegarder un article et voir son signet."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_a.key)
        
        # Sauvegarde
        response_post = self.client.post('/api/signets/', {"article": self.article.id})
        self.assertEqual(response_post.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Signet.objects.count(), 1)
        
        # Liste
        response_get = self.client.get('/api/signets/')
        self.assertEqual(response_get.status_code, status.HTTP_200_OK)
        self.assertEqual(response_get.data['count'], 1)
        # Vérification du sérialiseur de lecture détaillé (depth=1)
        self.assertEqual(response_get.data['results'][0]['article']['titre'], "Article Sauv")

    def test_bookmarks_are_private(self):
        """Un utilisateur ne peut voir que ses propres signets."""
        # L'utilisateur A sauvegarde l'article
        Signet.objects.create(user=self.user_a, article=self.article)
        
        # L'utilisateur B se connecte et demande la liste des signets
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_b.key)
        response = self.client.get('/api/signets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0) # B ne doit rien voir

    def test_delete_bookmark(self):
        """Un utilisateur connecté peut supprimer sa sauvegarde."""
        signet = Signet.objects.create(user=self.user_a, article=self.article)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_a.key)
        
        response = self.client.delete(f'/api/signets/{signet.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Signet.objects.count(), 0)


class ArticleViewsAndRecommendationsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        
        self.cat_tech = Categorie.objects.create(nom="Tech")
        self.cat_sport = Categorie.objects.create(nom="Sport")
        
        self.article_a = Article.objects.create(titre="Article Tech A", contenu="Content", categorie=self.cat_tech, views_count=10)
        self.article_b = Article.objects.create(titre="Article Tech B", contenu="Content", categorie=self.cat_tech, views_count=5)
        self.article_c = Article.objects.create(titre="Article Sport C", contenu="Content", categorie=self.cat_sport, views_count=20)

    def test_retrieve_article_increments_views(self):
        """La récupération des détails d'un article doit incrémenter son compteur de vues de 1."""
        initial_views = self.article_a.views_count
        response = self.client.get(f'/api/articles/{self.article_a.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['views_count'], initial_views + 1)
        
        # Vérification en base de données
        self.article_a.refresh_from_db()
        self.assertEqual(self.article_a.views_count, initial_views + 1)

    def test_order_articles_by_popularity(self):
        """Le tri ?ordering=-views_count doit renvoyer les articles les plus vus en premier."""
        response = self.client.get('/api/articles/?ordering=-views_count')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # Ordre attendu : C (20), A (10), B (5)
        # Mais attention, A a été incrémenté à 11 dans le test précédent (car la base est réinitialisée par test, donc A reste à 10 ici)
        self.assertEqual(results[0]['id'], self.article_c.id)
        self.assertEqual(results[1]['id'], self.article_a.id)
        self.assertEqual(results[2]['id'], self.article_b.id)

    def test_similaires_articles(self):
        """L'action /similaires/ doit renvoyer les articles de la même catégorie à l'exception de lui-même."""
        response = self.client.get(f'/api/articles/{self.article_a.id}/similaires/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # Devrait renvoyer uniquement Article B (car A est exclu, C est dans Sport)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.article_b.id)
