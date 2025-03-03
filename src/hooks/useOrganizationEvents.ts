
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, NONPROFIT_NAME_MAP } from './event-types';
import { checkCauseAreaColumn, calculateAverageRating, transformEventData } from './event-utils';

// Helper function to fetch events by organization ID
export const useOrganizationEvents = (organizationId: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizationEvents = async () => {
      if (!organizationId) {
        setEvents([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Check if cause_area column exists
        const hasCauseArea = await checkCauseAreaColumn();
        
        // Fetch events for this nonprofit based on schema
        let eventsData: any[] = [];
        
        if (hasCauseArea) {
          const { data, error } = await supabase
            .from('events')
            .select('id, title, description, date, location, image_url, cause_area')
            .eq('nonprofit_id', organizationId)
            .order('date', { ascending: false });
            
          if (error) {
            console.error("Error fetching organization events with cause_area:", error);
            setEvents([]);
            setIsLoading(false);
            return;
          }
          
          eventsData = data || [];
        } else {
          const { data, error } = await supabase
            .from('events')
            .select('id, title, description, date, location, image_url')
            .eq('nonprofit_id', organizationId)
            .order('date', { ascending: false });
            
          if (error) {
            console.error("Error fetching organization events without cause_area:", error);
            setEvents([]);
            setIsLoading(false);
            return;
          }
          
          eventsData = data || [];
        }

        if (!eventsData || eventsData.length === 0) {
          setEvents([]);
          setIsLoading(false);
          return;
        }

        // Get reviews for rating calculation
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('nonprofit_id, rating')
          .eq('nonprofit_id', organizationId);

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        }

        // Calculate average rating
        const rating = calculateAverageRating(reviewsData);
        const organizationName = NONPROFIT_NAME_MAP[organizationId] || 'Unknown Organization';

        // Transform events data
        const transformedEvents = eventsData.map(event => {
          // Get cause area if available, otherwise use default
          const causeArea = hasCauseArea && event.cause_area ? event.cause_area : 'General';

          return transformEventData(event, organizationId, causeArea, rating);
        });

        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error processing organization events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationEvents();
  }, [organizationId]);

  return { events, isLoading };
};
