import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import { User, Mail, Lock, MapPin, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const nextErrors = {};
    if (!username.trim()) nextErrors.username = "Le nom d'utilisateur est requis.";
    if (!email.trim()) {
      nextErrors.email = "L'adresse email est requise.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "L'adresse email est invalide.";
    }
    if (!password) {
      nextErrors.password = "Le mot de passe est requis.";
    } else if (password.length < 6) {
      nextErrors.password = "Le mot de passe doit faire au moins 6 caractères.";
    }
    if (password !== passwordConfirm) {
      nextErrors.password_confirm = "Les mots de passe ne correspondent pas.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username,
        email,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName,
        last_name: lastName,
        bio,
        location
      };
      await register(payload);
      toast.success("Votre compte a été créé avec succès !");
      navigate('/');
    } catch (err) {
      toast.error("Échec de la création du compte.");
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-805 p-8 rounded-2xl shadow-xl">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-2xl font-black tracking-wider text-indigo-900 dark:text-indigo-400 uppercase">
            OMNITECH
          </span>
          <h2 className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
            Créer votre compte
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Rejoignez-nous pour publier des articles et interagir avec la communauté.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Identifiants (Grid 2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nom d'utilisateur"
              placeholder="Ex: jean_dupont"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={User}
              error={errors.username}
              required
            />
            <Input
              label="Adresse Email"
              type="email"
              placeholder="Ex: jean.dupont@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              error={errors.email}
              required
            />
          </div>

          {/* Mots de passe (Grid 2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Min. 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              error={errors.password}
              required
            />
            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="Saisir à nouveau"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              icon={Lock}
              error={errors.password_confirm}
              required
            />
          </div>

          {/* Nom / Prénom (Grid 2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Input
              label="Prénom"
              placeholder="Ex: Jean"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.first_name}
            />
            <Input
              label="Nom"
              placeholder="Ex: Dupont"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.last_name}
            />
          </div>

          {/* Localisation */}
          <Input
            label="Localisation"
            placeholder="Ex: Paris, France"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon={MapPin}
            error={errors.location}
          />

          {/* Biographie */}
          <Textarea
            label="Biographie (Bio)"
            placeholder="Parlez-nous un peu de vous ou de vos technologies de prédilection..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            error={errors.bio}
            rows={3}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="w-full mt-2"
          >
            Créer mon compte
          </Button>
        </form>

        {/* Footnote */}
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-900 dark:text-indigo-400 hover:text-indigo-950 dark:hover:text-indigo-300 hover:underline transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
