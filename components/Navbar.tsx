import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../constants';
import { useSite } from '../context/SiteContext';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { appName } = useSite();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav
      className={`
        fixed w-full z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${scrolled
          ? 'bg-white/80 dark:bg-mono-950/80 backdrop-blur-xl border-b border-mono-100 dark:border-mono-800'
          : 'bg-transparent py-2'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center gap-3 group"
          >
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="w-9 h-9 object-cover rounded-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{
                rotate: [0, 360],
                transition: { duration: 0.7, ease: "easeInOut" }
              }}
            />
            <span className="text-xl font-semibold text-mono-950 dark:text-white tracking-tight">
              {appName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${location.pathname === item.href
                    ? 'text-mono-950 dark:text-white bg-mono-100 dark:bg-mono-800'
                    : 'text-mono-500 hover:text-mono-950 dark:text-mono-400 dark:hover:text-white'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-mono-200 dark:border-mono-700">
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-mono-700 dark:text-mono-300 hover:text-mono-950 dark:hover:text-white font-medium transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-mono-200 dark:border-mono-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-mono-950 dark:bg-white flex items-center justify-center text-white dark:text-mono-950 font-semibold text-sm">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:block">Account</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-mono-500 hover:text-mono-950 dark:hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-mono-200 dark:border-mono-700">
                <Link
                  to="/login"
                  className="text-mono-600 dark:text-mono-400 font-medium hover:text-mono-950 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Button variant="primary" size="sm" onClick={() => window.location.href = '/signup'}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-mono-700 dark:text-mono-200 p-2 active:scale-95 transition-transform"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden bg-white/95 dark:bg-mono-950/95 backdrop-blur-xl 
          border-b border-mono-100 dark:border-mono-800 
          absolute w-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top
          ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0 overflow-hidden'}
        `}
      >
        <div className="px-6 py-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                block px-4 py-3 rounded-xl text-base font-medium transition-colors
                ${location.pathname === item.href
                  ? 'bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-white'
                  : 'text-mono-600 dark:text-mono-400 hover:bg-mono-50 dark:hover:bg-mono-900'
                }
              `}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-mono-100 dark:border-mono-800 flex flex-col gap-3 mt-4">
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 text-mono-600 dark:text-mono-300 font-medium bg-mono-50 dark:bg-mono-900 rounded-xl"
                >
                  Log in
                </Link>
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => { window.location.href = '/signup'; setIsOpen(false); }}
                >
                  Sign Up
                </Button>
              </>
            )}
            {user && (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-mono-50 dark:bg-mono-900 rounded-xl"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-mono-200 dark:border-mono-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-mono-950 dark:bg-white flex items-center justify-center text-white dark:text-mono-950 font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-mono-950 dark:text-white font-medium">My Account</span>
                    <span className="text-xs text-mono-500 dark:text-mono-400">{user.email}</span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full justify-center text-mono-500"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;