import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizzesApi } from '../api/quizzesApi';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, HelpCircle, RefreshCw, BookOpen, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // App States
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState('intro'); // intro, playing, finished

  // Play States
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // 'A', 'B', 'C', 'D'
  const [isValidated, setIsValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [answersLog, setAnswersLog] = useState([]); // tracks correct/incorrect per question

  // Fetch Quiz Detail
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const data = await quizzesApi.getById(id);
        setQuiz(data);
      } catch (err) {
        toast.error("Impossible de charger le quiz.");
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Quiz non disponible</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Ce quiz ne contient aucune question pour l'instant.</p>
        <Link to="/quizzes">
          <Button variant="primary">Retourner à la liste</Button>
        </Link>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentIdx];

  // Action handlers
  const handleStartQuiz = () => {
    setGameState('playing');
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsValidated(false);
    setScore(0);
    setAnswersLog([]);
  };

  const handleSelectOption = (option) => {
    if (isValidated) return; // cannot change after validation
    setSelectedOption(option);
  };

  const handleValidate = () => {
    if (!selectedOption || isValidated) return;

    setIsValidated(true);
    const isCorrect = selectedOption === currentQuestion.reponse_correcte;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnswersLog(prev => [...prev, {
      questionIdx: currentIdx,
      selected: selectedOption,
      correct: currentQuestion.reponse_correcte,
      isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsValidated(false);
    } else {
      setGameState('finished');
    }
  };

  // Score description text
  const getScoreFeedback = (pct) => {
    if (pct === 100) return { title: "Score Parfait !", msg: "Exceptionnel ! Vous maîtrisez parfaitement ce sujet.", color: "text-green-500" };
    if (pct >= 80) return { title: "Félicitations !", msg: "Excellent travail, vos connaissances sont très solides.", color: "text-indigo-500 dark:text-indigo-400" };
    if (pct >= 60) return { title: "Bon score !", msg: "Très bien, vous avez de bonnes bases sur ce thème.", color: "text-indigo-500 dark:text-indigo-400" };
    if (pct >= 40) return { title: "Pas mal !", msg: "Des bases sont là, mais une révision des explications vous aidera à vous améliorer.", color: "text-yellow-600" };
    return { title: "Continuez d'apprendre !", msg: "Ne vous découragez pas ! Relisez les articles associés et retentez votre chance.", color: "text-red-500" };
  };

  const successPercentage = Math.round((score / questions.length) * 100);
  const feedback = getScoreFeedback(successPercentage);

  // Intro Screen JSX
  if (gameState === 'intro') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/quizzes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux quiz
        </Link>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6 border border-indigo-100 dark:border-indigo-900 animate-float">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>

          <Badge variant="primary" className="mb-3">{quiz.categorie_name || 'Général'}</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 leading-snug">
            {quiz.titre}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base max-w-xl mx-auto mb-8">
            {quiz.description || "Évaluez vos compétences avec ce questionnaire interactif."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-450 dark:text-slate-500 border-y border-slate-100 dark:border-slate-800 py-4 mb-8">
            <span>Nombre de questions : <strong className="text-slate-700 dark:text-slate-300">{questions.length}</strong></span>
            <span className="w-1.5 h-1.5 bg-slate-305 dark:bg-slate-700 rounded-full hidden sm:block"></span>
            <span>Règle : <strong className="text-slate-700 dark:text-slate-300">Validation immédiate</strong></span>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Play}
            onClick={handleStartQuiz}
            className="px-8"
          >
            Commencer le Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Finished Screen JSX
  if (gameState === 'finished') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 relative">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-900/10 dark:border-indigo-400/10 border-t-indigo-900 dark:border-t-indigo-400 animate-spin"></div>
          </div>

          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Résultat final</span>
          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mb-2">
            {feedback.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-450 mb-8 max-w-md mx-auto">
            {feedback.msg}
          </p>

          {/* Score Circle / Badge details */}
          <div className="inline-flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8">
            <span className="text-5xl font-black text-indigo-900 dark:text-indigo-400 mb-1">{score} <span className="text-2xl text-slate-400">/ {questions.length}</span></span>
            <span className={`text-sm font-bold ${feedback.color}`}>{successPercentage}% de réussite</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate('/quizzes')}
              className="w-full sm:w-auto"
            >
              Retourner aux quiz
            </Button>
            <Button
              variant="primary"
              icon={RefreshCw}
              onClick={handleStartQuiz}
              className="w-full sm:w-auto"
            >
              Recommencer le quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active Play Screen JSX
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Quiz Progress header */}
      <div className="flex items-center justify-between gap-4 mb-3 text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-semibold">
        <span>Question {currentIdx + 1} sur {questions.length}</span>
        <span>{progressPercent}% complété</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-indigo-900 dark:bg-indigo-700 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug mb-8">
          {currentQuestion.texte}
        </h2>

        {/* Choices Options list */}
        <div className="flex flex-col gap-3 mb-8">
          {[
            { key: 'A', text: currentQuestion.choix_a },
            { key: 'B', text: currentQuestion.choix_b },
            { key: 'C', text: currentQuestion.choix_c },
            { key: 'D', text: currentQuestion.choix_d }
          ].map((option) => {
            const isSelected = selectedOption === option.key;
            const isCorrectAnswer = option.key === currentQuestion.reponse_correcte;
            
            let btnClass = "border-slate-200 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-350 text-slate-700 dark:text-slate-300";
            
            if (isSelected) {
              btnClass = "border-indigo-900 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-905 dark:text-indigo-400 font-semibold ring-1 ring-indigo-900 dark:ring-indigo-700";
            }

            if (isValidated) {
              if (isCorrectAnswer) {
                // Style correct option green
                btnClass = "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-semibold ring-1 ring-green-500";
              } else if (isSelected) {
                // Style chosen incorrect option red
                btnClass = "border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-semibold ring-1 ring-red-500";
              } else {
                // Rest of choices disabled style
                btnClass = "border-slate-150 dark:border-slate-850 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed";
              }
            }

            return (
              <button
                key={option.key}
                disabled={isValidated}
                onClick={() => handleSelectOption(option.key)}
                className={`w-full p-4 rounded-xl border text-sm text-left transition-all duration-200 flex items-center justify-between gap-3 ${btnClass}`}
              >
                <span>
                  <strong className="mr-2.5 font-bold">{option.key}.</strong>
                  {option.text}
                </span>

                {/* Status Icon Indicator if validated */}
                {isValidated && (
                  <>
                    {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    {!isCorrectAnswer && isSelected && <XCircle className="w-5 h-5 text-red-650 flex-shrink-0" />}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation Box if validated */}
        {isValidated && (
          <div className={`p-5 rounded-2xl border mb-8 animate-float-spin-once ${
            selectedOption === currentQuestion.reponse_correcte
              ? 'bg-green-50/40 dark:bg-green-950/10 border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-300'
              : 'bg-red-50/40 dark:bg-red-950/10 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300'
          }`}>
            <h4 className="font-bold text-sm flex items-center gap-1.5 mb-2">
              <BookOpen className="w-4 h-4" />
              Explication
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed">
              {currentQuestion.explication || "Pas d'explication fournie."}
            </p>
          </div>
        )}

        {/* Action button validation / navigation */}
        <div className="flex justify-end pt-5 border-t border-slate-100 dark:border-slate-800">
          {!isValidated ? (
            <Button
              variant="primary"
              disabled={!selectedOption}
              onClick={handleValidate}
              className="px-6"
            >
              Valider la réponse
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              className="px-6"
            >
              {currentIdx + 1 < questions.length ? "Question suivante" : "Terminer et voir le score"}
            </Button>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          if (window.confirm("Voulez-vous vraiment quitter le quiz en cours ? Votre progression sera perdue.")) {
            navigate('/quizzes');
          }
        }}
        className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 mx-auto block transition-colors"
      >
        Quitter le quiz
      </button>
    </div>
  );
};

export default QuizPlay;
