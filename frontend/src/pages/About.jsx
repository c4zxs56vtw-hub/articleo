import React from 'react';
import { BookOpen, UserCheck } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-wider">
          À Propos de OMNITECH
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Découvrez la plateforme collaborative pensée pour les développeurs et les passionnés de technologies.
        </p>
      </div>

      {/* What is OMNITECH section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-900 dark:text-indigo-500" />
          Qu'est-ce que OMNITECH ?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          OMNITECH est une plateforme de publication de blog et d'échanges techniques. Elle permet aux membres de partager leurs connaissances, tutoriels, et astuces à travers des articles structurés, et d'interagir en direct grâce à un système complet de commentaires et d'appréciations.
        </p>
      </section>

      {/* How to use section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-900 dark:text-indigo-500" />
          Comment utiliser la plateforme ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visitors */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-400 uppercase tracking-wide mb-3">
              En tant que Visiteur
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-900 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Parcourir les publications</strong> : Consultez la grille d'accueil avec les derniers articles mis en ligne.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-900 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Filtrer par catégorie</strong> : Naviguez facilement à l'aide du sélecteur de catégories pour cibler les sujets qui vous intéressent.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-900 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Recherche textuelle</strong> : Trouvez rapidement des tutoriels en tapant des mots-clés dans la barre de recherche.</span>
              </li>
            </ul>
          </div>

          {/* Members */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-400 uppercase tracking-wide mb-3">
              En tant que Membre connecté
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-900 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Rédiger des articles</strong> : Créez et mettez à jour vos propres contributions depuis l'éditeur d'articles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-900 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Interagir & Donner son avis</strong> : Aimez (likez) les articles ou les commentaires, et engagez la discussion sous chaque sujet.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-900 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Signets privés</strong> : Enregistrez des articles en un clic pour les retrouver plus tard dans votre espace personnel.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
