
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
      // Use IP as identifier for non-logged in users
      const userIdentifier = await getAnonymousIdentifier();
      
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('nonprofit_id', nonprofitId)
        .eq('anonymous_id', userIdentifier)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user rating:', error);
        return;
      }
      
      if (data) {
        setUserRating(data.rating);
      }
    };
    
    if (!displayOnly) {
      getUserRating();
    }
  }, [nonprofitId, displayOnly]);
  
  // Get a unique identifier for anonymous users (using browser fingerprint/local storage)
  const getAnonymousIdentifier = async (): Promise<string> => {
    // First check if we already have an ID stored
    let anonymousId = localStorage.getItem('anonymous_user_id');
    
    if (!anonymousId) {
      // Create a new random ID and store it
      anonymousId = crypto.randomUUID();
      localStorage.setItem('anonymous_user_id', anonymousId);
    }
    
    return anonymousId;
  };
  
  const handleRatingClick = async (selectedRating: number) => {
    if (displayOnly || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const anonymousId = await getAnonymousIdentifier();
      
      // Check if user has already rated
      const { data: existingRating } = await supabase
        .from('reviews')
        .select('id, rating')
        .eq('nonprofit_id', nonprofitId)
        .eq('anonymous_id', anonymousId)
        .maybeSingle();
      
      let result;
      
      if (existingRating) {
        // Update existing rating
        result = await supabase
          .from('reviews')
          .update({ rating: selectedRating })
          .eq('id', existingRating.id)
          .select()
          .single();
          
        toast({
          title: "Rating updated",
          description: `You've updated your rating to ${selectedRating} stars.`,
        });
      } else {
        // Insert new rating
        result = await supabase
          .from('reviews')
          .insert([{ 
            nonprofit_id: nonprofitId, 
            rating: selectedRating,
            anonymous_id: anonymousId
          }])
          .select()
          .single();
          
        toast({
          title: "Rating submitted",
          description: `You've rated this nonprofit ${selectedRating} stars.`,
        });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Update UI state
      setRating(selectedRating);
      setUserRating(selectedRating);
      
      // Notify parent component
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
  
  // Render stars for rating
  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isFilled = displayOnly 
        ? starValue <= rating 
        : userRating 
          ? starValue <= userRating 
          : false;
      
      // Handle hover state only for interactive mode
      const isHovered = !displayOnly && hoveredRating !== null && starValue <= hoveredRating;
      
      return (
        <Star
          key={i}
          className={`${sizeClasses[size]} cursor-${displayOnly ? 'default' : 'pointer'} transition-colors ${
            isFilled || isHovered
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => !displayOnly && setHoveredRating(starValue)}
          onMouseLeave={() => !displayOnly && setHoveredRating(null)}
          onClick={() => handleRatingClick(starValue)}
        />
      );
    });
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {renderStars()}
      </div>
      {!displayOnly && (
        <span className="ml-2 text-sm text-gray-500">
          {userRating ? 'Your rating' : 'Rate this nonprofit'}
        </span>
      )}
    </div>
  );
};

export default RatingSystem;
