import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesApi } from '../api/articlesApi';
import { commentsApi } from '../api/commentsApi';
import { profileApi } from '../api/profileApi';
import CommentCard from '../components/common/CommentCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Heart, Eye, Calendar, Bookmark, Edit, Trash2, ArrowLeft, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [article, setArticle] = useState(null);
  const [similaires, setSimilaires] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);
  const [bookmarkId, setBookmarkId] = useState(null);

  // Loaders
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [actionLoading, setActionLoading] = useState({ like: false, bookmark: false });
  const [commentLikeLoading, setCommentLikeLoading] = useState({});

  // Comment Form States
  const [authorName, setAuthorName] = useState(user ? user.username : '');
  const [commentText, setCommentText] = useState('');

  // Sync authorName when user state loads
  useEffect(() => {
    if (user && !authorName) {
      setAuthorName(user.username);
    }
  }, [user, authorName]);

  // Fetch article detail, similar articles, and bookmark status
  const fetchArticleAndExtras = useCallback(async () => {
    setLoadingArticle(true);
    try {
      // 1. Get Article
      const articleData = await articlesApi.getById(id);
      setArticle(articleData);

      // 2. Get Similar Articles
      try {
        const simData = await articlesApi.getSimilaires(id);
        setSimilaires(simData.results || []);
      } catch (simErr) {
        console.error("Erreur articles similaires:", simErr);
      }

      // 3. Get Bookmark status if logged in
      if (user) {
        try {
          const bookmarkData = await profileApi.getBookmarks(1);
          const results = bookmarkData.results || [];
          const found = results.find(b => b.article && b.article.id === parseInt(id));
          setBookmarkId(found ? found.id : null);
        } catch (bErr) {
          console.error("Erreur statut signet:", bErr);
        }
      }
    } catch (err) {
      toast.error("Impossible de charger l'article.");
      navigate('/');
    } finally {
      setLoadingArticle(false);
    }
  }, [id, user, navigate]);

  // Fetch Comments
  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const data = await commentsApi.getByArticleId(id, commentsPage);
      setComments(data.results || []);
      setCommentsCount(data.count || 0);
    } catch (err) {
      console.error("Erreur commentaires:", err);
    } finally {
      setLoadingComments(false);
    }
  }, [id, commentsPage]);

  useEffect(() => {
    fetchArticleAndExtras();
  }, [fetchArticleAndExtras]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Like Article
  const handleLikeArticle = async () => {
    if (!user) {
      toast.error("Vous devez vous connecter pour aimer un article.");
      navigate('/login');
      return;
    }

    setActionLoading(prev => ({ ...prev, like: true }));
    try {
      const result = await articlesApi.toggleLike(id);
      setArticle(prev => ({
        ...prev,
        user_has_liked: result.liked,
        likes_count: result.likes_count
      }));
      toast.success(result.liked ? "Article aimé !" : "Avis retiré.");
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setActionLoading(prev => ({ ...prev, like: false }));
    }
  };

  // Bookmark Article
  const handleBookmarkArticle = async () => {
    if (!user) {
      toast.error("Vous devez vous connecter pour enregistrer ce signet.");
      navigate('/login');
      return;
    }

    setActionLoading(prev => ({ ...prev, bookmark: true }));
    try {
      if (bookmarkId) {
        await profileApi.removeBookmark(bookmarkId);
        setBookmarkId(null);
        toast.success("Retiré des signets.");
      } else {
        const result = await profileApi.addBookmark(id);
        setBookmarkId(result.id);
        toast.success("Enregistré dans vos signets !");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setActionLoading(prev => ({ ...prev, bookmark: false }));
    }
  };

  // Delete Article
  const handleDeleteArticle = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article définitivement ?")) {
      try {
        await articlesApi.delete(id);
        toast.success("Article supprimé.");
        navigate('/');
      } catch (err) {
        toast.error("Impossible de supprimer cet article.");
      }
    }
  };

  // Submit Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vous devez vous connecter pour commenter.");
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await commentsApi.create({
        article: parseInt(id),
        auteur: authorName || user.username,
        texte: commentText
      });
      setCommentText('');
      toast.success("Commentaire publié !");
      setCommentsPage(1); // Revenir à la première page pour voir le nouveau commentaire
      fetchComments();
    } catch (err) {
      toast.error("Impossible d'ajouter le commentaire.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Like Comment
  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error("Vous devez vous connecter pour aimer un commentaire.");
      navigate('/login');
      return;
    }

    setCommentLikeLoading(prev => ({ ...prev, [commentId]: true }));
    try {
      const result = await commentsApi.toggleLike(commentId);
      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? { ...c, user_has_liked: result.liked, likes_count: result.likes_count }
            : c
        )
      );
    } catch (err) {
      toast.error("Impossible d'aimer ce commentaire.");
    } finally {
      setCommentLikeLoading(prev => ({ ...prev, [commentId]: false }));
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Voulez-vous supprimer ce commentaire ?")) {
      try {
        await commentsApi.delete(commentId);
        toast.success("Commentaire supprimé.");
        fetchComments();
      } catch (err) {
        toast.error("Impossible de supprimer le commentaire.");
      }
    }
  };

  // Helper date formatter
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loadingArticle) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux articles
      </Link>

      {/* Article Header Card */}
      <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          {article.categorie ? (
            <Badge variant="primary">{article.categorie.nom}</Badge>
          ) : (
            <Badge variant="default">Général</Badge>
          )}

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={handleBookmarkArticle}
              disabled={actionLoading.bookmark}
              className={`p-2 rounded-full border transition-all ${
                bookmarkId
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title={bookmarkId ? "Retirer des signets" : "Enregistrer dans mes signets"}
            >
              <Bookmark className={`w-5 h-5 ${bookmarkId ? 'fill-indigo-900 dark:fill-indigo-400' : ''}`} />
            </button>

            {/* Owner controls (Any authenticated user as there is no specific owner field) */}
            {user && (
              <>
                <Link
                  to={`/edit-article/${article.id}`}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-300 hover:text-indigo-900 dark:hover:text-indigo-400 transition-colors"
                  title="Modifier l'article"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDeleteArticle}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-300 hover:text-red-650 dark:hover:text-red-400 transition-colors"
                  title="Supprimer l'article"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-snug mb-4">
          {article.titre}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Publié le {formatDate(article.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {article.views_count} lectures
          </span>
        </div>

        {/* Body content */}
        <div className="prose max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
          {article.contenu}
        </div>

        {/* Likes footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant={article.user_has_liked ? "primary" : "outline"}
            onClick={handleLikeArticle}
            isLoading={actionLoading.like}
            icon={Heart}
            className={article.user_has_liked ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : ""}
          >
            {article.user_has_liked ? "Aimé !" : "Aimer cet article"} ({article.likes_count})
          </Button>
        </div>
      </article>

      {/* Similar Articles Panel */}
      {similaires.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-8">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-900 dark:text-indigo-400" />
            Articles similaires recommandés
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {similaires.slice(0, 2).map((sim) => (
              <Link
                key={sim.id}
                to={`/articles/${sim.id}`}
                className="block p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
              >
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-400 uppercase tracking-wide block mb-1">
                  {sim.categorie ? sim.categorie.nom : 'Général'}
                </span>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-300 line-clamp-1 mb-2">
                  {sim.titre}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {sim.views_count}</span>
                  <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {sim.likes_count}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Comments section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
          Discussion ({commentsCount})
        </h2>

        {/* Comment submission form */}
        <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Ajouter un commentaire
          </h3>
          {user ? (
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Votre Nom / Pseudo"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Saisir un pseudo..."
                  required
                />
              </div>
              <Textarea
                label="Votre Message"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrire un commentaire constructif..."
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submittingComment}
                  icon={Send}
                >
                  Envoyer
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 mb-3">
                Vous devez être connecté pour participer à la discussion.
              </p>
              <Link to="/login" className="inline-flex">
                <Button variant="primary" size="sm">Connectez-vous maintenant</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Comments Listing */}
        {loadingComments ? (
          <div className="py-6 flex items-center justify-center">
            <Loader size="medium" />
          </div>
        ) : comments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {comments.map((comm) => (
              <CommentCard
                key={comm.id}
                comment={comm}
                onLike={handleLikeComment}
                onDelete={
                  user && (comm.auteur === user.username)
                    ? handleDeleteComment
                    : null
                }
                isLoadingLike={commentLikeLoading[comm.id]}
              />
            ))}

            <Pagination
              currentPage={commentsPage}
              count={commentsCount}
              pageSize={10}
              onPageChange={(page) => setCommentsPage(page)}
            />
          </div>
        ) : (
          <EmptyState
            title="Aucun commentaire"
            description="Soyez le premier à donner votre avis sur cet article !"
            icon={Send}
          />
        )}
      </section>
    </div>
  );
};

export default ArticleDetail;
