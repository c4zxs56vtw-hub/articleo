import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-md font-bold tracking-wider text-indigo-900 uppercase">
            OMNITECH
          </span>
          <span className="text-slate-300 text-sm">|</span>
          <p className="text-sm text-slate-500">
            Plateforme de publication et d'échanges techniques.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <Link to="/about" className="hover:text-indigo-900 transition-colors">
            À Propos
          </Link>
          <span>&copy; {currentYear} OMNITECH. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
