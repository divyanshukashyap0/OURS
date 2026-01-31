import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Github } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../constants';
import { useSite } from '../context/SiteContext';

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/80 backdrop-blur-md shadow-lg border-b border-gray-800/50' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center gap-2 group"
          >
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover rounded-full group-hover:scale-110 group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out" />
            <span className="text-xl font-bold text-white tracking-tight">{appName}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center bg-gray-900/50 p-1.5 rounded-full border border-gray-800 backdrop-blur-sm mr-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${location.pathname === item.href
                    ? 'bg-gray-800 text-blue-400 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="https://github.com/divyanshukashyap0" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>

              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                  <Link to="/account" className="flex items-center gap-2 text-gray-200 hover:text-blue-400 font-medium">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-gray-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.email?.[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block">Account</span>
                  </Link>
                  <Button variant="ghost" onClick={logout} className="text-sm text-red-500 hover:text-red-400 hover:bg-red-900/10">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                  <Link to="/login" className="text-gray-300 font-medium hover:text-blue-400 transition-colors">
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
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 p-2 active:scale-95 transition-transform"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-950/95 backdrop-blur-xl border-b border-gray-800 absolute w-full transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0 overflow-hidden'}`}
      >
        <div className="px-4 py-6 space-y-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${location.pathname === item.href
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            {!user && (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 text-gray-300 font-medium hover:text-white bg-gray-900 rounded-xl">
                  Log in
                </Link>
                <Button variant="primary" className="w-full justify-center py-3 text-lg" onClick={() => { window.location.href = '/signup'; setIsOpen(false); }}>
                  Sign Up
                </Button>
              </>
            )}
            {user && (
              <>
                <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-xl">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-gray-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-white font-medium">My Account</span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                </Link>
                <Button variant="ghost" onClick={() => { logout(); setIsOpen(false); }} className="w-full justify-center py-3 text-red-400 hover:bg-red-900/20">
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