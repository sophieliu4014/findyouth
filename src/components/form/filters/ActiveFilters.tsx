
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  activeFilters: {
    cause: string;
    location: string;
    organization: string;
  };
  onCauseReset: () => void;
  onLocationReset: () => void;
  onOrganizationReset: () => void;
}

const ActiveFilters = ({ 
  activeFilters, 
  onCauseReset, 
  onLocationReset, 
  onOrganizationReset 
}: ActiveFiltersProps) => {
  // Count active filters
  const activeFilterCount = [
    activeFilters.cause !== "All Causes" ? 1 : 0,
    activeFilters.location !== "All Locations" ? 1 : 0,
    activeFilters.organization !== "All Organizations" ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  if (activeFilterCount === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-youth-charcoal/70">Active filters:</span>
        {activeFilters.cause !== "All Causes" && (
          <span className="inline-flex items-center bg-youth-purple/10 text-youth-purple text-sm px-3 py-1 rounded-full">
            {activeFilters.cause}
            <X 
              className="h-3.5 w-3.5 ml-1 cursor-pointer" 
              onClick={onCauseReset}
            />
          </span>
        )}
        {activeFilters.location !== "All Locations" && (
          <span className="inline-flex items-center bg-youth-blue/10 text-youth-blue text-sm px-3 py-1 rounded-full">
            {activeFilters.location}
            <X 
              className="h-3.5 w-3.5 ml-1 cursor-pointer" 
              onClick={onLocationReset}
            />
          </span>
        )}
        {activeFilters.organization !== "All Organizations" && (
          <span className="inline-flex items-center bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
            {activeFilters.organization}
            <X 
              className="h-3.5 w-3.5 ml-1 cursor-pointer" 
              onClick={onOrganizationReset}
            />
          </span>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
