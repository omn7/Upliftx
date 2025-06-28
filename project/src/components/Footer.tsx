import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../img/logo.png';
import lightlogo from '../img/lightlogo.png';
import { useTheme } from '../contexts/ThemeContext';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <footer className={`border-t transition-all duration-300 ${
      isDark ? 'bg-black/90 border-white/10' : 'liquid-glass'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src={isDark ? logo : lightlogo} alt="Upliftx Logo" className="h-8 w-8" />
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-[#2D3436]'
              }`}>Upliftx</span>
            </Link>
            <p className={`text-sm leading-relaxed mb-6 transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Empowering Communities, One Volunteer at a Time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`hover:text-emerald-400 transition-all duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className={`hover:text-emerald-400 transition-all duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className={`hover:text-emerald-400 transition-all duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className={`hover:text-emerald-400 transition-all duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#2D3436]'
            }`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`hover:text-emerald-400 transition-all duration-300 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="#about" className={`hover:text-emerald-400 transition-all duration-300 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className={`hover:text-emerald-400 transition-all duration-300 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Opportunities
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={`hover:text-emerald-400 transition-all duration-300 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#2D3436]'
            }`}>Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`hover:text-emerald-400 transition-all duration-300 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className={`hover:text-emerald-400 transition-all duration-300 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className={`hover:text-emerald-400 transition-all duration-300 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className={`hover:text-emerald-400 transition-all duration-300 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#2D3436]'
            }`}>Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>info@upliftx.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>+91 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>123 Volunteer St, City, State</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t mt-4 pt-4 flex flex-col sm:flex-row justify-between items-center gap-1 text-xs sm:text-sm transition-all duration-300 ${
          isDark ? 'border-white/10' : 'border-white/20'
        }`}>
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © 2025 Upliftx. All rights reserved.
          </p>
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Developed by Om Narkhede
          </p>
        </div>
      </div>
    </footer>
  );
}; 