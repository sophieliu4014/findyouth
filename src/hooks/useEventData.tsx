
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the event type
export interface Event {
  id: string;
  title: string;
  organization: string;
  date: string;
  location: string;
  causeArea: string;
  rating: number;
  imageUrl?: string;
  profileImage?: string;
}

export const useEventData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            date,
            location,
            image_url,
            nonprofits(
              id,
              organization_name,
              profile_image_url,
              nonprofit_causes(
                causes(name)
              )
            )
          `);

        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          return;
        }

        // Get reviews for rating calculation
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('nonprofit_id, rating');

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        }

        // Calculate average ratings by nonprofit
        const ratings = reviewsData ? reviewsData.reduce((acc: Record<string, { sum: number, count: number }>, review) => {
          if (!acc[review.nonprofit_id]) {
            acc[review.nonprofit_id] = { sum: 0, count: 0 };
          }
          acc[review.nonprofit_id].sum += review.rating;
          acc[review.nonprofit_id].count += 1;
          return acc;
        }, {}) : {};

        // Transform events data
        const transformedEvents = eventsData.map(event => {
          const nonprofit = event.nonprofits;
          const causes = nonprofit?.nonprofit_causes?.map(nc => nc.causes.name) || [];
          const nonprofitId = nonprofit?.id;
          
          // Calculate rating
          let rating = 0;
          if (ratings && nonprofitId && ratings[nonprofitId]) {
            rating = Math.round(ratings[nonprofitId].sum / ratings[nonprofitId].count);
          }

          // Format date
          const eventDate = new Date(event.date);
          const formattedDate = eventDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });

          return {
            id: event.id,
            title: event.title,
            organization: nonprofit?.organization_name || 'Unknown Organization',
            date: formattedDate,
            location: event.location,
            causeArea: causes.length > 0 ? causes[0] : 'General',
            rating: rating || 4, // Default to 4 if no ratings
            imageUrl: event.image_url,
            profileImage: nonprofit?.profile_image_url
          };
        });

        // Extract unique organizations
        const orgNames = [...new Set(transformedEvents.map(event => event.organization))];

        setEvents(transformedEvents);
        setOrganizations(orgNames);
      } catch (error) {
        console.error("Error processing events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, organizations, isLoading };
};
