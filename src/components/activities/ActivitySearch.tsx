
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import CitySelector from './CitySelector';
import FilterBar from '@/components/form/FilterBar';
import { EventFilters } from '@/utils/eventFilters';
import useEventData from '@/hooks/useEventData';

interface ActivitySearchProps {
  onSearch: (filters: EventFilters) => void;
}

const ActivitySearch = ({ onSearch }: ActivitySearchProps) => {
  const [city, setCity] = useState<string>('');
  const [cause, setCause] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const { data } = useEventData();
  const events = data || [];
  const uniqueOrganizations = [...new Set(events.map(event => event.organization))];
  
  const handleCityChange = (city: string) => {
    setCity(city);
    applyFilters(city, cause, organization);
  };

  const handleCauseChange = (cause: string) => {
    setCause(cause);
    applyFilters(city, cause, organization);
  };

  const handleOrganizationChange = (organization: string) => {
    setOrganization(organization);
    applyFilters(city, cause, organization);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    applyFilters(city, cause, organization, e.target.value);
  };

  const applyFilters = (
    location: string,
    cause: string,
    organization: string,
    searchKeyword?: string
  ) => {
    onSearch({
      location,
      cause,
      organization,
      searchKeyword: searchKeyword || searchTerm
    });
  };

  return (
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
        
        <CitySelector onCityChange={handleCityChange} />
        
        <FilterBar 
          onCauseChange={handleCauseChange}
          onOrganizationChange={handleOrganizationChange}
          organizations={uniqueOrganizations}
        />
      </div>
    </Card>
  );
};

export default ActivitySearch;
