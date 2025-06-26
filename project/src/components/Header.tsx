import React, { useState, useEffect, useRef } from 'react';
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';
import { User, Menu, X, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../img/logo.png';

const navLinks = [
  { name: 'About Us', to: '#about' },
  { name: 'Opportunities', to: '/opportunities' },
  { name: 'Applied', to: '/dashboard' },
];

export const Header: React.FC = () => {
  const { isSignedIn, user } = useUser();
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
      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-2 md:mx-4 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl px-3 sm:px-6">
        <div className="flex justify-between items-center h-12">
          <Link to="/" className="flex items-center space-x-1">
            <motion.img 
              src={logo}
              alt="Uplift X Events Logo" 
              className="h-8 w-8 cursor-pointer"
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            />
            <span className="text-lg font-bold text-white tracking-tight">UpliftX</span>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-6 w-6 text-gray-300" /> : <Menu className="h-6 w-6 text-gray-300" />}
          </button>
          <div className="flex items-center space-x-2 ml-2">
            {isSignedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="h-6 w-6 rounded-full border border-emerald-400 shadow cursor-pointer" 
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-400 cursor-pointer" />
                  )}
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className="text-white text-sm font-medium">{user?.fullName || user?.username}</p>
                        <p className="text-gray-400 text-xs">{user?.emailAddresses?.[0]?.emailAddress}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <SignOutButton>
                          <button 
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
                <button className="bg-emerald-600 text-white text-xs px-3 py-1 rounded hover:bg-emerald-700 transition-colors shadow">
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
                  className="w-full text-center text-gray-300 hover:text-emerald-400 transition-colors text-base font-medium py-1"
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