import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesApi } from '../api/articlesApi';
import { categoriesApi } from '../api/categoriesApi';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';

export const CreateArticle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // App states
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Auth Protection Check
  useEffect(() => {
    if (!user) {
      toast.error("Vous devez vous connecter pour créer un article.");
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
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
      const result = await articlesApi.create(payload);
      toast.success("Article publié avec succès !");
      navigate(`/articles/${result.id}`);
    } catch (err) {
      toast.error("Une erreur est survenue lors de la publication.");
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <BookOpen className="w-6 h-6 text-indigo-900 dark:text-indigo-400" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Publier un nouvel article
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <Input
            label="Titre de l'article"
            placeholder="Saisir un titre accrocheur..."
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
            placeholder="Rédigez le contenu de votre article ici..."
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
              onClick={() => navigate('/')}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
            >
              Publier l'article
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
