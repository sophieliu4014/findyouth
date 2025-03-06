
import { useState, useEffect } from 'react';
import { Filter, ChevronDown, X, Calendar, MapPin, Users } from 'lucide-react';

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
  onFilterChange?: (filters: {
    cause: string;
    location: string;
    organization: string;
  }) => void;
  onCauseChange?: (cause: string) => void;
  onOrganizationChange?: (organization: string) => void;
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
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-youth-charcoal/80 mb-1">
                <Users className="h-4 w-4 mr-2" />
                Cause Area
              </label>
              <div className="relative">
                <select
                  value={cause}
                  onChange={(e) => handleCauseChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-youth-purple focus:ring-1 focus:ring-youth-purple/30 focus:outline-none appearance-none transition-all"
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
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-youth-charcoal/80 mb-1">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-youth-purple focus:ring-1 focus:ring-youth-purple/30 focus:outline-none appearance-none transition-all"
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
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-youth-charcoal/80 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                Organization
              </label>
              <div className="relative">
                <select
                  value={organization}
                  onChange={(e) => handleOrganizationChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-youth-purple focus:ring-1 focus:ring-youth-purple/30 focus:outline-none appearance-none transition-all"
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
          
          {/* Active filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-youth-charcoal/70">Active filters:</span>
                {cause !== "All Causes" && (
                  <span className="inline-flex items-center bg-youth-purple/10 text-youth-purple text-sm px-3 py-1 rounded-full">
                    {cause}
                    <X 
                      className="h-3.5 w-3.5 ml-1 cursor-pointer" 
                      onClick={() => handleCauseChange("All Causes")}
                    />
                  </span>
                )}
                {location !== "All Locations" && (
                  <span className="inline-flex items-center bg-youth-blue/10 text-youth-blue text-sm px-3 py-1 rounded-full">
                    {location}
                    <X 
                      className="h-3.5 w-3.5 ml-1 cursor-pointer" 
                      onClick={() => setLocation("All Locations")}
                    />
                  </span>
                )}
                {organization !== "All Organizations" && (
                  <span className="inline-flex items-center bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
                    {organization}
                    <X 
                      className="h-3.5 w-3.5 ml-1 cursor-pointer" 
                      onClick={() => handleOrganizationChange("All Organizations")}
                    />
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-200 text-youth-charcoal/80 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-youth-blue text-white rounded-lg hover:bg-youth-blue/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
