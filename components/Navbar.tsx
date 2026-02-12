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
        fixed w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${scrolled ? 'py-4' : 'py-6'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div
          className={`
            relative mx-auto flex justify-between items-center h-16 px-6 rounded-full transition-all duration-500
            ${scrolled
              ? 'bg-mono-950/80 backdrop-blur-xl border border-white/10 shadow-lg shadow-neon-cyan/5 w-full md:w-[90%]'
              : 'bg-transparent w-full'
            }
          `}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-neon-cyan/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 object-cover rounded-full relative z-10 border-2 border-transparent group-hover:border-neon-cyan/50 transition-colors"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-neon-cyan transition-colors duration-300">
              {appName}<span className="text-neon-violet">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`
                  relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${location.pathname === item.href
                    ? 'text-mono-950 bg-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                    : 'text-mono-400 hover:text-white hover:bg-white/10'
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
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-mono-300 hover:text-white transition-colors group"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white/10 group-hover:border-neon-cyan/50 transition-all"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mono-800 to-mono-900 flex items-center justify-center text-white font-bold text-sm border border-white/10 group-hover:border-neon-cyan/50 transition-all">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-mono-400 font-medium hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.href = '/signup'}
                  className="bg-white text-black hover:bg-neon-cyan hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] border-none"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
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
          md:hidden fixed inset-x-4 top-24 bg-mono-950/95 backdrop-blur-2xl 
          border border-white/10 rounded-3xl overflow-hidden
          transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top z-40
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
        `}
      >
        <div className="p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                block px-4 py-3 rounded-xl text-base font-medium transition-colors
                ${location.pathname === item.href
                  ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                  : 'text-mono-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 text-mono-400 font-medium bg-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Button
                  variant="primary"
                  className="w-full justify-center bg-neon-cyan text-black hover:bg-white border-none"
                  onClick={() => { window.location.href = '/signup'; setIsOpen(false); }}
                >
                  Sign Up
                </Button>
              </>
            )}
            {user && (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-mono-800 flex items-center justify-center text-white font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-white font-medium">My Account</span>
                    <span className="text-xs text-mono-500">{user.email}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="text-mono-400 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;