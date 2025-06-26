import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { supabase, Database } from '../lib/supabase';
import { LoadingSpinner } from '../components/ui/loading-spinner';

type Application = Database['public']['Tables']['applications']['Row'];
type Opportunity = Database['public']['Tables']['opportunities']['Row'];

interface ApplicationWithOpportunity extends Application {
  opportunity: Opportunity;
}

export const Dashboard: React.FC = () => {
  const user = useUser();
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-xl shadow-2xl border border-white/10 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your applications..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
          <p className="text-gray-400 mt-2">Track your volunteer applications and activities</p>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {application.opportunity.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
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

                <p className="text-gray-300 mb-4">{application.opportunity.description}</p>

                {application.message && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Your Application Message:</h4>
                    <p className="text-gray-300 text-sm">{application.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
              <p className="text-gray-400 mb-6">
                You haven't applied for any volunteer opportunities yet.
              </p>
              <a
                href="/"
                className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg"
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