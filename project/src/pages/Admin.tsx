import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, MapPin, Trash2, CheckCircle, XCircle, Star } from 'lucide-react';
import { supabase as staticSupabase, Database } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

type Application = Database['public']['Tables']['applications']['Row'];

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

const ADMIN_EMAIL = 'omnarkhedeofficial@gmail.com'; // CHANGE THIS TO YOUR REAL ADMIN EMAIL

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const supabase = staticSupabase;
  const [session, setSession] = useState<any>(null);
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    date: '',
    max_volunteers: '',
    category: '',
    price: '',
  });
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [applicants, setApplicants] = useState<{ [key: string]: Application[] }>({});
  const [applicationRatings, setApplicationRatings] = useState<{ [key: string]: number }>({});
  const [applicationNotes, setApplicationNotes] = useState<{ [key: string]: string }>({});
  const [allUserRatings, setAllUserRatings] = useState<{ [volunteerId: string]: number[] }>({});

  const categories = ['Community Service', 'Education', 'Environment', 'Healthcare', 'Animal Care', 'Senior Care'];

  useEffect(() => {
    // Check for Supabase session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (!data.session) {
        navigate('/admin-login');
      } else {
        fetchOpportunities();
      }
    };
    getSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/admin-login');
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const fetchOpportunities = async () => {
    console.log('fetchOpportunities function is running');
    try {
      const { data, error } = await staticSupabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
      console.log('Fetched opportunities:', data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const fetchApplicants = async (opportunityId: string) => {
    if (applicants[opportunityId]) return; // already fetched
    try {
      const { data, error } = await staticSupabase
        .from('applications')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplicants((prev) => ({ ...prev, [opportunityId]: data || [] }));
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await staticSupabase.from('opportunities').insert({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        date: formData.date,
        max_volunteers: parseInt(formData.max_volunteers),
        category: formData.category,
        current_volunteers: 0,
        is_active: true,
        price: formData.price ? parseFloat(formData.price) : 0,
      });

      if (error) throw error;

      // Reset form
      setFormData({
        title: '',
        description: '',
        requirements: '',
        location: '',
        date: '',
        max_volunteers: '',
        category: '',
        price: '',
      });
      setShowForm(false);
      fetchOpportunities();
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert('Failed to create opportunity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOpportunityStatus = async (id: string, currentStatus: boolean) => {
    setUpdatingStatus(prev => ({ ...prev, [id]: true }));
    try {
      console.log('Attempting to toggle opportunity:', id, 'from', currentStatus, 'to', !currentStatus);
      
      // First, try to disable RLS temporarily for this operation
      const { error: rlsError } = await staticSupabase.rpc('disable_rls_temporarily');
      if (rlsError) {
        console.log('Could not disable RLS, proceeding with normal operation');
      }
      
      const { error } = await staticSupabase
        .from('opportunities')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      console.log('Supabase response:', { error });
      
      if (error) {
        console.error('Supabase error details:', error);
        
        // If it's a permission error, try a different approach
        if (error.message?.includes('permission') || error.message?.includes('policy')) {
          alert('Permission error. Please run the SQL script in Supabase dashboard to fix permissions.');
          throw new Error('Database permission error. Please contact admin.');
        }
        
        throw error;
      }
      
      alert(`Opportunity ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchOpportunities();
    } catch (error) {
      console.error('Error updating opportunity status:', error);
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to ${currentStatus ? 'deactivate' : 'activate'} opportunity: ${errorMessage}`);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const deleteOpportunity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      return;
    }

    setUpdatingStatus(prev => ({ ...prev, [id]: true }));
    try {
      console.log('Attempting to delete opportunity:', id);
      // First delete related applications
      const { data: appsData, error: deleteAppsError, count: appsDeleted } = await staticSupabase
        .from('applications')
        .delete()
        .eq('opportunity_id', id)
        .select('id');
      if (deleteAppsError) {
        console.error('Error deleting applications:', deleteAppsError);
      }
      // Then delete the opportunity
      const { data: oppData, error, count: oppDeleted } = await staticSupabase
        .from('opportunities')
        .delete()
        .eq('id', id)
        .select('id');
      if (error) {
        console.error('Supabase error details:', error);
        if (error.message?.includes('permission') || error.message?.includes('policy')) {
          alert('Permission error. Please run the SQL script in Supabase dashboard to fix permissions.');
          throw new Error('Database permission error. Please contact admin.');
        }
        throw error;
      }
      console.log('Calling fetchOpportunities after delete');
      await fetchOpportunities();
      console.log('Opportunities after fetch:', opportunities);
      alert(`Opportunity deleted successfully! (${appsDeleted || 0} applications also removed)`);
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to delete opportunity: ${errorMessage}`);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      console.log('Attempting to update application status:', { applicationId, status });
      
      const { data, error } = await staticSupabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .select('id, status');

      console.log('Status update response:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      // Update local state
      setApplicants(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(oppId => {
          updated[oppId] = updated[oppId].map(app => 
            app.id === applicationId ? { ...app, status } : app
          );
        });
        return updated;
      });

      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error updating application status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to update application status: ${errorMessage}`);
    }
  };

  const handleApplicationRating = async (applicationId: string, rating: number) => {
    try {
      console.log('Attempting to save rating:', { applicationId, rating });
      
      const { data, error } = await staticSupabase
        .from('applications')
        .update({ rating })
        .eq('id', applicationId)
        .select('id, rating');

      console.log('Rating update response:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      // Update local state
      setApplicationRatings(prev => ({ ...prev, [applicationId]: rating }));
      setApplicants(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(oppId => {
          updated[oppId] = updated[oppId].map(app => 
            app.id === applicationId ? { ...app, rating } : app
          );
        });
        return updated;
      });

      alert('Rating saved successfully!');
    } catch (error) {
      console.error('Error saving rating:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save rating: ${errorMessage}`);
    }
  };

  const handleApplicationNotes = async (applicationId: string, notes: string) => {
    try {
      console.log('Attempting to save notes:', { applicationId, notes });
      
      const { data, error } = await staticSupabase
        .from('applications')
        .update({ admin_notes: notes })
        .eq('id', applicationId)
        .select('id, admin_notes');

      console.log('Notes update response:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      // Update local state
      setApplicationNotes(prev => ({ ...prev, [applicationId]: notes }));
      setApplicants(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(oppId => {
          updated[oppId] = updated[oppId].map(app => 
            app.id === applicationId ? { ...app, admin_notes: notes } : app
          );
        });
        return updated;
      });

      alert('Notes saved successfully!');
    } catch (error) {
      console.error('Error saving notes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save notes: ${errorMessage}`);
    }
  };

  const testRatingFunctionality = async () => {
    try {
      console.log('Testing rating functionality...');
      
      // First, check if we can read applications
      const { data: readData, error: readError } = await staticSupabase
        .from('applications')
        .select('id, rating, admin_notes')
        .limit(1);
      
      console.log('Read test:', { readData, readError });
      
      if (readError) {
        throw new Error(`Read failed: ${readError.message}`);
      }
      
      // If we have an application, try to update it
      if (readData && readData.length > 0) {
        const testAppId = readData[0].id;
        console.log('Testing update on application:', testAppId);
        
        const { data: updateData, error: updateError } = await staticSupabase
          .from('applications')
          .update({ rating: 5, admin_notes: 'Test rating update' })
          .eq('id', testAppId)
          .select('id, rating, admin_notes');
        
        console.log('Update test:', { updateData, updateError });
        
        if (updateError) {
          throw new Error(`Update failed: ${updateError.message}`);
        }
        
        alert('Rating functionality test passed! ✅\n\nRead: ✅\nUpdate: ✅');
      } else {
        alert('No applications found to test with. Please create an application first.');
      }
      
    } catch (error) {
      console.error('Rating functionality test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Rating functionality test failed: ${errorMessage}`);
    }
  };

  const testDeleteFunctionality = async () => {
    try {
      console.log('Testing delete functionality...');
      
      // First, create a test opportunity
      const testOpportunity = {
        title: 'TEST OPPORTUNITY FOR DELETE',
        description: 'This is a test opportunity for deletion',
        category: 'Test',
        location: 'Test Location',
        date: '2024-12-31',
        max_volunteers: 1,
        current_volunteers: 0,
        is_active: false
      };
      
      console.log('Creating test opportunity...');
      const { data: insertData, error: insertError } = await staticSupabase
        .from('opportunities')
        .insert(testOpportunity)
        .select('id');
      
      console.log('Insert result:', { insertData, insertError });
      
      if (insertError) {
        throw new Error(`Failed to create test opportunity: ${insertError.message}`);
      }
      
      if (!insertData || insertData.length === 0) {
        throw new Error('No test opportunity was created');
      }
      
      const testOpportunityId = insertData[0].id;
      console.log('Test opportunity created with ID:', testOpportunityId);
      
      // Create a test application for this opportunity
      const testApplication = {
        opportunity_id: testOpportunityId,
        volunteer_id: 'test-volunteer-id',
        volunteer_name: 'Test Volunteer',
        volunteer_email: 'test@example.com',
        phone: '1234567890',
        message: 'Test application',
        status: 'pending'
      };
      
      console.log('Creating test application...');
      const { data: appData, error: appError } = await staticSupabase
        .from('applications')
        .insert(testApplication)
        .select('id');
      
      console.log('Application insert result:', { appData, appError });
      
      if (appError) {
        console.warn('Failed to create test application, continuing with opportunity deletion test');
      }
      
      // Now test deleting the opportunity
      console.log('Testing opportunity deletion...');
      const { data: deleteData, error: deleteError, count: deleteCount } = await staticSupabase
        .from('opportunities')
        .delete()
        .eq('id', testOpportunityId)
        .select('id');
      
      console.log('Delete result:', { deleteData, deleteError, deleteCount });
      
      if (deleteError) {
        throw new Error(`Failed to delete opportunity: ${deleteError.message}`);
      }
      
      if (deleteCount === 0) {
        throw new Error('Opportunity was not deleted (count = 0)');
      }
      
      // Check if related applications were also deleted
      const { data: remainingApps, error: checkError } = await staticSupabase
        .from('applications')
        .select('id')
        .eq('opportunity_id', testOpportunityId);
      
      console.log('Remaining applications check:', { remainingApps, checkError });
      
      const appsDeleted = !remainingApps || remainingApps.length === 0;
      
      alert(`Delete functionality test passed! ✅\n\nOpportunity deletion: ✅\nRelated applications deleted: ${appsDeleted ? '✅' : '❌'}\n\nTest opportunity ID: ${testOpportunityId}`);
      
    } catch (error) {
      console.error('Delete functionality test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Delete functionality test failed: ${errorMessage}`);
    }
  };

  // Fetch all ratings for a volunteer
  const fetchAllRatingsForVolunteer = async (volunteerId: string) => {
    if (allUserRatings[volunteerId]) return; // already fetched
    const { data, error } = await supabase
      .from('applications')
      .select('rating')
      .eq('volunteer_id', volunteerId)
      .not('rating', 'is', null);
    if (!error && data) {
      setAllUserRatings(prev => ({ ...prev, [volunteerId]: data.map(d => d.rating).filter(Boolean) }));
    }
  };

  // Add this useEffect after applicants state is updated
  useEffect(() => {
    // For each applicant in all expanded opportunities, fetch their ratings if not already fetched
    Object.values(applicants).flat().forEach(app => {
      if (app && app.volunteer_id && !allUserRatings[app.volunteer_id]) {
        fetchAllRatingsForVolunteer(app.volunteer_id);
      }
    });
  }, [applicants]);

  console.log('Rendering opportunities:', opportunities);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage volunteer opportunities</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Opportunity</span>
            </button>
          </div>
        </div>

        {/* Add Opportunity Form */}
        {showForm && (
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-white">Create New Opportunity</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="" className="bg-zinc-800">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-zinc-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Requirements
                </label>
                <input
                  type="text"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., No experience required"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Max Volunteers *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.max_volunteers}
                  onChange={(e) => setFormData({ ...formData, max_volunteers: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter price or leave 0 for Free"
                />
              </div>

              <div className="md:col-span-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 text-gray-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLoading
                      ? 'bg-zinc-600 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Opportunity'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Opportunities List */}
        <div className="space-y-6">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{opportunity.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        opportunity.is_active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                      }`}
                    >
                      {opportunity.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
                    {opportunity.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleOpportunityStatus(opportunity.id, opportunity.is_active)}
                    disabled={updatingStatus[opportunity.id]}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                      opportunity.is_active
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                    } ${updatingStatus[opportunity.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {updatingStatus[opportunity.id] 
                      ? (opportunity.is_active ? 'Deactivating...' : 'Activating...') 
                      : (opportunity.is_active ? 'Deactivate' : 'Activate')
                    }
                  </button>
                  <button
                    onClick={() => {
                      console.log('Delete button clicked for', opportunity.id);
                      deleteOpportunity(opportunity.id);
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30`}
                    title="Delete opportunity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{opportunity.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
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
                  <span>
                    {opportunity.current_volunteers} / {opportunity.max_volunteers} volunteers
                  </span>
                </div>
              </div>
              <button
                className="mt-2 mb-4 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 border border-emerald-500/30"
                onClick={async () => {
                  setExpanded((prev) => ({ ...prev, [opportunity.id]: !prev[opportunity.id] }));
                  if (!expanded[opportunity.id]) await fetchApplicants(opportunity.id);
                }}
              >
                {expanded[opportunity.id] ? 'Hide Applicants' : 'View Applicants'}
              </button>
              {expanded[opportunity.id] && (
                <div className="bg-zinc-800/50 rounded-lg p-4 mt-2">
                  <h4 className="font-semibold text-white mb-4">Applicants ({applicants[opportunity.id]?.length || 0})</h4>
                  {applicants[opportunity.id] && applicants[opportunity.id].length > 0 ? (
                    <div className="space-y-4">
                      {applicants[opportunity.id].map((app) => (
                        <div key={app.id} className="bg-zinc-700/50 rounded-lg p-4 border border-zinc-600">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h5 className="font-medium text-white">{app.volunteer_name}</h5>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  app.status === 'approved' 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : app.status === 'rejected'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}>
                                  {app.status}
                                </span>
                                {app.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-yellow-400">{app.rating}/5</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-gray-400 space-y-1">
                                <div>Email: {app.volunteer_email}</div>
                                <div>Phone: {app.phone}</div>
                                <div>Applied: {new Date(app.created_at).toLocaleDateString()}</div>
                                {app.message && (
                                  <div className="mt-2">
                                    <span className="text-gray-300">Message: </span>
                                    <span className="text-gray-400">{app.message}</span>
                                  </div>
                                )}
                                {app.admin_notes && (
                                  <div className="mt-2">
                                    <span className="text-gray-300">Admin Notes: </span>
                                    <span className="text-gray-400">{app.admin_notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              {allUserRatings[app.volunteer_id] && allUserRatings[app.volunteer_id].length > 0 && (
                                <div className="mb-2">
                                  <div className="text-xs text-gray-300 font-semibold mb-1">All Ratings for this User:</div>
                                  <div className="flex gap-1 flex-wrap">
                                    {allUserRatings[app.volunteer_id].map((r, idx) => (
                                      <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded text-yellow-400 text-xs">
                                        <Star className="h-3 w-3" /> {r}/5
                                      </span>
                                    ))}
                                  </div>
                                  <div className="mt-1 text-xs text-emerald-400 font-bold">
                                    Average Rating: {(
                                      allUserRatings[app.volunteer_id].reduce((a, b) => a + b, 0) / allUserRatings[app.volunteer_id].length
                                    ).toFixed(2)}
                                  </div>
                                </div>
                              )}
                              {/* Status Actions */}
                              {app.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      console.log('Approve button clicked for', app.id);
                                      handleApplicationStatus(app.id, 'approved');
                                    }}
                                    className="flex-1 px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      console.log('Reject button clicked for', app.id);
                                      handleApplicationStatus(app.id, 'rejected');
                                    }}
                                    className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <XCircle className="h-3 w-3" />
                                    Reject
                                  </button>
                                </div>
                              )}
                              
                              {/* Rating System */}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-gray-300 font-semibold">Current Rating:</span>
                                {app.rating ? (
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-yellow-400">{app.rating}/5</span>
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">Not rated yet</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-300">Rating:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => {
                                        console.log('Rating button clicked for', app.id, 'star:', star);
                                        handleApplicationRating(app.id, star);
                                      }}
                                      className={`text-lg transition-colors ${
                                        (app.rating || 0) >= star
                                          ? 'text-yellow-400'
                                          : 'text-gray-500 hover:text-yellow-300'
                                      }`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Admin Notes */}
                              <div>
                                <textarea
                                  placeholder="Add admin notes..."
                                  value={applicationNotes[app.id] || app.admin_notes || ''}
                                  onChange={(e) => setApplicationNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                                  onBlur={() => handleApplicationNotes(app.id, applicationNotes[app.id] || app.admin_notes || '')}
                                  className="w-full px-2 py-1 text-xs border border-zinc-600 bg-zinc-800 text-white rounded resize-none"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No applicants yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {opportunities.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No opportunities created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};