
import { Calendar, ChevronDown } from 'lucide-react';

interface OrganizationFilterProps {
  organization: string;
  onOrganizationChange: (organization: string) => void;
  organizations: string[];
}

const OrganizationFilter = ({ 
  organization, 
  onOrganizationChange, 
  organizations 
}: OrganizationFilterProps) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-youth-charcoal/80 mb-2">
        <Calendar className="h-4 w-4 mr-2 text-youth-blue" />
        Organization
      </label>
      <div className="relative">
        <select
          value={organization}
          onChange={(e) => onOrganizationChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-youth-purple focus:ring-1 focus:ring-youth-purple/30 focus:outline-none appearance-none transition-all bg-white"
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
  );
};

export default OrganizationFilter;
