import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Search, Filter } from 'lucide-react';
import { OpportunityCard } from '../components/OpportunityCard';
import { ApplicationModal } from '../components/ApplicationModal';
import { HeroSection } from '../components/ui/hero-section-3';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { supabase, Database } from '../lib/supabase';
import { SupabaseTest } from '../components/SupabaseTest';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export const Home: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userApplications, setUserApplications] = useState<string[]>([]);

  const categories = ['Community Service', 'Education', 'Environment', 'Healthcare', 'Animal Care', 'Senior Care'];

  useEffect(() => {
    fetchOpportunities();
    if (isSignedIn && user) {
      fetchUserApplications();
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities, searchTerm, selectedCategory]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('opportunity_id')
        .eq('volunteer_id', user.id);

      if (error) throw error;
      setUserApplications(data?.map(app => app.opportunity_id) || []);
    } catch (error) {
      console.error('Error fetching user applications:', error);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    if (searchTerm) {
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((opp) => opp.category === selectedCategory);
    }

    setFilteredOpportunities(filtered);
  };

  const handleApply = (opportunity: Opportunity) => {
    // Check if user has already applied
    if (userApplications.includes(opportunity.id)) {
      alert('You have already applied for this opportunity!');
      return;
    }
    
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    fetchOpportunities();
    fetchUserApplications();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading opportunities..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Modern Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 bg-black text-white">
        {/* Temporary Supabase Test - Remove after debugging */}
        <div className="mb-8">
          <SupabaseTest />
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-700 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Filter className="h-5 w-5 absolute left-3 top-3 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-zinc-700 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onApply={handleApply}
                isSignedIn={isSignedIn || false}
                hasApplied={userApplications.includes(opportunity.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No opportunities found matching your criteria.</p>
          </div>
        )}
      </div>

      <ApplicationModal
        opportunity={selectedOpportunity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleApplicationSuccess}
        isSignedIn={isSignedIn || false}
      />
    </div>
  );
};