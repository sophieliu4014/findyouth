
import { useState, useEffect } from 'react';
import { Users, ChevronDown } from 'lucide-react';

interface CauseFilterProps {
  cause: string;
  onCauseChange: (cause: string) => void;
  causeAreas: string[];
}

const CauseFilter = ({ cause, onCauseChange, causeAreas }: CauseFilterProps) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-youth-charcoal/80 mb-2">
        <Users className="h-4 w-4 mr-2 text-youth-purple" />
        Cause Area
      </label>
      <div className="relative">
        <select
          value={cause}
          onChange={(e) => onCauseChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-youth-purple focus:ring-1 focus:ring-youth-purple/30 focus:outline-none appearance-none transition-all bg-white"
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
  );
};

export default CauseFilter;
