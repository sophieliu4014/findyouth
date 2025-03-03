import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from './event-types';
import { checkCauseAreaColumn, calculateAverageRating, transformEventData } from './event-utils';

export const useEventData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Check if cause_area column exists using the updated function
        const hasCauseArea = await checkCauseAreaColumn();
        
        // Fetch events with appropriate columns based on schema
        let eventsData: any[] = [];
        
        if (hasCauseArea) {
          // If cause_area exists, include it in the query
          const { data, error } = await supabase
            .from('events')
            .select('id, title, description, date, location, image_url, nonprofit_id, cause_area');
            
          if (error) {
            console.error("Error fetching events with cause_area:", error);
            setEvents([]);
            setIsLoading(false);
            return;
          }
          
          eventsData = data || [];
        } else {
          // Otherwise query without cause_area
          const { data, error } = await supabase
            .from('events')
            .select('id, title, description, date, location, image_url, nonprofit_id');
            
          if (error) {
            console.error("Error fetching events without cause_area:", error);
            setEvents([]);
            setIsLoading(false);
            return;
          }
          
          eventsData = data || [];
        }

        if (!eventsData || eventsData.length === 0) {
          console.log("No events found");
          setEvents([]);
          setIsLoading(false);
          return;
        }

        // Get reviews for rating calculation (if available)
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
          const nonprofitId = event.nonprofit_id;
          
          // Get cause area if available, otherwise use default
          const causeArea = hasCauseArea && event.cause_area ? event.cause_area : 'General';
          
          // Calculate rating
          let rating = 4; // Default rating
          if (ratings && nonprofitId && ratings[nonprofitId]) {
            rating = Math.round(ratings[nonprofitId].sum / ratings[nonprofitId].count);
          }

          return transformEventData(event, nonprofitId, causeArea, rating);
        });

        // Extract unique organizations
        const orgNames = [...new Set(transformedEvents.map(event => event.organization))];

        setEvents(transformedEvents);
        setOrganizations(orgNames);
      } catch (error) {
        console.error("Error processing events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, organizations, isLoading };
};
