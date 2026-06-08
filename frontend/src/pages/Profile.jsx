import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../api/profileApi';
import { articlesApi } from '../api/articlesApi';
import ArticleCard from '../components/common/ArticleCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import { User, MapPin, AlignLeft, Bookmark, ShieldAlert, Heart, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateUserInfo } = useAuth();
  const navigate = useNavigate();

  // Auth Protection Check
  useEffect(() => {
    if (!user) {
      toast.error("Veuillez vous connecter pour voir votre profil.");
      navigate('/login');
    }
  }, [user, navigate]);

  // Form states
  const [firstName, setFirstName] = useState(user ? user.first_name : '');
  const [lastName, setLastName] = useState(user ? user.last_name : '');
  const [bio, setBio] = useState(user && user.profile ? user.profile.bio : '');
  const [location, setLocation] = useState(user && user.profile ? user.profile.location : '');

  // App states
  const [bookmarks, setBookmarks] = useState([]);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [bookmarksPage, setBookmarksPage] = useState(1);
  
  // Loader states
  const [updating, setUpdating] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [loadingAction, setLoadingAction] = useState({});

  // Sync state if user context loads later
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      if (user.profile) {
        setBio(user.profile.bio || '');
        setLocation(user.profile.location || '');
      }
    }
  }, [user]);

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    setLoadingBookmarks(true);
    try {
      const data = await profileApi.getBookmarks(bookmarksPage);
      setBookmarks(data.results || []);
      setTotalBookmarks(data.count || 0);
    } catch (err) {
      console.error("Erreur lors de la récupération des signets:", err);
      toast.error("Impossible de charger vos signets.");
    } finally {
      setLoadingBookmarks(false);
    }
  }, [user, bookmarksPage]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Update Profile Form submit
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        profile: {
          bio,
          location
        }
      };
      const updatedUser = await profileApi.updateProfile(payload);
      updateUserInfo(updatedUser);
      toast.success("Profil mis à jour avec succès !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du profil.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Like article inside Bookmarks tab
  const handleLikeBookmarkArticle = async (articleId) => {
    setLoadingAction(prev => ({ ...prev, [`like-${articleId}`]: true }));
    try {
      const result = await articlesApi.toggleLike(articleId);
      // Mettre à jour l'état local du bookmark correspondant
      setBookmarks(prev =>
        prev.map(bookmark =>
          bookmark.article.id === articleId
            ? {
                ...bookmark,
                article: {
                  ...bookmark.article,
                  user_has_liked: result.liked,
                  likes_count: result.likes_count
                }
              }
            : bookmark
        )
      );
      toast.success(result.liked ? "Article aimé !" : "Avis retiré.");
    } catch (err) {
      toast.error("Erreur d'interaction.");
    } finally {
      setLoadingAction(prev => ({ ...prev, [`like-${articleId}`]: false }));
    }
  };

  // Remove Bookmark
  const handleRemoveBookmark = async (articleId) => {
    // Trouver le signet correspondant dans l'état local
    const bookmark = bookmarks.find(b => b.article && b.article.id === articleId);
    if (!bookmark) return;

    setLoadingAction(prev => ({ ...prev, [`bookmark-${articleId}`]: true }));
    try {
      await profileApi.removeBookmark(bookmark.id);
      toast.success("Article retiré de vos signets.");
      // Rafraîchir la liste
      fetchBookmarks();
    } catch (err) {
      toast.error("Impossible de supprimer le signet.");
    } finally {
      setLoadingAction(prev => ({ ...prev, [`bookmark-${articleId}`]: false }));
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
        Mon Profil & Espace Personnel
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Editing Form */}
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-900 dark:text-indigo-400" />
            Informations de Profil
          </h2>

          <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
            <Input
              label="Nom d'utilisateur (non modifiable)"
              value={user.username}
              disabled
              icon={User}
              className="opacity-70"
            />
            <Input
              label="Adresse Email (non modifiable)"
              value={user.email}
              disabled
              className="opacity-70"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: Jean"
              />
              <Input
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Dupont"
              />
            </div>

            <Input
              label="Localisation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Lyon, France"
              icon={MapPin}
            />

            <Textarea
              label="Biographie"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Décrivez vos compétences, votre parcours..."
              rows={4}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={updating}
              className="mt-2 w-full"
            >
              Sauvegarder le profil
            </Button>
          </form>
        </section>

        {/* Bookmarked articles (Private signets list) */}
        <section className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-900 dark:text-indigo-400 fill-indigo-900 dark:fill-indigo-400" />
            Mes Signets ({totalBookmarks})
          </h2>

          {loadingBookmarks ? (
            <div className="py-24 flex items-center justify-center">
              <Loader size="medium" />
            </div>
          ) : bookmarks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bookmarks.map((bookmark) => {
                  if (!bookmark.article) return null;
                  return (
                    <ArticleCard
                      key={bookmark.id}
                      article={bookmark.article}
                      isBookmarked={true}
                      onLike={handleLikeBookmarkArticle}
                      onBookmark={handleRemoveBookmark}
                      isOwner={false}
                      isLoadingLike={loadingAction[`like-${bookmark.article.id}`]}
                      isLoadingBookmark={loadingAction[`bookmark-${bookmark.article.id}`]}
                    />
                  );
                })}
              </div>

              <Pagination
                currentPage={bookmarksPage}
                count={totalBookmarks}
                pageSize={10}
                onPageChange={(page) => setBookmarksPage(page)}
              />
            </>
          ) : (
            <EmptyState
              title="Aucun signet enregistré"
              description="Vos articles enregistrés apparaîtront ici de manière privée. Cliquez sur le signet d'un article depuis l'accueil pour le sauvegarder."
              icon={Bookmark}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
