import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categoriesApi } from '../api/categoriesApi';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { FolderPlus, Edit, Trash2, Tag, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const Categories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    if (!user) {
      toast.error("Veuillez vous connecter pour gérer les catégories.");
      navigate('/login');
    }
  }, [user, navigate]);

  // States
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null for create, category object for edit

  // Form states
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getAll();
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.results) {
        setCategories(data.results);
      }
    } catch (err) {
      toast.error("Impossible de charger les catégories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setNom('');
    setDescription('');
    setErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setNom(category.nom);
    setDescription(category.description || '');
    setErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNom('');
    setDescription('');
    setErrors({});
  };

  const validateForm = () => {
    const formErrors = {};
    if (!nom.trim()) formErrors.nom = "Le nom de la catégorie est requis.";
    if (nom.length > 100) formErrors.nom = "Le nom ne doit pas dépasser 100 caractères.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = { nom, description };
      if (editingCategory) {
        // Update
        await categoriesApi.update(editingCategory.id, payload);
        toast.success("Catégorie mise à jour avec succès !");
      } else {
        // Create
        await categoriesApi.create(payload);
        toast.success("Catégorie créée avec succès !");
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      toast.error("Une erreur est survenue.");
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id, name) => {
    const confirmMessage = `Voulez-vous vraiment supprimer la catégorie "${name}" ? \n\nNote : Les articles reliés à cette catégorie ne seront pas supprimés, mais leur catégorie sera définie sur "Général".`;
    if (window.confirm(confirmMessage)) {
      try {
        await categoriesApi.delete(id);
        toast.success("Catégorie supprimée avec succès.");
        fetchCategories();
      } catch (err) {
        toast.error("Impossible de supprimer cette catégorie.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Gestion des Catégories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Créez, modifiez ou supprimez les thèmes qui structurent les articles de la plateforme.
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            icon={FolderPlus}
            onClick={handleOpenCreateModal}
          >
            Créer une catégorie
          </Button>
        </div>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader size="large" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 bg-white border border-slate-100 hover:border-slate-200 shadow-sm rounded-xl flex justify-between gap-4 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex-grow">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <Tag className="w-4 h-4 text-indigo-900" />
                  {cat.nom}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {cat.description || "Aucune description fournie."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col justify-start gap-1">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-900 transition-colors"
                  title="Modifier la catégorie"
                >
                  <Edit className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.nom)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Supprimer la catégorie"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucune catégorie existante"
          description="Créez votre première catégorie pour commencer à classer les publications du site."
          icon={Tag}
          actionButton={
            <Button variant="primary" icon={FolderPlus} onClick={handleOpenCreateModal}>
              Créer une catégorie
            </Button>
          }
        />
      )}

      {/* Create / Edit Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {editingCategory && (
            <div className="p-3 bg-yellow-50 border border-yellow-150 text-yellow-805 rounded-lg text-xs flex gap-2 items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Attention</strong> : Renommer cette catégorie affectera immédiatement tous les articles actuellement associés.
              </span>
            </div>
          )}

          <Input
            label="Nom de la catégorie"
            placeholder="Ex: Programmation Web, DevOps, IA..."
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            error={errors.nom}
            required
          />

          <Textarea
            label="Description (optionnel)"
            placeholder="Décrivez brièvement le sujet de cette catégorie..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            rows={3}
          />

          <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingCategory ? "Enregistrer" : "Créer la catégorie"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
