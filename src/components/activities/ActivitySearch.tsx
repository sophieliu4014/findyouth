
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import CitySelector from './CitySelector';
import FilterBar from '@/components/form/FilterBar';
import { EventFilters } from '@/utils/eventFilters';
import { useEventData } from '@/hooks';
import ResultsList from './ResultsList';

// Fallback cities in case we can't determine popular ones
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
    cause: initialCause || '',
    location: city,
    organization: '',
    searchKeyword: searchTerm
  });

  // Initialize with any provided initial values
  useEffect(() => {
    if (initialLocation || initialKeyword || initialCause) {
      setFilters({
        cause: initialCause || '',
        location: initialLocation || '',
        organization,
        searchKeyword: initialKeyword || ''
      });
    }
  }, [initialLocation, initialKeyword, initialCause, organization]);

  // Fetch all events without location filter and include past events 
  // to determine popular cities based on all events
  const { data: allEventsData, isLoading: isLoadingAllEvents } = useEventData({
    cause: filters.cause,
    location: '', // No location filter to get all events
    organization: filters.organization,
    searchKeyword: filters.searchKeyword
  }, true); // Set to true to include past events for city determination
  
  // Fetch filtered events (with location filter applied) but exclude past events
  const { data: eventsData, isLoading } = useEventData(filters, false);
  const events = eventsData || [];
  
  // Calculate popular cities from event data
  const popularCities = useMemo(() => {
    if (!allEventsData || allEventsData.length === 0) {
      return fallbackCities;
    }

    // Count city frequencies
    const cityCounts: Record<string, number> = {};
    allEventsData.forEach(event => {
      // Extract city from location field
      // Assuming location might be in format like "123 Main St, Vancouver, BC"
      const locationParts = event.location?.split(',') || [];
      
      if (locationParts.length > 1) {
        // Try to get city from second part of location (usually City, State format)
        const possibleCity = locationParts[1]?.trim();
        if (possibleCity && possibleCity.length > 0) {
          cityCounts[possibleCity] = (cityCounts[possibleCity] || 0) + 1;
        }
      } else if (locationParts.length === 1) {
        // If only one part, assume it's the city
        const city = locationParts[0]?.trim();
        if (city && city.length > 0) {
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        }
      }
    });

    // Sort cities by frequency and take top 6
    const sortedCities = Object.keys(cityCounts)
      .sort((a, b) => cityCounts[b] - cityCounts[a])
      .slice(0, 6);

    return sortedCities.length > 0 ? sortedCities : fallbackCities;
  }, [allEventsData]);
  
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
            initialCause={initialCause}
          />
        </div>
      </Card>
      
      <ResultsList events={events} isLoading={isLoading} />
    </div>
  );
};

export default ActivitySearch;
