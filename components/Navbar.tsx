import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Sun, Moon, Github } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();
  const { user, logout } = useAuth();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center gap-2 group"
          >
            <img src="/logo.png" alt="OURS Logo" className="w-10 h-10 object-cover rounded-full group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">OURS.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center bg-gray-100 dark:bg-gray-900/50 p-1.5 rounded-full border border-gray-200 dark:border-gray-800 backdrop-blur-sm mr-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${location.pathname === item.href
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <a href="https://github.com/divyanshukashyap0" target="_blank" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github size={20} />
              </a>

              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                  <Link to="/account" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.email?.[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block">Account</span>
                  </Link>
                  <Button variant="ghost" onClick={logout} className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                  <Link to="/login" className="text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Log in
                  </Link>
                  <Button variant="primary" size="sm" onClick={() => window.location.href = '/signup'}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-200 p-1"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full shadow-xl">
          <div className="px-4 py-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${location.pathname === item.href
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;