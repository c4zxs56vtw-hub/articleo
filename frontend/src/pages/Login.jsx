import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(username, password);
      toast.success("Connexion réussie !");
      navigate('/');
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
      toast.error("Échec de la connexion.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-2xl shadow-xl">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-2xl font-black tracking-wider text-indigo-900 uppercase">
            OMNITECH
          </span>
          <h2 className="mt-3 text-2xl font-bold text-slate-800">
            Connexion à votre espace
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Entrez vos identifiants pour accéder aux fonctionnalités de publication.
          </p>
        </div>

        {/* Global error */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-750 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Nom d'utilisateur"
            placeholder="Ex: jean_dupont"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={User}
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="w-full mt-2"
          >
            Se connecter
          </Button>
        </form>

        {/* Footnote */}
        <div className="mt-6 text-center text-sm text-slate-550 border-t border-slate-100 pt-6">
          Nouveau sur OMNITECH ?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-900 hover:text-indigo-950 hover:underline transition-colors"
          >
            Créer un compte gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
