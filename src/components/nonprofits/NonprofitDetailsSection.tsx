
import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { calculateAverageRating } from '@/hooks/utils/rating-utils';
import RatingSystem from './RatingSystem';

interface NonprofitDetailsSectionProps {
  nonprofit: {
    id: string;
    organization_name: string;
    description: string;
    mission: string;
    location: string;
    profile_image_url: string | null;
    website: string | null;
    social_media: string;
    causes: string[];
    rating: number;
    email?: string | null;
    phone?: string | null;
  };
}

const NonprofitDetailsSection = ({ nonprofit }: NonprofitDetailsSectionProps) => {
  const [averageRating, setAverageRating] = useState<number>(nonprofit.rating);
  const [ratingCount, setRatingCount] = useState<number>(0);

  // Fetch the latest ratings when the component mounts
  useEffect(() => {
    const fetchRatings = async () => {
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('nonprofit_id', nonprofit.id);
      
      if (error) {
        console.error('Error fetching ratings:', error);
        return;
      }
      
      if (reviewsData && reviewsData.length > 0) {
        const newAvgRating = calculateAverageRating(reviewsData);
        setAverageRating(newAvgRating);
        setRatingCount(reviewsData.length);
      }
    };
    
    fetchRatings();
  }, [nonprofit.id]);

  // Update average rating when a user submits a new rating
  const handleRatingChange = async (newRating: number) => {
    console.log('Rating changed to:', newRating);
    
    // Fetch the updated reviews to calculate the new average
    const { data: reviewsData, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('nonprofit_id', nonprofit.id);
    
    if (error) {
      console.error('Error fetching updated ratings:', error);
      return;
    }
    
    if (reviewsData && reviewsData.length > 0) {
      // Calculate new average from fresh data
      const newAvgRating = calculateAverageRating(reviewsData);
      console.log('New average rating calculated:', newAvgRating, 'from', reviewsData.length, 'ratings');
      
      // Update state
      setAverageRating(newAvgRating);
      setRatingCount(reviewsData.length);
    }
  };

  return (
    <div className="glass-panel mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Image */}
        <div className="md:w-1/4">
          <div className="w-32 h-32 md:w-full md:h-64 bg-gray-100 rounded-lg overflow-hidden">
            {nonprofit.profile_image_url ? (
              <img 
                src={nonprofit.profile_image_url} 
                alt={nonprofit.organization_name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-youth-blue/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-youth-blue">
                  {nonprofit.organization_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="mt-4 space-y-2">
            {nonprofit.email && (
              <a 
                href={`mailto:${nonprofit.email}`}
                className="flex items-center text-youth-blue hover:text-youth-purple transition-colors text-sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                {nonprofit.email}
              </a>
            )}
            
            {nonprofit.phone && (
              <a 
                href={`tel:${nonprofit.phone}`}
                className="flex items-center text-youth-blue hover:text-youth-purple transition-colors text-sm"
              >
                <Phone className="h-4 w-4 mr-2" />
                {nonprofit.phone}
              </a>
            )}
            
            {nonprofit.website && (
              <a 
                href={nonprofit.website} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-youth-blue hover:text-youth-purple transition-colors text-sm"
              >
                <Globe className="h-4 w-4 mr-2" />
                Website
              </a>
            )}
          </div>
        </div>

        {/* Nonprofit Details */}
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold text-youth-charcoal mb-2">
            {nonprofit.organization_name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <RatingSystem 
                nonprofitId={nonprofit.id} 
                initialRating={averageRating} 
                displayOnly={true}
                size="md"
              />
              <span className="ml-2 text-sm text-gray-500">
                ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
            
            <div className="ml-4 flex items-center">
              <RatingSystem 
                nonprofitId={nonprofit.id}
                onRatingChange={handleRatingChange}
                size="md"
              />
            </div>
          </div>
            
          {nonprofit.location && (
            <div className="flex items-center mb-4 text-youth-charcoal/70">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{nonprofit.location}</span>
            </div>
          )}

          {nonprofit.causes && nonprofit.causes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-youth-charcoal mb-2">Cause Areas</h3>
              <div className="flex flex-wrap gap-2">
                {nonprofit.causes.map(cause => (
                  <Link 
                    key={cause} 
                    to={`/cause/${encodeURIComponent(cause)}`}
                    className="bg-youth-blue/10 text-youth-blue py-1 px-3 rounded-full text-sm hover:bg-youth-blue/20 transition-colors"
                  >
                    {cause}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {nonprofit.description && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-youth-charcoal mb-2">Description</h3>
              <p className="text-youth-charcoal/80">{nonprofit.description}</p>
            </div>
          )}

          {nonprofit.mission && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-youth-charcoal mb-2">Mission</h3>
              <p className="text-youth-charcoal/80">{nonprofit.mission}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {nonprofit.website && (
              <a 
                href={nonprofit.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-youth-blue hover:text-youth-purple"
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                Website
              </a>
            )}
            {nonprofit.social_media && (
              <a 
                href={nonprofit.social_media} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-youth-blue hover:text-youth-purple"
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                Social Media
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonprofitDetailsSection;
