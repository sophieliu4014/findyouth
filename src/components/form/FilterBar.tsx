
import { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

// Define the available cause areas
const causeAreas = [
  "All Causes",
  "Advocacy & Human Rights",
  "Education",
  "Sports",
  "Health",
  "Arts & Culture",
  "Environment",
  "Homeless",
  "Animals",
  "Youth",
  "Seniors",
  "Religion"
];

// Define the available locations
const locations = [
  "All Locations",
  "Vancouver",
  "Burnaby",
  "Richmond",
  "Surrey",
  "North Vancouver",
  "West Vancouver",
  "Coquitlam"
];

interface FilterBarProps {
  onFilterChange: (filters: {
    cause: string;
    location: string;
    organization: string;
  }) => void;
  organizations?: string[];
  initialFilters?: {
    cause: string;
    location: string;
    organization: string;
  };
}

const FilterBar = ({ 
  onFilterChange, 
  organizations = [],
  initialFilters 
}: FilterBarProps) => {
  const [cause, setCause] = useState(initialFilters?.cause ? initialFilters.cause : "All Causes");
  const [location, setLocation] = useState(initialFilters?.location ? initialFilters.location : "All Locations");
  const [organization, setOrganization] = useState(initialFilters?.organization ? initialFilters.organization : "All Organizations");

  // Apply filters whenever initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setCause(initialFilters.cause || "All Causes");
      setLocation(initialFilters.location || "All Locations");
      setOrganization(initialFilters.organization || "All Organizations");
    }
  }, [initialFilters]);

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      cause: cause === "All Causes" ? "" : cause,
      location: location === "All Locations" ? "" : location,
      organization: organization === "All Organizations" ? "" : organization
    });
  };

  // Reset filters
  const resetFilters = () => {
    setCause("All Causes");
    setLocation("All Locations");
    setOrganization("All Organizations");
    onFilterChange({ cause: "", location: "", organization: "" });
  };

  return (
    <div className="glass-panel p-4 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-youth-purple mr-2" />
        <h3 className="text-lg font-medium text-youth-charcoal">Filter Opportunities</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cause Area Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-youth-charcoal/70 mb-1">
            Cause Area
          </label>
          <div className="relative">
            <select
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              className="input-field appearance-none pr-10"
            >
              {causeAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-youth-charcoal/50 pointer-events-none" />
          </div>
        </div>
        
        {/* Location Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-youth-charcoal/70 mb-1">
            Location
          </label>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field appearance-none pr-10"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-youth-charcoal/50 pointer-events-none" />
          </div>
        </div>
        
        {/* Organizations Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-youth-charcoal/70 mb-1">
            Organization
          </label>
          <div className="relative">
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="input-field appearance-none pr-10"
            >
              <option value="All Organizations">All Organizations</option>
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-youth-charcoal/50 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-3">
        <button
          onClick={resetFilters}
          className="btn-secondary py-2"
        >
          Reset
        </button>
        
        <button
          onClick={applyFilters}
          className="btn-primary py-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
