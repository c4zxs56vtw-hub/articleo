import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/common/Loader';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import ArticleDetail from './pages/ArticleDetail';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';

// Notifications
import { Toaster } from 'react-hot-toast';

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

// Anonymous Route Wrapper (Redirects logged in users to Home)
const AnonymousRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }
  return user ? <Navigate to="/" replace /> : children;
};

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className: 'text-sm font-semibold rounded-xl text-slate-800 shadow-lg border border-slate-100 bg-white/90 backdrop-blur-md',
          success: {
            iconTheme: {
              primary: '#312e81',
              secondary: '#fff',
            },
          },
        }}
      />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />

          {/* Protected routes for non-authenticated users */}
          <Route
            path="/login"
            element={
              <AnonymousRoute>
                <Login />
              </AnonymousRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AnonymousRoute>
                <Register />
              </AnonymousRoute>
            }
          />

          {/* Protected private routes */}
          <Route
            path="/create-article"
            element={
              <PrivateRoute>
                <CreateArticle />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-article/:id"
            element={
              <PrivateRoute>
                <EditArticle />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
