
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import LocationSearch from '../components/form/LocationSearch';
import FilterBar from '../components/form/FilterBar';
import EventCard from '../components/EventCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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

const FindActivities = () => {
  const location = useLocation();
  const [address, setAddress] = useState('');
  const [keyword, setKeyword] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    cause: '',
    location: '',
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

  // Handle location search from hero section
  useEffect(() => {
    if (location.state) {
      if (location.state.address) {
        setAddress(location.state.address);
      }
      if (location.state.keyword) {
        setKeyword(location.state.keyword);
      }
      if (location.state.location) {
        const newFilters = { ...filters, location: location.state.location };
        setFilters(newFilters);
        applyFilters(newFilters, location.state.keyword || '', events);
      }
    }
  }, [location.state, events]);

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
  const handleSearch = (query: string) => {
    setAddress(query);
    // In a real app, we would use this address to fetch events near the location
  };

  // Handle keyword search
  const handleKeywordSearch = (query: string) => {
    setKeyword(query);
    applyFilters(filters, query, events);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    applyFilters(newFilters, keyword, events);
  };

  return (
    <>
      <Helmet>
        <title>Find Activities | FindYOUth</title>
        <meta name="description" content="Discover volunteer opportunities with youth-led nonprofits across Greater Vancouver." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-youth-charcoal mb-4 animate-fade-in">
            Find Volunteer Activities
          </h1>
          <p className="text-youth-charcoal/80 max-w-3xl mx-auto mb-8 animate-fade-in">
            Discover meaningful volunteer opportunities with youth-led nonprofits across Greater Vancouver
          </p>
          
          {/* Search section */}
          <div className="mb-4 animate-slide-up">
            <LocationSearch 
              onSearch={handleKeywordSearch}
              placeholder="Search for activities, organizations, or causes"
              initialValue={keyword}
            />
          </div>

          {/* Location search */}
          <div className="mb-8 animate-slide-up">
            <LocationSearch 
              onSearch={handleSearch}
              placeholder="Enter your address to find volunteer opportunities near you"
              initialValue={address}
            />
          </div>
          
          {/* City buttons */}
          <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
            <p className="text-youth-charcoal/80 mb-3">Or explore by city</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Vancouver', 'Burnaby', 'Richmond'].map((city) => (
                <button
                  key={city}
                  onClick={() => handleFilterChange({...filters, location: city})}
                  className={`px-8 py-2 rounded-full transition-all duration-300 border 
                    ${filters.location === city 
                      ? 'bg-youth-blue text-white border-youth-blue' 
                      : 'bg-white/90 text-youth-charcoal hover:bg-youth-blue/10 border-youth-blue/20'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filters */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <FilterBar 
              onFilterChange={handleFilterChange}
              organizations={organizations}
              initialFilters={filters}
            />
          </div>
        </div>
        
        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
            <span className="ml-2 text-youth-charcoal">Loading events...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className="animate-slide-up" 
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <EventCard {...event} />
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 glass-panel animate-fade-in">
                <h3 className="text-xl font-medium text-youth-charcoal mb-2">No events found</h3>
                <p className="text-youth-charcoal/70">
                  Try adjusting your filters or search criteria to find volunteer opportunities.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default FindActivities;
