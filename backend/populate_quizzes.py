import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuration.settings')
django.setup()

from api1.models import Categorie, Quiz, Question

def populate():
    print("Début du peuplement des Quiz...")

    # Fetch Categories
    web_cat = Categorie.objects.filter(nom="Développement Web").first()
    ia_cat = Categorie.objects.filter(nom="Intelligence Artificielle").first()
    devops_cat = Categorie.objects.filter(nom="DevOps & Cloud").first()
    cyber_cat = Categorie.objects.filter(nom="Cybersécurité").first()

    quizzes_data = []

    if web_cat:
        quizzes_data.append({
            "categorie": web_cat,
            "titre": "Quiz Développeur React 19",
            "description": "Testez vos connaissances sur les nouveautés de React 19 : Server Components, hooks asynchrones, use() et plus !",
            "questions": [
                {
                    "texte": "Quelle nouveauté de React 19 permet de consommer des promesses ou des contextes de manière conditionnelle ?",
                    "choix_a": "Le hook use()",
                    "choix_b": "Le hook useAsync()",
                    "choix_c": "Le hook useEffect()",
                    "choix_d": "Le hook usePromise()",
                    "reponse_correcte": "A",
                    "explication": "Le nouveau hook use() permet de lire la valeur d'une ressource (comme une promesse ou un contexte) directement dans le rendu, et peut être appelé de manière conditionnelle ou dans des boucles."
                },
                {
                    "texte": "Qu'est-ce que le React Compiler (React Forget) ?",
                    "choix_a": "Un outil de rendu côté serveur uniquement",
                    "choix_b": "Un compilateur qui mémorise automatiquement les composants et valeurs pour optimiser les rendus",
                    "choix_c": "Un outil de débogage pour les extensions de navigateur",
                    "choix_d": "Un package pour remplacer webpack",
                    "reponse_correcte": "B",
                    "explication": "Le React Compiler optimise automatiquement le code React en mémorisant les valeurs (plus besoin de useMemo ou useCallback manuels dans la majorité des cas)."
                },
                {
                    "texte": "Dans React 19, comment gère-t-on le chargement asynchrone des formulaires de manière simplifiée ?",
                    "choix_a": "Avec les Actions et le hook useActionState",
                    "choix_b": "Avec le hook useTransition uniquement",
                    "choix_c": "Avec le hook useFormStatus uniquement",
                    "choix_d": "En utilisant des classes ES6",
                    "reponse_correcte": "A",
                    "explication": "React 19 introduit les Actions pour soumettre des formulaires de façon asynchrone, intégrées avec des hooks comme useActionState pour gérer l'état en attente, les erreurs et les données renvoyées."
                },
                {
                    "texte": "Quel hook permet d'accéder aux informations d'état de soumission d'un formulaire parent ?",
                    "choix_a": "useFormStatus",
                    "choix_b": "useFormState",
                    "choix_c": "useForm",
                    "choix_d": "useActionState",
                    "reponse_correcte": "A",
                    "explication": "Le hook useFormStatus permet aux composants enfants d'un formulaire d'accéder aux informations de soumission de ce formulaire (ex: pending, data, method, action)."
                },
                {
                    "texte": "Où sont exécutés les React Server Components (RSC) ?",
                    "choix_a": "Uniquement sur le navigateur client",
                    "choix_b": "Uniquement sur le serveur, avant d'être envoyés au client",
                    "choix_c": "Dans une base de données",
                    "choix_d": "Dans les web workers",
                    "reponse_correcte": "B",
                    "explication": "Les Server Components sont exécutés côté serveur, ce qui permet de réduire la taille du bundle envoyé au client et d'accéder directement aux ressources serveur."
                }
            ]
        })

    if ia_cat:
        quizzes_data.append({
            "categorie": ia_cat,
            "titre": "Introduction aux LLM & Deep Learning",
            "description": "Évaluez votre maîtrise des concepts fondamentaux derrière les grands modèles de langage et le Deep Learning.",
            "questions": [
                {
                    "texte": "Quelle architecture de réseau de neurones a révolutionné le traitement du langage naturel en 2017 ?",
                    "choix_a": "Les CNN (Convolutional Neural Networks)",
                    "choix_b": "Les Transformers",
                    "choix_c": "Les LSTM (Long Short-Term Memory)",
                    "choix_d": "Les MLP (Multi-Layer Perceptrons)",
                    "reponse_correcte": "B",
                    "explication": "L'architecture Transformer, introduite dans le papier 'Attention Is All You Need' en 2017, est le fondement de la révolution actuelle des LLMs."
                },
                {
                    "texte": "Quel mécanisme permet aux Transformers de relier chaque mot d'une phrase aux autres mots en calculant leur importance relative ?",
                    "choix_a": "La convolution",
                    "choix_b": "Le pooling",
                    "choix_c": "L'attention (Self-Attention)",
                    "choix_d": "La rétropropagation",
                    "reponse_correcte": "C",
                    "explication": "Le mécanisme de Self-Attention permet au modèle de prêter attention aux mots pertinents d'un texte, quel que soit leur éloignement dans la phrase."
                },
                {
                    "texte": "Qu'est-ce que la tokenisation dans le traitement du langage naturel (NLP) ?",
                    "choix_a": "Le chiffrement des données textuelles",
                    "choix_b": "Le découpage d'un texte en unités de base (mots ou sous-mots) appelées tokens",
                    "choix_c": "Le calcul de la fonction de perte",
                    "choix_d": "L'évaluation finale du modèle",
                    "reponse_correcte": "B",
                    "explication": "La tokenisation consiste à segmenter la chaîne de caractères d'entrée en unités discrètes (mots, syllabes ou caractères) que le modèle peut traiter."
                },
                {
                    "texte": "Que signifie RLHF dans le contexte de l'alignement des modèles de langage ?",
                    "choix_a": "Reinforcement Learning from Human Feedback",
                    "choix_b": "Recursive Loss with High Frequency",
                    "choix_c": "Real-time Logical Heuristics and Filtering",
                    "choix_d": "Robust Language Handling Framework",
                    "reponse_correcte": "A",
                    "explication": "RLHF (Apprentissage par renforcement à partir des commentaires humains) est une technique essentielle pour aligner les réponses d'un LLM sur les préférences humaines."
                },
                {
                    "texte": "Comment appelle-t-on le phénomène où un LLM génère des informations factuellement fausses mais présentées de manière confiante ?",
                    "choix_a": "Une régression",
                    "choix_b": "Un surapprentissage",
                    "choix_c": "Une hallucination",
                    "choix_d": "Un biais d'alignement",
                    "reponse_correcte": "C",
                    "explication": "Une hallucination désigne la production par une IA d'affirmations plausibles mais fausses ou sans fondement logique."
                }
            ]
        })

    if devops_cat:
        quizzes_data.append({
            "categorie": devops_cat,
            "titre": "Maîtrise de Docker et Kubernetes",
            "description": "Mesurez vos compétences sur la conteneurisation d'applications et l'orchestration avec Kubernetes.",
            "questions": [
                {
                    "texte": "Quelle est la principale différence entre un conteneur et une machine virtuelle ?",
                    "choix_a": "Les conteneurs partagent le noyau de l'OS hôte, tandis que les VM embarquent leur propre OS complet",
                    "choix_b": "Les conteneurs sont plus lourds que les VM",
                    "choix_c": "Les VM ne peuvent pas exécuter d'applications Web",
                    "choix_d": "Les conteneurs n'utilisent pas de mémoire RAM",
                    "reponse_correcte": "A",
                    "explication": "Les conteneurs sont beaucoup plus légers car ils partagent le noyau de l'hôte, évitant la surcharge liée à l'exécution d'un système d'exploitation invité entier (OS guest)."
                },
                {
                    "texte": "Quel fichier décrit les étapes d'assemblage et de configuration d'une image Docker ?",
                    "choix_a": "docker-compose.yml",
                    "choix_b": "Dockerfile",
                    "choix_c": "package.json",
                    "choix_d": "config.json",
                    "reponse_correcte": "B",
                    "explication": "Le Dockerfile est le script texte contenant toutes les instructions nécessaires pour construire une image Docker personnalisée."
                },
                {
                    "texte": "Dans Kubernetes, quel est l'objet de base le plus petit représentant une instance de conteneur en cours d'exécution ?",
                    "choix_a": "Un Node",
                    "choix_b": "Un Deployment",
                    "choix_c": "Un Pod",
                    "choix_d": "Un Service",
                    "reponse_correcte": "C",
                    "explication": "Le Pod est le plus petit composant déployable dans Kubernetes, contenant un ou plusieurs conteneurs partageant le stockage et le réseau."
                },
                {
                    "texte": "Quelle commande permet de lister les Pods en cours d'exécution dans un cluster Kubernetes ?",
                    "choix_a": "kubectl list pods",
                    "choix_b": "kubectl get pods",
                    "choix_c": "docker ps --k8s",
                    "choix_d": "kubectl show pods",
                    "reponse_correcte": "B",
                    "explication": "La commande 'kubectl get pods' permet d'interroger l'API server de Kubernetes pour lister les pods du namespace courant."
                },
                {
                    "texte": "Quel concept Kubernetes permet d'exposer un groupe de Pods sur le réseau interne ou externe du cluster ?",
                    "choix_a": "Un Volume",
                    "choix_b": "Un NodePort",
                    "choix_c": "Un Service",
                    "choix_d": "Un ConfigMap",
                    "reponse_correcte": "C",
                    "explication": "Le Service Kubernetes définit une politique d'accès logique pour un ensemble de Pods, gérant la répartition de charge (Load Balancing)."
                }
            ]
        })

    if cyber_cat:
        quizzes_data.append({
            "categorie": cyber_cat,
            "titre": "Concepts de Cybersécurité et OWASP",
            "description": "Validez vos connaissances sur la sécurisation des architectures Web et les vulnérabilités critiques du Top 10 OWASP.",
            "questions": [
                {
                    "texte": "Quelle vulnérabilité consiste à injecter des scripts Javascript malveillants exécutés dans le navigateur des autres utilisateurs ?",
                    "choix_a": "L'injection SQL",
                    "choix_b": "La faille CSRF",
                    "choix_c": "La faille XSS (Cross-Site Scripting)",
                    "choix_d": "Une rupture de contrôle d'accès",
                    "reponse_correcte": "C",
                    "explication": "Les failles XSS (Cross-Site Scripting) permettent à des attaquants d'injecter des scripts côté client dans des pages Web consultées par d'autres utilisateurs."
                },
                {
                    "texte": "Dans une authentification par JWT, où est-il le plus sécurisé de stocker le token côté client pour éviter le vol par XSS ?",
                    "choix_a": "Dans le localStorage",
                    "choix_b": "Dans un cookie avec l'attribut HttpOnly",
                    "choix_c": "Dans les variables globales de l'application",
                    "choix_d": "Dans le sessionStorage",
                    "reponse_correcte": "B",
                    "explication": "L'attribut HttpOnly empêche l'accès au cookie via Javascript, protégeant ainsi le token du vol en cas de faille XSS."
                },
                {
                    "texte": "Que signifie le concept de 'Defense in Depth' (Défense en profondeur) ?",
                    "choix_a": "N'utiliser qu'un seul pare-feu extrêmement puissant",
                    "choix_b": "Superposer plusieurs mécanismes de sécurité indépendants pour protéger un système",
                    "choix_c": "Chiffrer uniquement les bases de données",
                    "choix_d": "Masquer le code source pour empêcher l'analyse",
                    "reponse_correcte": "B",
                    "explication": "La défense en profondeur consiste à multiplier les barrières de sécurité (réseau, OS, application, humain) de sorte que si l'une échoue, les autres prennent le relais."
                },
                {
                    "texte": "Quelle faille consiste à forcer un utilisateur authentifié à exécuter des actions indésirables à son insu sur une application Web ?",
                    "choix_a": "La faille CSRF (Cross-Site Request Forgery)",
                    "choix_b": "Une injection SQL",
                    "choix_c": "Un dépassement de tampon (Buffer Overflow)",
                    "choix_d": "Un déni de service (DoS)",
                    "reponse_correcte": "A",
                    "explication": "Le CSRF (Cross-Site Request Forgery) consiste à exploiter la confiance qu'a un site envers le navigateur d'un utilisateur authentifié pour envoyer des requêtes malveillantes."
                },
                {
                    "texte": "Quel algorithme de hachage est considéré comme obsolète et non sécurisé pour stocker les mots de passe ?",
                    "choix_a": "bcrypt",
                    "choix_b": "Argon2",
                    "choix_c": "MD5",
                    "choix_d": "PBKDF2",
                    "reponse_correcte": "C",
                    "explication": "MD5 est un algorithme de hachage ancien qui souffre de nombreuses collisions et qui est extrêmement rapide à casser par force brute aujourd'hui."
                }
            ]
        })

    for quiz_info in quizzes_data:
        quiz, created = Quiz.objects.get_or_create(
            titre=quiz_info["titre"],
            defaults={
                "categorie": quiz_info["categorie"],
                "description": quiz_info["description"]
            }
        )

        if created:
            print(f"Quiz créé : '{quiz.titre}'")
            # Create Questions
            for q_info in quiz_info["questions"]:
                Question.objects.create(
                    quiz=quiz,
                    texte=q_info["texte"],
                    choix_a=q_info["choix_a"],
                    choix_b=q_info["choix_b"],
                    choix_c=q_info["choix_c"],
                    choix_d=q_info["choix_d"],
                    reponse_correcte=q_info["reponse_correcte"],
                    explication=q_info["explication"]
                )
            print(f"  -> 5 questions ajoutées.")
        else:
            print(f"Quiz existant : '{quiz.titre}'")

    print("Fin du peuplement des Quiz !")

if __name__ == '__main__':
    populate()
