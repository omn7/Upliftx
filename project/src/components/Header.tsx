import React, { useState, useEffect, useRef } from 'react';
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';
import { User, Menu, X, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../img/logo.png';
import lightlogo from '../img/lightlogo.png';
import { useTheme } from '../contexts/ThemeContext';

const navLinks = [
  { name: 'About Us', to: '#about' },
  { name: 'Opportunities', to: '/opportunities' },
  { name: 'Applied', to: '/dashboard' },
];

export const Header: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
      className="sticky top-2 z-30 w-full flex justify-center pointer-events-auto"
    >
      <div className={`w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-2 md:mx-4 rounded-2xl backdrop-blur-xl border shadow-2xl px-3 sm:px-6 transition-all duration-300 ${
        isDark 
          ? 'bg-black/20 border-white/10' 
          : 'liquid-glass glass-hover'
      }`}>
        <div className="flex justify-between items-center h-12">
          <Link to="/" className="flex items-center space-x-1">
            <motion.img 
              src={isDark ? logo : lightlogo}
              alt="Uplift X Events Logo" 
              className="h-8 w-8 cursor-pointer"
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            />
            <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#2D3436]'
            }`}>UpliftX</span>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`transition-colors text-sm font-medium ${
                  isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDark 
                ? 'hover:bg-white/10' 
                : 'glass-button glass-hover'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
              isDark 
                ? 'hover:bg-white/10' 
                : 'glass-button glass-hover'
            }`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <X className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            )}
          </button>
          <div className="flex items-center space-x-2 ml-2">
            {isSignedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2 p-1 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'hover:bg-white/10' 
                      : 'glass-button glass-hover'
                  }`}
                >
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="h-6 w-6 rounded-full border border-emerald-400 shadow cursor-pointer" 
                    />
                  ) : (
                    <User className={`h-5 w-5 cursor-pointer ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  )}
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-2 w-48 backdrop-blur-xl border rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                        isDark 
                          ? 'bg-black/90 border-white/10' 
                          : 'liquid-glass'
                      }`}
                    >
                      <div className={`p-3 border-b transition-colors duration-300 ${
                        isDark ? 'border-white/10' : 'border-white/20'
                      }`}>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDark ? 'text-white' : 'text-[#2D3436]'
                        }`}>{user?.fullName || user?.username}</p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>{user?.emailAddresses?.[0]?.emailAddress}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          className={`flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                              : 'text-gray-600 hover:text-[#2D3436] hover:glass-button'
                          }`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <SignOutButton>
                          <button 
                            className={`flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                              isDark 
                                ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                                : 'text-gray-600 hover:text-[#2D3436] hover:glass-button'
                            }`}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </SignOutButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className={`text-xs px-3 py-1 rounded font-medium transition-all duration-300 ${
                  isDark 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'glass-button glass-hover text-[#2D3436]'
                }`}>
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
        {/* Mobile nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden flex flex-col items-center gap-2 pb-3"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`w-full text-center transition-colors text-base font-medium py-1 ${
                    isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};