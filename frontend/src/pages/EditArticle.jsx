import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesApi } from '../api/articlesApi';
import { categoriesApi } from '../api/categoriesApi';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';

export const EditArticle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // App states
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Auth Protection Check
  useEffect(() => {
    if (!user) {
      toast.error("Vous devez vous connecter pour modifier un article.");
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch Categories and Article details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, articleData] = await Promise.all([
          categoriesApi.getAll(),
          articlesApi.getById(id)
        ]);

        // Parse Categories
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else if (categoriesData.results) {
          setCategories(categoriesData.results);
        }

        // Parse Article Details
        setTitre(articleData.titre);
        setContenu(articleData.contenu);
        if (articleData.categorie) {
          setSelectedCategory(articleData.categorie.id.toString());
        }
      } catch (err) {
        toast.error("Impossible de charger les données de l'article.");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const validateForm = () => {
    const formErrors = {};
    if (!titre.trim()) formErrors.titre = "Le titre est requis.";
    if (titre.length > 100) formErrors.titre = "Le titre ne doit pas dépasser 100 caractères.";
    if (!contenu.trim()) formErrors.contenu = "Le contenu est requis.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        titre,
        contenu,
        categorie: selectedCategory ? parseInt(selectedCategory) : null
      };
      await articlesApi.update(id, payload);
      toast.success("Article mis à jour avec succès !");
      navigate(`/articles/${id}`);
    } catch (err) {
      toast.error("Une erreur est survenue lors de la mise à jour.");
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <BookOpen className="w-6 h-6 text-indigo-900 dark:text-indigo-400" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Modifier l'article
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <Input
            label="Titre de l'article"
            placeholder="Saisir un titre..."
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            error={errors.titre}
            required
          />

          {/* Category selection */}
          <Select
            label="Catégorie"
            emptyOptionText="Sélectionner une catégorie (optionnel)"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories.map(cat => ({ value: cat.id, label: cat.nom }))}
            error={errors.categorie}
          />

          {/* Content */}
          <Textarea
            label="Contenu de l'article"
            placeholder="Écrivez le contenu de l'article..."
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            error={errors.contenu}
            rows={12}
            required
          />

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => navigate(`/articles/${id}`)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;
