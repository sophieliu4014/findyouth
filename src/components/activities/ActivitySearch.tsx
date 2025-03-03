
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SearchSection from './SearchSection';
import CitySelector from './CitySelector';
import FilterBar from '../form/FilterBar';
import ResultsList from './ResultsList';

// Define the event type
interface Event {
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

interface ActivitySearchProps {
  initialAddress?: string;
  initialKeyword?: string;
  initialLocation?: string;
}

const cities = ['Vancouver', 'Burnaby', 'Richmond'];

const ActivitySearch = ({ 
  initialAddress = '', 
  initialKeyword = '',
  initialLocation = ''
}: ActivitySearchProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    cause: '',
    location: initialLocation,
    organization: ''
  });

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
        setFilteredEvents(transformedEvents);
        setOrganizations(orgNames);
      } catch (error) {
        console.error("Error processing events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply initial filters
  useEffect(() => {
    if (initialLocation) {
      const newFilters = { ...filters, location: initialLocation };
      setFilters(newFilters);
      applyFilters(newFilters, initialKeyword, events);
    }
  }, [initialLocation, initialKeyword, events]);

  // Apply all filters
  const applyFilters = (currentFilters: typeof filters, searchKeyword: string, eventsList: Event[]) => {
    let results = [...eventsList];
    
    // Apply keyword search
    if (searchKeyword) {
      const lowerKeyword = searchKeyword.toLowerCase();
      results = results.filter(event => 
        event.title.toLowerCase().includes(lowerKeyword) || 
        event.organization.toLowerCase().includes(lowerKeyword) ||
        event.causeArea.toLowerCase().includes(lowerKeyword)
      );
    }
    
    // Apply category filters
    if (currentFilters.cause) {
      results = results.filter(event => event.causeArea === currentFilters.cause);
    }
    
    if (currentFilters.location) {
      results = results.filter(event => event.location === currentFilters.location);
    }
    
    if (currentFilters.organization) {
      results = results.filter(event => event.organization === currentFilters.organization);
    }
    
    setFilteredEvents(results);
  };

  // Handle search by address
  const handleLocationSearch = (query: string) => {
    setAddress(query);
    // In a real app, we would use this address to fetch events near the location
  };

  // Handle keyword search
  const handleKeywordSearch = (query: string) => {
    setKeyword(query);
    applyFilters(filters, query, events);
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    const newFilters = { ...filters, location: city };
    setFilters(newFilters);
    applyFilters(newFilters, keyword, events);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    applyFilters(newFilters, keyword, events);
  };

  return (
    <>
      <SearchSection 
        keyword={keyword}
        address={address}
        onKeywordSearch={handleKeywordSearch}
        onLocationSearch={handleLocationSearch}
      />
      
      <CitySelector 
        selectedCity={filters.location}
        onCitySelect={handleCitySelect}
        cities={cities}
      />
      
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <FilterBar 
          onFilterChange={handleFilterChange}
          organizations={organizations}
          initialFilters={filters}
        />
      </div>
      
      <ResultsList events={filteredEvents} isLoading={isLoading} />
    </>
  );
};

export default ActivitySearch;
