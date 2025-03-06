
import { MapPin, ChevronDown } from 'lucide-react';

interface LocationFilterProps {
  location: string;
  onLocationChange: (location: string) => void;
  locations: string[];
}

const LocationFilter = ({ location, onLocationChange, locations }: LocationFilterProps) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-youth-charcoal/80 mb-1">
        <MapPin className="h-4 w-4 mr-2" />
        Location
      </label>
      <div className="relative">
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
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
  );
};

export default LocationFilter;
