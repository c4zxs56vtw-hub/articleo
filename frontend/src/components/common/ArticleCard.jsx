import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Calendar, Bookmark, Edit, Trash2 } from 'lucide-react';
import Badge from './Badge';

export const ArticleCard = ({
  article,
  onLike,
  isBookmarked,
  onBookmark,
  isOwner,
  onDelete,
  isLoadingLike = false,
  isLoadingBookmark = false
}) => {
  const { id, titre, contenu, categorie, likes_count, user_has_liked, views_count, created_at } = article;

  // Formater la date en Français
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tronquer le contenu pour le snippet
  const truncateContent = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <article className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-lg overflow-hidden h-full">
      {/* Category & Actions Bar */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          {categorie ? (
            <Badge variant="primary">{categorie.nom}</Badge>
          ) : (
            <Badge variant="default">Général</Badge>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {onBookmark && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookmark(id);
              }}
              disabled={isLoadingBookmark}
              className={`p-1.5 rounded-full transition-colors ${
                isBookmarked
                  ? 'text-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-905'
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? "Retirer des signets" : "Ajouter aux signets"}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-900' : ''}`} />
            </button>
          )}

          {isOwner && (
            <>
              <Link
                to={`/edit-article/${id}`}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-900 dark:hover:text-indigo-400 transition-colors"
                title="Modifier l'article"
              >
                <Edit className="w-4 h-4" />
              </Link>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(id);
                  }}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Supprimer l'article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pt-4 pb-6">
        <Link to={`/articles/${id}`} className="block focus:outline-none">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-900 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-3">
            {titre}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {truncateContent(contenu)}
          </p>
        </Link>
      </div>

      {/* Footer Details */}
      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(created_at)}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Views */}
          <div className="flex items-center gap-1" title={`${views_count} vues`}>
            <Eye className="w-3.5 h-3.5" />
            <span>{views_count}</span>
          </div>

          {/* Likes */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onLike) onLike(id);
            }}
            disabled={isLoadingLike || !onLike}
            className={`flex items-center gap-1 transition-colors ${
              user_has_liked 
                ? 'text-red-600 dark:text-red-450 font-semibold' 
                : 'hover:text-red-500 dark:hover:text-red-400'
            }`}
            title={user_has_liked ? "Je n'aime plus" : "J'aime"}
          >
            <Heart className={`w-3.5 h-3.5 ${user_has_liked ? 'fill-red-600 stroke-red-650' : ''}`} />
            <span>{likes_count}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
