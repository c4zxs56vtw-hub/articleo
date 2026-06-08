import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-8 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-md font-bold tracking-wider text-indigo-900 dark:text-indigo-400 uppercase">
            OMNITECH
          </span>
          <span className="text-slate-300 dark:text-slate-700 text-sm">|</span>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Plateforme de publication et d'échanges techniques.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/about" className="hover:text-indigo-900 dark:hover:text-indigo-350 transition-colors">
            À Propos
          </Link>
          <span>&copy; {currentYear} OMNITECH. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
