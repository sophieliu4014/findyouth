
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ensureAnonymousId } from '@/hooks/utils/rating-utils';

interface RatingSystemProps {
  nonprofitId: string;
  initialRating?: number;
  displayOnly?: boolean;
  onRatingChange?: (newRating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const RatingSystem = ({ 
  nonprofitId, 
  initialRating = 0, 
  displayOnly = false, 
  onRatingChange,
  size = 'md'
}: RatingSystemProps) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userReviewId, setUserReviewId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Size variants for stars
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  // Get user's previous rating if any
  useEffect(() => {
    const getUserRating = async () => {
      // Get stored anonymous ID
      const anonymousId = ensureAnonymousId();
      
      const { data, error } = await supabase
        .from('reviews')
        .select('id, rating')
        .eq('nonprofit_id', nonprofitId)
        .eq('anonymous_id', anonymousId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user rating:', error);
        return;
      }
      
      if (data) {
        console.log('Found existing rating:', data);
        setUserRating(data.rating);
        setUserReviewId(data.id);
      } else {
        console.log('No existing rating found for this nonprofit');
      }
    };
    
    if (!displayOnly) {
      getUserRating();
    }
  }, [nonprofitId, displayOnly]);
  
  const handleRatingClick = async (selectedRating: number) => {
    if (displayOnly || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const anonymousId = ensureAnonymousId();
      console.log('Using anonymous ID:', anonymousId);
      console.log('Current user review ID:', userReviewId);
      
      let result;
      
      if (userReviewId) {
        // Update existing rating
        console.log(`Updating existing rating to ${selectedRating} stars for review ID ${userReviewId}`);
        result = await supabase
          .from('reviews')
          .update({ 
            rating: selectedRating
          })
          .eq('id', userReviewId)
          .select()
          .maybeSingle();
          
        toast({
          title: "Rating updated",
          description: `You've updated your rating to ${selectedRating} stars.`,
        });
      } else {
        // Insert new rating
        console.log(`Creating new rating of ${selectedRating} stars`);
        result = await supabase
          .from('reviews')
          .insert([{ 
            nonprofit_id: nonprofitId, 
            rating: selectedRating,
            anonymous_id: anonymousId
          }])
          .select()
          .maybeSingle();
          
        toast({
          title: "Rating submitted",
          description: `You've rated this nonprofit ${selectedRating} stars.`,
        });
      }
      
      if (result.error) {
        console.error('Error with rating operation:', result.error);
        throw result.error;
      }
      
      // Log success for debugging
      console.log('Rating saved successfully:', result.data);
      
      // Update UI state
      setRating(selectedRating);
      setUserRating(selectedRating);
      
      // Store the review ID if this was a new review
      if (!userReviewId && result.data) {
        setUserReviewId(result.data.id);
      }
      
      // Notify parent component - pass the new rating to trigger immediate update
      if (onRatingChange) {
        onRatingChange(selectedRating);
      }
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Unable to submit your rating. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fixed rendering function that won't cause infinite type instantiation
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const starValue = i + 1;
      const isFilled = displayOnly 
        ? starValue <= rating 
        : userRating 
          ? starValue <= userRating 
          : false;
      
      const isHovered = !displayOnly && hoveredRating !== null && starValue <= hoveredRating;
      
      stars.push(
        <Star
          key={i}
          className={`${sizeClasses[size]} ${displayOnly ? 'cursor-default' : 'cursor-pointer'} transition-colors ${
            isFilled || isHovered
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => !displayOnly && setHoveredRating(starValue)}
          onMouseLeave={() => !displayOnly && setHoveredRating(null)}
          onClick={() => handleRatingClick(starValue)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {renderStars()}
      </div>
      {!displayOnly && (
        <span className="ml-2 text-sm text-gray-500">
          {userRating ? `Your rating: ${userRating} stars` : 'Rate this nonprofit'}
        </span>
      )}
    </div>
  );
};

export default RatingSystem;
