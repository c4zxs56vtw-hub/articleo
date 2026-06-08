import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 bg-indigo-50 text-indigo-900 rounded-full mb-6">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-700 mb-4">Page Introuvable</h2>
      <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée vers un autre emplacement.
      </p>
      <Link to="/">
        <Button variant="primary">Retourner à l'accueil</Button>
      </Link>
    </div>
  );
};

export default NotFound;
