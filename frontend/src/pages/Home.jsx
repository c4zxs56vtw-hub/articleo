import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesApi } from '../api/articlesApi';
import { categoriesApi } from '../api/categoriesApi';
import { profileApi } from '../api/profileApi';
import ArticleCard from '../components/common/ArticleCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Search, SlidersHorizontal, BookOpen, AlertCircle, Book, Code, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import learningChildren from '../assets/learning_children.png';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Articles & Categories states
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookmarks, setBookmarks] = useState({}); // { articleId: bookmarkId }
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState({});

  // Query / Filter states
  const [search, setSearch] = useState('');
  const [searchVal, setSearchVal] = useState(''); // trigger fetch on submit
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        // Le backend renvoie directement la liste des catégories ou un objet paginé
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.results) {
          setCategories(data.results);
        }
      } catch (err) {
        console.error("Erreur catégories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Bookmarks if user is logged in
  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks({});
      return;
    }
    try {
      const data = await profileApi.getBookmarks(1);
      const bookmarksMap = {};
      const results = data.results || [];
      results.forEach(signet => {
        if (signet.article) {
          bookmarksMap[signet.article.id] = signet.id;
        }
      });
      setBookmarks(bookmarksMap);
    } catch (err) {
      console.error("Erreur lors de la récupération des signets", err);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Fetch Articles
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        ordering: ordering
      };
      if (searchVal) params.search = searchVal;
      if (selectedCategory) params.categorie = selectedCategory;

      const data = await articlesApi.getAll(params);
      setArticles(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      toast.error("Impossible de charger les articles.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchVal, selectedCategory, ordering]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchVal(search);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setSearchVal('');
    setSelectedCategory('');
    setOrdering('-created_at');
    setCurrentPage(1);
  };

  // Like Article Action
  const handleLike = async (articleId) => {
    if (!user) {
      toast.error("Vous devez vous connecter pour aimer un article.");
      navigate('/login');
      return;
    }

    setLoadingAction(prev => ({ ...prev, [`like-${articleId}`]: true }));
    try {
      const result = await articlesApi.toggleLike(articleId);
      // Mettre à jour l'état local des articles
      setArticles(prev =>
        prev.map(art =>
          art.id === articleId
            ? { ...art, user_has_liked: result.liked, likes_count: result.likes_count }
            : art
        )
      );
      if (result.liked) {
        toast.success("Article aimé !");
      } else {
        toast.success("Avis retiré.");
      }
    } catch (err) {
      toast.error("Erreur lors de l'interaction.");
    } finally {
      setLoadingAction(prev => ({ ...prev, [`like-${articleId}`]: false }));
    }
  };

  // Bookmark Article Action
  const handleBookmark = async (articleId) => {
    if (!user) {
      toast.error("Vous devez vous connecter pour enregistrer un signet.");
      navigate('/login');
      return;
    }

    const isBookmarked = !!bookmarks[articleId];
    setLoadingAction(prev => ({ ...prev, [`bookmark-${articleId}`]: true }));

    try {
      if (isBookmarked) {
        const bookmarkId = bookmarks[articleId];
        await profileApi.removeBookmark(bookmarkId);
        setBookmarks(prev => {
          const next = { ...prev };
          delete next[articleId];
          return next;
        });
        toast.success("Retiré de vos signets.");
      } else {
        const result = await profileApi.addBookmark(articleId);
        setBookmarks(prev => ({ ...prev, [articleId]: result.id }));
        toast.success("Enregistré dans vos signets !");
      }
    } catch (err) {
      toast.error("Erreur lors de la gestion du signet.");
    } finally {
      setLoadingAction(prev => ({ ...prev, [`bookmark-${articleId}`]: false }));
    }
  };

  // Delete Article Action
  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article définitivement ?")) {
      try {
        await articlesApi.delete(articleId);
        toast.success("Article supprimé avec succès.");
        fetchArticles();
      } catch (err) {
        toast.error("Impossible de supprimer cet article.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <section className="mb-10 text-center py-12 px-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden animate-gradient-shift">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-600 to-indigo-900"></div>
        
        {/* Floating gradient circles in background */}
        <div className="absolute top-1/4 left-10 w-28 h-28 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-float pointer-events-none"></div>
        <div className="absolute bottom-5 right-16 w-24 h-24 bg-purple-500 rounded-full blur-2xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating and spinning background icons */}
        <BookOpen className="absolute top-6 left-8 sm:left-14 w-12 h-12 text-white/5 animate-float-spin pointer-events-none select-none" />
        <Book className="absolute top-8 right-8 sm:right-16 w-14 h-14 text-white/5 animate-float-spin pointer-events-none select-none" style={{ animationDelay: '5s', animationDuration: '24s' }} />
        <Code className="absolute bottom-6 left-12 sm:left-24 w-10 h-10 text-white/5 animate-float-spin pointer-events-none select-none" style={{ animationDelay: '2s', animationDuration: '18s' }} />
        <GraduationCap className="absolute bottom-6 right-12 sm:right-28 w-12 h-12 text-white/5 animate-float-spin pointer-events-none select-none" style={{ animationDelay: '7s', animationDuration: '22s' }} />

        {/* Floating background children illustrations (low opacity) */}
        <img 
          src={learningChildren} 
          alt="" 
          className="absolute right-6 top-1/2 -translate-y-1/2 w-48 sm:w-60 h-auto opacity-5 sm:opacity-[0.06] pointer-events-none select-none animate-float"
        />
        <img 
          src={learningChildren} 
          alt="" 
          className="absolute left-6 top-1/2 -translate-y-1/2 w-48 sm:w-60 h-auto opacity-5 sm:opacity-[0.06] pointer-events-none select-none animate-float scale-x-[-1]"
          style={{ animationDelay: '2.5s' }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 uppercase">
            Partagez et apprenez sur OMNITECH
          </h1>
          <p className="text-indigo-200 text-base sm:text-lg font-light leading-relaxed">
            Découvrez des articles rédigés par la communauté, commentez, likez et enregistrez vos lectures favorites.
          </p>
        </div>
      </section>

      {/* Filter and search bar */}
      <section className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Search input */}
          <div className="flex-1">
            <Input
              label="Rechercher"
              placeholder="Saisir des mots-clés..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Category Selector */}
          <div className="w-full lg:w-64">
            <Select
              label="Catégorie"
              emptyOptionText="Toutes les catégories"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              options={categories.map(cat => ({ value: cat.id, label: cat.nom }))}
            />
          </div>

          {/* Ordering Selector */}
          <div className="w-full lg:w-56">
            <Select
              label="Trier par"
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: '-created_at', label: 'Plus récents' },
                { value: 'created_at', label: 'Plus anciens' },
                { value: '-views_count', label: 'Plus vus' },
                { value: 'titre', label: 'Titre (A-Z)' },
                { value: '-titre', label: 'Titre (Z-A)' }
              ]}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button
              type="submit"
              className="flex-1 lg:flex-none px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5"
            >
              Filtrer
            </button>
            {(searchVal || selectedCategory || ordering !== '-created_at') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors duration-200"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Main Grid */}
      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader size="large" />
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                isBookmarked={!!bookmarks[art.id]}
                onLike={handleLike}
                onBookmark={handleBookmark}
                isOwner={false} // Les actions d'édition se font sur le profil ou la page détail si approprié
                isLoadingLike={loadingAction[`like-${art.id}`]}
                isLoadingBookmark={loadingAction[`bookmark-${art.id}`]}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            count={totalCount}
            pageSize={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <div className="py-12">
          <EmptyState
            title="Aucun article trouvé"
            description="Essayez de modifier vos critères de recherche ou de catégorie pour obtenir de nouveaux résultats."
            icon={BookOpen}
            actionButton={
              (searchVal || selectedCategory) ? (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-indigo-900 text-white text-sm font-semibold rounded-lg hover:bg-indigo-950 transition-colors"
                >
                  Effacer la recherche
                </button>
              ) : null
            }
          />
        </div>
      )}
    </div>
  );
};

export default Home;
