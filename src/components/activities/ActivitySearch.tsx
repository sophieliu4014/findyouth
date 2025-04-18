import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import CitySelector from './CitySelector';
import FilterBar from '@/components/form/FilterBar';
import { EventFilters } from '@/utils/eventFilters';
import { useEventData } from '@/hooks';
import ResultsList from './ResultsList';

const fallbackCities = [
  "Vancouver",
  "Burnaby",
  "Richmond",
  "Surrey",
  "North Vancouver",
  "Coquitlam"
];

interface ActivitySearchProps {
  initialAddress?: string;
  initialKeyword?: string;
  initialLocation?: string;
  initialCause?: string;
}

const ActivitySearch = ({ 
  initialAddress = '', 
  initialKeyword = '', 
  initialLocation = '',
  initialCause = ''
}: ActivitySearchProps) => {
  const [city, setCity] = useState<string>(initialLocation || '');
  const [cause, setCause] = useState<string>(initialCause || '');
  const [organization, setOrganization] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(initialKeyword || '');
  const [filters, setFilters] = useState<EventFilters>({
    cause: '',
    location: city,
    organization: '',
    searchKeyword: searchTerm
  });

  useEffect(() => {
    setFilters({
      cause: initialCause || '',
      location: initialLocation || '',
      organization: '',
      searchKeyword: initialKeyword || ''
    });
    
    if (initialCause) setCause(initialCause);
    if (initialLocation) setCity(initialLocation);
    if (initialKeyword) setSearchTerm(initialKeyword);
  }, [initialLocation, initialKeyword, initialCause]);

  const { data: allEventsData, isLoading: isLoadingAllEvents } = useEventData({
    cause: filters.cause,
    location: '', // No location filter
    organization: filters.organization,
    searchKeyword: filters.searchKeyword
  }, true); // Include past events
  
  const { data: eventsData, isLoading } = useEventData(filters, true); // Include past events
  const events = eventsData || [];

  const popularCities = useMemo(() => {
    if (!allEventsData || allEventsData.length === 0) {
      return fallbackCities;
    }

    const cityCounts: Record<string, number> = {};
    allEventsData.forEach(event => {
      const locationParts = event.location?.split(',') || [];
      
      if (locationParts.length > 1) {
        const possibleCity = locationParts[1]?.trim();
        if (possibleCity && possibleCity.length > 0) {
          cityCounts[possibleCity] = (cityCounts[possibleCity] || 0) + 1;
        }
      } else if (locationParts.length === 1) {
        const city = locationParts[0]?.trim();
        if (city && city.length > 0) {
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        }
      }
    });

    const sortedCities = Object.keys(cityCounts)
      .sort((a, b) => cityCounts[b] - cityCounts[a])
      .slice(0, 6);

    return sortedCities.length > 0 ? sortedCities : fallbackCities;
  }, [allEventsData]);

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
  console.log("Popular cities:", popularCities);

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
              placeholder="Search for activities, locations, causes..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <CitySelector 
            selectedCity={city}
            onCitySelect={handleCitySelect}
            cities={popularCities}
          />
          
          <FilterBar 
            onCauseChange={handleCauseChange}
            onLocationChange={handleLocationChange}
            onOrganizationChange={handleOrganizationChange}
            organizations={uniqueOrganizations}
            initialFilters={{
              cause,
              location: city,
              organization
            }}
          />
        </div>
      </Card>
      
      <ResultsList events={events} isLoading={isLoading} />
    </div>
  );
};

export default ActivitySearch;
