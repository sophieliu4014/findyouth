import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the event type
export interface Event {
  id: string;
  title: string;
  organization: string;
  organizationId: string;
  date: string;
  location: string;
  causeArea: string;
  rating: number;
  imageUrl?: string;
  profileImage?: string;
}

// Map for hardcoded nonprofit names (for development only)
const NONPROFIT_NAME_MAP: Record<string, string> = {
  '550e8400-e29b-41d4-a716-446655440000': 'Vancouver Youth Coalition',
  '550e8400-e29b-41d4-a716-446655440001': 'Burnaby Environmental Network',
  '550e8400-e29b-41d4-a716-446655440002': 'Richmond Youth Arts Collective',
  '550e8400-e29b-41d4-a716-446655440003': 'Surrey Community Food Bank',
  '550e8400-e29b-41d4-a716-446655440004': 'North Shore Animal Rescue',
};

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
        let hasCauseArea = false;
        
        try {
          const { data, error } = await supabase
            .rpc('get_columns_for_table', { query_table_name: 'events' });
            
          if (error) {
            console.error("Error checking for columns:", error);
          } else if (data && Array.isArray(data)) {
            // Look for cause_area column in the returned data
            hasCauseArea = data.some((col: { column_name: string }) => 
              col.column_name === 'cause_area'
            );
            console.log("Column detection data:", data);
            console.log("Events table has cause_area column:", hasCauseArea);
          }
        } catch (err) {
          console.error("Error checking for cause_area column:", err);
        }
        
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
          const organizationName = NONPROFIT_NAME_MAP[nonprofitId] || 'Unknown Organization';
          
          // Get cause area if available, otherwise use default
          const causeArea = hasCauseArea && event.cause_area ? event.cause_area : 'General';
          
          // Calculate rating
          let rating = 4; // Default rating
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
            organization: organizationName,
            organizationId: nonprofitId,
            date: formattedDate,
            location: event.location,
            causeArea: causeArea,
            rating: rating || 4, // Default to 4 if no ratings
            imageUrl: event.image_url,
            profileImage: `https://images.unsplash.com/photo-${1550000000000 + parseInt(nonprofitId.slice(-4), 16) % 1000000}`
          };
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
        // Check if cause_area column exists using the updated function
        let hasCauseArea = false;
        
        try {
          const { data, error } = await supabase
            .rpc('get_columns_for_table', { query_table_name: 'events' });
            
          if (error) {
            console.error("Error checking for columns:", error);
          } else if (data && Array.isArray(data)) {
            // Look for cause_area column in the returned data
            hasCauseArea = data.some((col: { column_name: string }) => 
              col.column_name === 'cause_area'
            );
            console.log("Organization events - Has cause_area column:", hasCauseArea);
          }
        } catch (err) {
          console.error("Error checking for cause_area column:", err);
        }
        
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
        let rating = 4; // Default
        if (reviewsData && reviewsData.length > 0) {
          const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          rating = Math.round(sum / reviewsData.length);
        }

        const organizationName = NONPROFIT_NAME_MAP[organizationId] || 'Unknown Organization';

        // Transform events data
        const transformedEvents = eventsData.map(event => {
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

          // Get cause area if available, otherwise use default
          const causeArea = hasCauseArea && event.cause_area ? event.cause_area : 'General';

          return {
            id: event.id,
            title: event.title,
            organization: organizationName,
            organizationId: organizationId,
            date: formattedDate,
            location: event.location,
            causeArea: causeArea,
            rating: rating,
            imageUrl: event.image_url,
            profileImage: `https://images.unsplash.com/photo-${1550000000000 + parseInt(organizationId.slice(-4), 16) % 1000000}`
          };
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

// Helper function to fetch events by cause area
export const useCauseEvents = (causeArea: string) => {
  const { events: allEvents, isLoading } = useEventData();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!isLoading && causeArea) {
      const filtered = allEvents.filter(event => 
        event.causeArea.toLowerCase() === causeArea.toLowerCase()
      );
      setFilteredEvents(filtered);
    }
  }, [allEvents, causeArea, isLoading]);

  return { events: filteredEvents, isLoading };
};
