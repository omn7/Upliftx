import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase, Database } from '../lib/supabase';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

interface ApplicationModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isSignedIn: boolean;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onSuccess,
  isSignedIn,
}) => {
  const user = useUser();
  const [formData, setFormData] = useState({
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity || !user) {
      console.error('Missing opportunity or user:', { opportunity, user });
      alert('Missing opportunity or user data. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Debug: Log user data
      console.log('User data:', {
        id: user.user?.id,
        fullName: user.user?.fullName,
        username: user.user?.username,
        email: user.user?.emailAddresses?.[0]?.emailAddress
      });

      // Check if user already applied
      const { data: existingApplication, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('opportunity_id', opportunity.id)
        .eq('volunteer_id', user.user?.id || '')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing application:', checkError);
        throw checkError;
      }

      if (existingApplication) {
        alert('You have already applied for this opportunity!');
        setIsSubmitting(false);
        return;
      }

      // Prepare application data
      const applicationData = {
        opportunity_id: opportunity.id,
        volunteer_id: user.user?.id || '',
        volunteer_name: user.user?.fullName || user.user?.username || user.user?.emailAddresses?.[0]?.emailAddress || 'Unknown',
        volunteer_email: user.user?.emailAddresses?.[0]?.emailAddress || '',
        phone: formData.phone,
        message: formData.message,
      };

      console.log('Submitting application data:', applicationData);

      // Submit application
      const { error: insertError } = await supabase.from('applications').insert(applicationData);

      if (insertError) {
        console.error('Error inserting application:', insertError);
        throw insertError;
      }

      console.log('Application submitted successfully');

      // Update opportunity volunteer count
      const { error: updateError } = await supabase
        .from('opportunities')
        .update({ current_volunteers: opportunity.current_volunteers + 1 })
        .eq('id', opportunity.id);

      if (updateError) {
        console.error('Error updating opportunity:', updateError);
        throw updateError;
      }

      console.log('Opportunity updated successfully');

      onSuccess();
      onClose();
      setFormData({ phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900/90 backdrop-blur-xl rounded-xl p-6 w-full max-w-md mx-4 border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Apply for {opportunity.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isSignedIn ? (
          <div className="text-center text-gray-400 py-8">Please sign in to apply for this opportunity.</div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Debug section - remove after testing */}
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Debug Info:</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>User ID: {user.user?.id || 'Not available'}</div>
              <div>Full Name: {user.user?.fullName || 'Not available'}</div>
              <div>Username: {user.user?.username || 'Not available'}</div>
              <div>Email: {user.user?.emailAddresses?.[0]?.emailAddress || 'Not available'}</div>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-gray-400 font-medium">Price: </span>
            <span className="text-white font-semibold">
              {opportunity?.price ? `₹${opportunity.price}` : 'Free'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Why do you want to volunteer for this opportunity?
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Tell us about your motivation and relevant experience..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-zinc-600 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};