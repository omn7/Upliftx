import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import Profile from './pages/Profile';
import { LoadingSpinner } from './components/ui/loading-spinner';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const PUBLISHABLE_KEY = 'pk_test_ZGlzdGluY3QtY29sbGllLTQyLmNsZXJrLmFjY291bnRzLmRldiQ';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading VolunteerHub..." />
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${
          isDark ? 'bg-black' : 'bg-[#e8faea]'
        }`}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;