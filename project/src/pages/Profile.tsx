import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const Profile: React.FC = () => {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = '/user';
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Redirecting to Profile...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default Profile; 