import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { quizzesApi } from '../api/quizzesApi';
import { categoriesApi } from '../api/categoriesApi';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Trophy, HelpCircle, ArrowRight, Play, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

export const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.getAll();
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.results) {
        setCategories(data.results);
      }
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  }, []);

  // Fetch Quizzes
  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await quizzesApi.getAll(selectedCategory);
      setQuizzes(data.results || data || []);
    } catch (err) {
      toast.error("Impossible de charger les quiz.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header section with illustrations/banner style */}
      <section className="mb-10 text-center py-12 px-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden animate-gradient-shift">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-650 to-indigo-900"></div>
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-float pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold mb-4">
            <Trophy className="w-4 h-4 text-yellow-405" />
            OMNITECH Académie
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 uppercase">
            Testez vos connaissances
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Mesurez-vous à nos questionnaires interactifs rédigés par la communauté. Progressez à votre rythme et devenez un expert dans votre domaine.
          </p>
        </div>
      </section>

      {/* Category Filter Panel */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
              selectedCategory === ''
                ? 'bg-indigo-900 border-indigo-900 text-white dark:bg-indigo-700 dark:border-indigo-700 shadow-md shadow-indigo-900/10'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Tous les thèmes
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-205 ${
                selectedCategory === cat.id.toString()
                  ? 'bg-indigo-900 border-indigo-900 text-white dark:bg-indigo-700 dark:border-indigo-700 shadow-md shadow-indigo-900/10'
                  : 'bg-white border-slate-200 text-slate-655 hover:border-slate-350 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat.nom}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader size="large" />
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <Badge variant="primary">{quiz.categorie_name || 'Général'}</Badge>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    {quiz.questions_count} questions
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 leading-snug">
                  {quiz.titre}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {quiz.description || "Aucune description fournie pour ce quiz."}
                </p>
              </div>

              <div>
                <Link to={`/quizzes/${quiz.id}`} className="block">
                  <Button
                    variant="primary"
                    icon={Play}
                    className="w-full justify-center"
                  >
                    Lancer le Quiz
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun quiz disponible"
          description="Il n'y a actuellement aucun questionnaire dans cette catégorie. Revenez plus tard !"
          icon={HelpCircle}
        />
      )}
    </div>
  );
};

export default Quizzes;
