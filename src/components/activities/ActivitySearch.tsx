
import { useState } from 'react';
import SearchSection from './SearchSection';
import FilterBar from '../form/FilterBar';
import ResultsList from './ResultsList';
import useEventData from '@/hooks/useEventData';
import { EventFilters } from '@/hooks/types/event-types';

interface ActivitySearchProps {
  initialAddress?: string;
  initialKeyword?: string;
  initialLocation?: string;
}

export const ActivitySearch = ({ 
  initialAddress = '',
  initialKeyword = '',
  initialLocation = ''
}: ActivitySearchProps) => {
  // State for search and filters
  const [keyword, setKeyword] = useState(initialKeyword);
  const [address, setAddress] = useState(initialAddress);
  const [activeFilters, setActiveFilters] = useState<EventFilters>({
    cause: '',
    location: initialLocation,
    organization: '',
    searchKeyword: initialKeyword
  });
  
  // Unique key for the ResultsList - changing this forces a refetch
  const [refreshKey, setRefreshKey] = useState(0);

  // Get event data with filters
  const { data: events, isLoading } = useEventData(activeFilters);

  // Apply filters from the search bar
  const handleSearch = (keyword: string, location: string, address: string) => {
    console.log('Search params:', { keyword, location, address });
    setKeyword(keyword);
    setAddress(address);
    setActiveFilters(prev => ({
      ...prev,
      searchKeyword: keyword,
      location: location
    }));
  };

  // Handle filter changes (cause, organization, etc.)
  const handleFilterChange = (newFilters: EventFilters) => {
    console.log('Filters updated:', newFilters);
    setActiveFilters(newFilters);
  };

  // Force refresh the results list when an event is deleted
  const handleEventDeleted = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-youth-charcoal mb-8 text-center">
        Find Volunteer Opportunities
      </h1>
      
      <SearchSection 
        onSearch={handleSearch}
        initialKeyword={keyword}
        initialAddress={address}
      />
      
      <div className="my-8">
        <FilterBar 
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      {/* We use the key to force a refresh when an event is deleted */}
      <ResultsList 
        key={refreshKey}
        events={events || []} 
        isLoading={isLoading} 
        onEventDeleted={handleEventDeleted}
      />
    </div>
  );
};

export default ActivitySearch;
