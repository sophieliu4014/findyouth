
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import CitySelector from './CitySelector';
import FilterBar from '@/components/form/FilterBar';
import { EventFilters } from '@/utils/eventFilters';
import { useEventData } from '@/hooks'; // Updated import to use the hooks index
import ResultsList from './ResultsList';

// Define available cities
const cities = [
  "Vancouver",
  "Burnaby",
  "Richmond",
  "Surrey",
  "North Vancouver",
  "West Vancouver",
  "Coquitlam"
];

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
  const [city, setCity] = useState<string>(initialLocation || '');
  const [cause, setCause] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(initialKeyword || '');
  const [filters, setFilters] = useState<EventFilters>({
    cause: '',
    location: city,
    organization: '',
    searchKeyword: searchTerm
  });

  // Initialize with any provided initial values
  useEffect(() => {
    if (initialLocation || initialKeyword) {
      setFilters({
        cause,
        location: initialLocation || '',
        organization,
        searchKeyword: initialKeyword || ''
      });
    }
  }, [initialLocation, initialKeyword, cause, organization]);

  const { data: eventsData, isLoading } = useEventData(filters);
  const events = eventsData || [];
  
  // Extract unique organizations from events after they're loaded
  const uniqueOrganizations = [...new Set(events.map(event => event.organization))];
  
  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setFilters({
      ...filters,
      location: selectedCity
    });
  };

  const handleCauseChange = (selectedCause: string) => {
    setCause(selectedCause);
    setFilters({
      ...filters,
      cause: selectedCause
    });
  };

  const handleLocationChange = (selectedLocation: string) => {
    setCity(selectedLocation);
    setFilters({
      ...filters,
      location: selectedLocation
    });
  };

  const handleOrganizationChange = (selectedOrg: string) => {
    setOrganization(selectedOrg);
    setFilters({
      ...filters,
      organization: selectedOrg
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({
      ...filters,
      searchKeyword: value
    });
  };

  console.log("Current filters:", filters);
  console.log("Events loaded:", events.length);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-youth-charcoal mb-6 text-center">
        Find Volunteer Opportunities
      </h1>
      
      <Card className="shadow-md p-4 mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Activities
            </label>
            <input
              type="text"
              id="search"
              className="w-full p-2 border rounded-md"
              placeholder="Search for activities..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <CitySelector 
            selectedCity={city}
            onCitySelect={handleCitySelect}
            cities={cities}
          />
          
          <FilterBar 
            onCauseChange={handleCauseChange}
            onLocationChange={handleLocationChange}
            onOrganizationChange={handleOrganizationChange}
            organizations={uniqueOrganizations}
          />
        </div>
      </Card>
      
      <ResultsList events={events} isLoading={isLoading} />
    </div>
  );
};

export default ActivitySearch;
