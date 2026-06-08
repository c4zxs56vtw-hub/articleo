import React from 'react';
import { Heart, Trash2, User } from 'lucide-react';

export const CommentCard = ({
  comment,
  onLike,
  onDelete,
  isLoadingLike = false
}) => {
  const { id, auteur, texte, likes_count, user_has_liked, created_at } = comment;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Avatar wrapper */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <User className="w-5 h-5" />
        </div>
      </div>

      {/* Content wrapper */}
      <div className="flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{auteur}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-2.5">{formatDate(created_at)}</span>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1 rounded-full text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 transition-colors"
              title="Supprimer le commentaire"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Text */}
        <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-wrap mb-3">
          {texte}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <button
            onClick={() => onLike && onLike(id)}
            disabled={isLoadingLike || !onLike}
            className={`flex items-center gap-1 transition-colors ${
              user_has_liked
                ? 'text-red-600 font-semibold'
                : 'hover:text-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${user_has_liked ? 'fill-red-650 stroke-red-650' : ''}`} />
            <span>{likes_count} j'aime</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
