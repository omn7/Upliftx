import React from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import { Database } from '../lib/supabase';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApply: (opportunity: Opportunity) => void;
  isSignedIn: boolean;
  hasApplied: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onApply,
  isSignedIn,
  hasApplied,
}) => {
  const isFull = opportunity.current_volunteers >= opportunity.max_volunteers;
  const progressPercentage = (opportunity.current_volunteers / opportunity.max_volunteers) * 100;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-[1.02] p-3 sm:p-6">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
              {opportunity.title}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
              {opportunity.description}
            </p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{new Date(opportunity.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Clock className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{opportunity.requirements}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Users className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{opportunity.max_volunteers} volunteers needed</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {opportunity.category}
          </span>
          
          <button
            onClick={() => onApply(opportunity)}
            disabled={!isSignedIn || hasApplied}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
              hasApplied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                : isSignedIn
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasApplied ? (
              <span className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Applied</span>
              </span>
            ) : isSignedIn ? (
              'Apply Now'
            ) : (
              'Sign in to Apply'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};