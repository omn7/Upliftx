import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Calendar, MapPin, Users, Star, Upload, Camera } from 'lucide-react';
import { supabase, Database } from '../lib/supabase';

type Application = Database['public']['Tables']['applications']['Row'];
type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export const User: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<{ [key: string]: Opportunity }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState<string>('');

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserData();
    }
  }, [isSignedIn, user]);

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      // Fetch user's applications
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('volunteer_id', user.id)
        .order('created_at', { ascending: false });

      if (appsError) throw appsError;
      setApplications(appsData || []);

      // Fetch related opportunities
      if (appsData && appsData.length > 0) {
        const opportunityIds = [...new Set(appsData.map(app => app.opportunity_id))];
        const { data: oppsData, error: oppsError } = await supabase
          .from('opportunities')
          .select('*')
          .in('id', opportunityIds);

        if (oppsError) throw oppsError;
        const oppsMap = (oppsData || []).reduce((acc, opp) => {
          acc[opp.id] = opp;
          return acc;
        }, {} as { [key: string]: Opportunity });
        setOpportunities(oppsMap);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setUploadingImage(true);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `volunteer-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('volunteer-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('volunteer-images')
        .getPublicUrl(filePath);

      setUserImageUrl(publicUrl);

      // Update the user's profile with the image URL
      // You might want to store this in a profiles table or update Clerk profile
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-xl shadow-2xl border border-white/10 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view your profile and applications.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-emerald-500/30 overflow-hidden">
                {userImageUrl ? (
                  <img 
                    src={userImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-emerald-600 p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                <Upload className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {user.fullName || user.username || 'Volunteer'}
              </h1>
              <p className="text-gray-400 mb-4">{user.emailAddresses?.[0]?.emailAddress}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-emerald-400 font-medium">Total Applications</div>
                  <div className="text-white text-lg">{applications.length}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-emerald-400 font-medium">Approved</div>
                  <div className="text-white text-lg">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-emerald-400 font-medium">Average Rating</div>
                  <div className="text-white text-lg">
                    {(() => {
                      const ratedApps = applications.filter(app => app.rating);
                      if (ratedApps.length === 0) return 'N/A';
                      const avg = ratedApps.reduce((sum, app) => sum + (app.rating || 0), 0) / ratedApps.length;
                      return avg.toFixed(1);
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">My Applications</h2>
          
          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => {
                const opportunity = opportunities[application.opportunity_id];
                return (
                  <div key={application.id} className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {opportunity?.title || 'Unknown Opportunity'}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                          {application.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-yellow-400">{application.rating}/5</span>
                            </div>
                          )}
                        </div>
                        
                        {opportunity && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div className="flex items-center text-gray-400">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{opportunity.location}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <Users className="h-4 w-4 mr-2" />
                              <span>{opportunity.category}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-400 space-y-1">
                          <div>Applied: {new Date(application.created_at).toLocaleDateString()}</div>
                          {application.message && (
                            <div>
                              <span className="text-gray-300">Your message: </span>
                              <span className="text-gray-400">{application.message}</span>
                            </div>
                          )}
                          {application.admin_notes && (
                            <div>
                              <span className="text-gray-300">Admin notes: </span>
                              <span className="text-gray-400">{application.admin_notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">You haven't applied for any opportunities yet.</p>
              <p className="text-gray-500 mt-2">Browse opportunities and start volunteering!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 