import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <Link to="/" className="px-6 py-2 bg-emerald-600 rounded text-white hover:bg-emerald-700 transition-colors">Go Home</Link>
    </div>
  );
};

export default NotFound; 