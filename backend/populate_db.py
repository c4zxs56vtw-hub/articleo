import os
import django

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuration.settings')
django.setup()

from api1.models import Categorie, Article, Commentaire

def populate():
    print("Début du peuplement de la base de données...")

    # 1. Création des Catégories
    categories_data = [
        {
            "nom": "Développement Web",
            "description": "Tutoriels, frameworks, actualités et bonnes pratiques pour le développement frontend et backend."
        },
        {
            "nom": "Intelligence Artificielle",
            "description": "Exploration du Machine Learning, Deep Learning, des Modèles de Langage (LLM) et de l'IA Générative."
        },
        {
            "nom": "DevOps & Cloud",
            "description": "Conteneurisation, orchestrateurs, serveurs cloud, intégration continue (CI/CD) et automatisation."
        },
        {
            "nom": "Cybersécurité",
            "description": "Sécurisation des serveurs et des codes sources, analyse des vulnérabilités et protocoles de cryptographie."
        }
    ]

    categories = {}
    for cat_info in categories_data:
        cat, created = Categorie.objects.get_or_create(
            nom=cat_info["nom"],
            defaults={"description": cat_info["description"]}
        )
        categories[cat_info["nom"]] = cat
        if created:
            print(f"Catégorie créée : {cat.nom}")
        else:
            print(f"Catégorie existante : {cat.nom}")

    # 2. Création des Articles
    articles_data = [
        {
            "categorie": "Développement Web",
            "titre": "Introduction à React 19 et ses nouveautés majeures",
            "contenu": (
                "React 19 apporte des modifications fondamentales dans la gestion des états asynchrones et du rendu. "
                "Parmi les grandes nouveautés, on trouve :\n\n"
                "1. Les Server Components : exécutés côté serveur pour des performances optimales et un SEO maximal.\n"
                "2. Les Actions : simplifient la soumission des formulaires avec l'utilisation de hooks asynchrones.\n"
                "3. Le hook use() : permet de consommer des promesses et des contextes de manière conditionnelle.\n"
                "4. Le compilateur React Compiler (React Forget) : optimise le rendu en mémorisant automatiquement les composants.\n\n"
                "Ces changements vont grandement améliorer l'expérience des développeurs en éliminant le code répétitif "
                "comme useMemo et useCallback dans la plupart des cas."
            ),
            "commentaires": [
                {"auteur": "Alice", "texte": "React 19 simplifie vraiment la vie avec le React Compiler ! Hâte de le mettre en prod."},
                {"auteur": "Lucas", "texte": "Super résumé. J'ai testé l'utilisation du hook use() et c'est vraiment puissant."}
            ]
        },
        {
            "categorie": "Développement Web",
            "titre": "Pourquoi choisir Django et DRF pour vos APIs REST en 2026 ?",
            "contenu": (
                "Django reste l'un des frameworks web les plus robustes et fiables du marché. Couplé avec Django REST Framework (DRF), "
                "il offre une solution clé en main pour le développement d'APIs :\n\n"
                "- Une sécurité par défaut (protection CSRF, XSS, injections SQL).\n"
                "- Une architecture MVC éprouvée et hautement structurée.\n"
                "- Un système d'authentification robuste (Token, Session, JWT).\n"
                "- Une gestion de l'ORM puissante pour interagir avec les bases de données SQL sans écrire de code brut.\n\n"
                "Que ce soit pour une startup ou une grande entreprise, l'écosystème Python garantit une maintenabilité et "
                "une extensibilité à toute épreuve."
            ),
            "commentaires": [
                {"auteur": "Julien", "texte": "L'ORM de Django est sans doute le meilleur ORM que j'ai pu utiliser jusqu'ici."}
            ]
        },
        {
            "categorie": "Intelligence Artificielle",
            "titre": "Comprendre les modèles de langage (LLM) et le Deep Learning",
            "contenu": (
                "Les modèles de langage (LLM) comme GPT ou Gemini reposent sur l'architecture des Transformers introduite en 2017. "
                "Ces réseaux de neurones utilisent le mécanisme d'attention pour analyser les relations entre les mots d'un texte.\n\n"
                "Le processus se décompose en plusieurs phases :\n"
                "- La tokenisation : découpage du texte en unités élémentaires (tokens).\n"
                "- Les embeddings : conversion des tokens en vecteurs mathématiques de grande dimension.\n"
                "- L'entraînement de base (Pre-training) : apprentissage supervisé sur des téraoctets de données.\n"
                "- L'alignement (RLHF) : ajustement du modèle pour le rendre utile, inoffensif et poli.\n\n"
                "Cette révolution change radicalement notre manière d'interagir avec les machines et d'automatiser les tâches de rédaction et d'analyse."
            ),
            "commentaires": [
                {"auteur": "Sophie", "texte": "Explication très claire pour les débutants en IA, merci !"},
                {"auteur": "Marc", "texte": "Le mécanisme d'auto-attention est la clé de voûte de toute cette technologie."}
            ]
        },
        {
            "categorie": "Intelligence Artificielle",
            "titre": "L'impact de l'IA générative sur la productivité des développeurs",
            "contenu": (
                "L'IA générative modifie profondément le quotidien des ingénieurs logiciels. Les assistants de codage comme Copilot "
                "ne remplacent pas les développeurs, mais augmentent leur efficacité :\n\n"
                "1. Génération de code boilerplate (code répétitif).\n"
                "2. Aide au débogage et à l'explication d'erreurs complexes.\n"
                "3. Écriture rapide de tests unitaires et de documentation.\n\n"
                "Cependant, le rôle du développeur évolue vers la supervision et la validation architecturale. Il est essentiel de "
                "garder un esprit critique, car l'IA peut parfois générer des hallucinations ou des codes obsolètes."
            ),
            "commentaires": [
                {"auteur": "Antoine", "texte": "Exactement. L'IA est un excellent assistant mais un piètre décideur architectural."}
            ]
        },
        {
            "categorie": "DevOps & Cloud",
            "titre": "Les fondamentaux de Docker : de la théorie à la conteneurisation",
            "contenu": (
                "Docker a révolutionné le déploiement d'applications en introduisant les conteneurs. Contrairement aux machines virtuelles, "
                "les conteneurs partagent le noyau du système d'exploitation de l'hôte, ce qui les rend légers et rapides à démarrer.\n\n"
                "Concepts clés à maîtriser :\n"
                "- Le Dockerfile : le fichier de configuration décrivant comment assembler l'image.\n"
                "- L'Image : le modèle en lecture seule contenant l'application et ses dépendances.\n"
                "- Le Conteneur : l'instance active et isolée d'une image.\n"
                "- Les Volumes : permettent de persister les données en dehors du cycle de vie du conteneur.\n\n"
                "Grâce à Docker, le fameux 'ça marche sur ma machine' fait désormais partie du passé !"
            ),
            "commentaires": [
                {"auteur": "Guillaume", "texte": "Docker est indispensable aujourd'hui. Fini les galères d'environnement d'équipe."}
            ]
        },
        {
            "categorie": "DevOps & Cloud",
            "titre": "Introduction à Kubernetes : orchestrer ses conteneurs à grande échelle",
            "contenu": (
                "Lorsque le nombre de conteneurs Docker grandit, leur gestion manuelle devient impossible. C'est là qu'intervient Kubernetes (K8s), "
                "un outil open source conçu pour automatiser le déploiement, la mise à l'échelle et la gestion des conteneurs.\n\n"
                "Kubernetes apporte des fonctionnalités essentielles :\n"
                "- Auto-healing (redémarrage des conteneurs en panne).\n"
                "- Load Balancing (répartition du trafic réseau).\n"
                "- Auto-scaling (ajustement automatique du nombre d'instances selon la charge CPU).\n"
                "- Déploiements progressifs (Rolling updates).\n\n"
                "K8s est devenu le standard de l'industrie pour faire tourner des architectures de microservices résilientes dans le cloud."
            ),
            "commentaires": []
        },
        {
            "categorie": "Cybersécurité",
            "titre": "Le Top 10 OWASP : comprendre et corriger les failles web critiques",
            "contenu": (
                "L'OWASP (Open Web Application Security Project) publie régulièrement un classement des vulnérabilités de sécurité les plus "
                "répandues sur le Web. Les failles critiques incluent :\n\n"
                "1. Les injections SQL : exécution de commandes malveillantes sur la base de données.\n"
                "2. Les défauts d'authentification : mauvaise gestion des sessions ou des mots de passe.\n"
                "3. L'exposition de données sensibles : chiffrement insuffisant des informations.\n"
                "4. Les failles XSS (Cross-Site Scripting) : injection de scripts javascript malveillants exécutés chez les clients.\n\n"
                "La sécurité doit être pensée dès la conception du logiciel (Security by Design) et non après le déploiement."
            ),
            "commentaires": [
                {"auteur": "Mathieu", "texte": "OWASP est la base de référence pour tout développeur web qui se respecte."}
            ]
        },
        {
            "categorie": "Cybersécurité",
            "titre": "Sécuriser ses APIs REST avec des JSON Web Tokens (JWT)",
            "contenu": (
                "Les APIs REST modernes sont souvent sans état (stateless). L'utilisation de tokens JWT est une méthode courante pour "
                "authentifier les utilisateurs de manière sécurisée sans stocker de session sur le serveur.\n\n"
                "Fonctionnement d'un JWT :\n"
                "- Header : indique l'algorithme de hachage utilisé (ex: HMAC SHA256).\n"
                "- Payload : contient les déclarations (claims) comme l'identifiant utilisateur.\n"
                "- Signature : permet de valider que le jeton n'a pas été altéré en cours de route.\n\n"
                "Pour une sécurité renforcée, il est recommandé d'utiliser des Access Tokens de courte durée de vie associés "
                "à des Refresh Tokens stockés dans des cookies sécurisés (HttpOnly)."
            ),
            "commentaires": [
                {"auteur": "Nicolas", "texte": "Les JWT sont super pratiques pour le découplage frontend/backend."}
            ]
        }
    ]

    for art_info in articles_data:
        cat = categories[art_info["categorie"]]
        art, created = Article.objects.get_or_create(
            titre=art_info["titre"],
            defaults={
                "contenu": art_info["contenu"],
                "categorie": cat,
                "views_count": 12 # quelques vues de départ pour l'esthétique
            }
        )
        
        if created:
            print(f"Article créé : '{art.titre}'")
            # Ajout des commentaires associés
            for comm_info in art_info["commentaires"]:
                Commentaire.objects.create(
                    article=art,
                    auteur=comm_info["auteur"],
                    texte=comm_info["texte"]
                )
        else:
            print(f"Article existant : '{art.titre}'")

    print("Base de données peuplée avec succès !")

if __name__ == '__main__':
    populate()
