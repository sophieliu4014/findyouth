
import React, { useEffect } from 'react';
import CauseSelector from './CauseSelector';
import LocationSearch from './LocationSearch';

type FilterBarProps = {
  onCauseChange: (cause: string) => void;
  onLocationChange: (location: string) => void;
  onOrganizationChange: (organization: string) => void;
  organizations: string[];
  initialCause?: string;
};

const FilterBar = ({ 
  onCauseChange, 
  onLocationChange, 
  onOrganizationChange, 
  organizations,
  initialCause = ''
}: FilterBarProps) => {
  useEffect(() => {
    if (initialCause) {
      onCauseChange(initialCause);
    }
  }, [initialCause, onCauseChange]);
  
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <CauseSelector onSelect={onCauseChange} initialValue={initialCause} />
      </div>
      <div className="flex-1 min-w-[200px]">
        <LocationSearch onLocationChange={onLocationChange} />
      </div>
      <div className="flex-1 min-w-[200px]">
        <select 
          className="w-full p-2 border rounded-md"
          onChange={(e) => onOrganizationChange(e.target.value)}
          defaultValue=""
        >
          <option value="">All Organizations</option>
          {organizations.map((org, index) => (
            <option key={index} value={org}>{org}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
