import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { supabase, Database } from '../lib/supabase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { useTheme } from '../contexts/ThemeContext';

type Application = Database['public']['Tables']['applications']['Row'];
type Opportunity = Database['public']['Tables']['opportunities']['Row'];

interface ApplicationWithOpportunity extends Application {
  opportunity: Opportunity;
}

export const Dashboard: React.FC = () => {
  const user = useUser();
  const { isDark } = useTheme();
  const [applications, setApplications] = useState<ApplicationWithOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.user?.id) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities(*)
        `)
        .eq('volunteer_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as ApplicationWithOpportunity[] || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    }
  };

  if (!user?.user?.id) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-[#e8faea]'
      }`}>
        <div className={`backdrop-blur-xl p-8 rounded-xl shadow-2xl border w-full max-w-md text-center transition-all duration-300 ${
          isDark ? 'bg-zinc-900/50 border-white/10' : 'liquid-glass'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-[#2D3436]'
          }`}>Sign In Required</h2>
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-[#e8faea]'
      }`}>
        <LoadingSpinner size="lg" text="Loading your applications..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-[#e8faea]'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-[#2D3436]'
          }`}>My Dashboard</h1>
          <p className={`mt-2 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Track your volunteer applications and activities</p>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className={`backdrop-blur-xl rounded-xl shadow-2xl border p-6 transition-all duration-300 ${
                  isDark ? 'bg-zinc-900/50 border-white/10' : 'glass-card glass-hover'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-[#2D3436]'
                    }`}>
                      {application.opportunity.title}
                    </h3>
                    <div className={`flex items-center space-x-4 text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(application.opportunity.date).toLocaleDateString()}</span>
                      </div>
                      <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>

                <p className={`mb-4 transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{application.opportunity.description}</p>

                {application.message && (
                  <div className={`rounded-lg p-4 transition-all duration-300 ${
                    isDark ? 'bg-zinc-800/50' : 'glass-gradient'
                  }`}>
                    <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-[#2D3436]'
                    }`}>Your Application Message:</h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>{application.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className={`backdrop-blur-xl rounded-xl shadow-2xl border p-12 transition-all duration-300 ${
              isDark ? 'bg-zinc-900/50 border-white/10' : 'liquid-glass'
            }`}>
              <Clock className={`h-16 w-16 mx-auto mb-4 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-[#2D3436]'
              }`}>No Applications Yet</h3>
              <p className={`mb-6 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                You haven't applied for any volunteer opportunities yet.
              </p>
              <a
                href="/"
                className={`inline-block px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg ${
                  isDark 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'glass-button glass-hover text-[#2D3436]'
                }`}
              >
                Browse Opportunities
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};