
import { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import CauseFilter from './filters/CauseFilter';
import LocationFilter from './filters/LocationFilter';
import OrganizationFilter from './filters/OrganizationFilter';
import ActiveFilters from './filters/ActiveFilters';
import FilterActions from './filters/FilterActions';
import { causeAreas, locations } from './filters/FilterConstants';

interface FilterBarProps {
  onFilterChange?: (filters: {
    cause: string;
    location: string;
    organization: string;
  }) => void;
  onCauseChange?: (cause: string) => void;
  onOrganizationChange?: (organization: string) => void;
  onLocationChange?: (location: string) => void;
  organizations?: string[];
  initialFilters?: {
    cause: string;
    location: string;
    organization: string;
  };
}

const FilterBar = ({ 
  onFilterChange, 
  onCauseChange,
  onOrganizationChange,
  onLocationChange,
  organizations = [],
  initialFilters 
}: FilterBarProps) => {
  const [cause, setCause] = useState(initialFilters?.cause ? initialFilters.cause : "All Causes");
  const [location, setLocation] = useState(initialFilters?.location ? initialFilters.location : "All Locations");
  const [organization, setOrganization] = useState(initialFilters?.organization ? initialFilters.organization : "All Organizations");
  const [isOpen, setIsOpen] = useState(false);

  // Apply filters whenever initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setCause(initialFilters.cause || "All Causes");
      setLocation(initialFilters.location || "All Locations");
      setOrganization(initialFilters.organization || "All Organizations");
    }
  }, [initialFilters]);

  // Handle cause change
  const handleCauseChange = (newCause: string) => {
    setCause(newCause);
    if (onCauseChange) {
      onCauseChange(newCause === "All Causes" ? "" : newCause);
    }
  };

  // Handle location change
  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    if (onLocationChange) {
      onLocationChange(newLocation === "All Locations" ? "" : newLocation);
    }
  };

  // Handle organization change
  const handleOrganizationChange = (newOrg: string) => {
    setOrganization(newOrg);
    if (onOrganizationChange) {
      onOrganizationChange(newOrg === "All Organizations" ? "" : newOrg);
    }
  };

  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        cause: cause === "All Causes" ? "" : cause,
        location: location === "All Locations" ? "" : location,
        organization: organization === "All Organizations" ? "" : organization
      });
    }
    setIsOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setCause("All Causes");
    setLocation("All Locations");
    setOrganization("All Organizations");
    
    if (onFilterChange) {
      onFilterChange({ cause: "", location: "", organization: "" });
    }
    
    if (onCauseChange) {
      onCauseChange("");
    }
    
    if (onLocationChange) {
      onLocationChange("");
    }
    
    if (onOrganizationChange) {
      onOrganizationChange("");
    }
  };

  // Count active filters
  const activeFilterCount = [
    cause !== "All Causes" ? 1 : 0,
    location !== "All Locations" ? 1 : 0,
    organization !== "All Organizations" ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="mb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full glass-panel p-4 rounded-xl hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-youth-purple mr-2" />
          <span className="font-medium text-youth-charcoal">
            {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filter Opportunities"}
          </span>
        </div>
        <ChevronDown className={`h-5 w-5 text-youth-charcoal/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="glass-panel mt-2 p-6 rounded-xl animate-fade-in shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cause Area Filter */}
            <CauseFilter 
              cause={cause} 
              onCauseChange={handleCauseChange} 
              causeAreas={causeAreas} 
            />
            
            {/* Location Filter */}
            <LocationFilter 
              location={location} 
              onLocationChange={handleLocationChange} 
              locations={locations} 
            />
            
            {/* Organizations Filter */}
            <OrganizationFilter 
              organization={organization} 
              onOrganizationChange={handleOrganizationChange} 
              organizations={organizations} 
            />
          </div>
          
          {/* Active filters */}
          <ActiveFilters 
            activeFilters={{ cause, location, organization }}
            onCauseReset={() => handleCauseChange("All Causes")}
            onLocationReset={() => handleLocationChange("All Locations")}
            onOrganizationReset={() => handleOrganizationChange("All Organizations")}
          />
          
          {/* Action buttons */}
          <FilterActions 
            onReset={resetFilters}
            onApply={applyFilters}
          />
        </div>
      )}
    </div>
  );
};

export default FilterBar;
