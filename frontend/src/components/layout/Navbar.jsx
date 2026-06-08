import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User as UserIcon, LogOut, Bookmark, PlusCircle, LayoutDashboard } from 'lucide-react';
import Button from '../common/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setShowProfileMenu(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-250 py-2 border-b-2 ${
      isActive
        ? 'border-indigo-900 text-indigo-900 font-bold'
        : 'border-transparent text-slate-500 hover:text-slate-800'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-150/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand name */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-indigo-900 uppercase">
                OMNITECH
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={navLinkClass} end>
              Accueil
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              À Propos
            </NavLink>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={PlusCircle}
                  onClick={() => navigate('/create-article')}
                >
                  Publier
                </Button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-sm">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 pr-1">
                      {user.username}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-20 border border-slate-100">
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Mon compte
                          </p>
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {user.first_name || user.username} {user.last_name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>Mon Profil</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-650 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-650 hover:text-slate-900 transition-colors">
                  Connexion
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Inscription
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-150 bg-white/95 backdrop-blur-md py-4 px-4 space-y-4">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
            >
              À Propos
            </Link>
          </nav>

          <div className="border-t border-slate-100 pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="px-3 py-1.5 mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connecté en tant que</p>
                  <p className="text-sm font-bold text-slate-800">{user.username}</p>
                </div>
                
                <Link
                  to="/create-article"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4.5 h-4.5 text-slate-400" />
                  <span>Publier un article</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <UserIcon className="w-4.5 h-4.5 text-slate-400" />
                  <span>Mon Profil & Signets</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-650 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4.5 h-4.5 text-red-400" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2 text-sm font-semibold text-slate-650 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Connexion
                </Link>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/register');
                  }}
                  className="w-full"
                >
                  Inscription
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
