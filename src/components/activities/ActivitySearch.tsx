
import { useState, useEffect } from 'react';
import SearchSection from './SearchSection';
import CitySelector from './CitySelector';
import FilterBar from '../form/FilterBar';
import ResultsList from './ResultsList';
import { useEventData } from '@/hooks/useEventData';
import { filterEvents, EventFilters } from '@/utils/eventFilters';

const cities = ['Vancouver', 'Burnaby', 'Richmond'];

interface ActivitySearchProps {
  initialAddress?: string;
  initialKeyword?: string;
  initialLocation?: string;
}

const ActivitySearch = ({ 
  initialAddress = '', 
  initialKeyword = '',
  initialLocation = ''
}: ActivitySearchProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [keyword, setKeyword] = useState(initialKeyword);
  const { events, organizations, isLoading } = useEventData();
  const [filteredEvents, setFilteredEvents] = useState<ReturnType<typeof useEventData>['events']>([]);
  const [filters, setFilters] = useState<EventFilters>({
    cause: '',
    location: initialLocation,
    organization: ''
  });

  // Apply initial filters
  useEffect(() => {
    if (events.length > 0) {
      setFilteredEvents(events);
      
      if (initialLocation || initialKeyword) {
        const initialFilters = { ...filters };
        if (initialLocation) {
          initialFilters.location = initialLocation;
        }
        setFilteredEvents(filterEvents(events, initialFilters, initialKeyword));
      }
    }
  }, [events, initialLocation, initialKeyword]);

  // Handle search by address
  const handleLocationSearch = (query: string) => {
    setAddress(query);
    // In a real app, we would use this address to fetch events near the location
  };

  // Handle keyword search
  const handleKeywordSearch = (query: string) => {
    setKeyword(query);
    setFilteredEvents(filterEvents(events, filters, query));
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    const newFilters = { ...filters, location: city };
    setFilters(newFilters);
    setFilteredEvents(filterEvents(events, newFilters, keyword));
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
    setFilteredEvents(filterEvents(events, newFilters, keyword));
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
