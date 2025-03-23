
import { MapPin } from 'lucide-react';

interface CitySelectorProps {
  selectedCity?: string;
  onCitySelect: (city: string) => void;
  cities: string[];
  onCityChange?: (city: string) => void; // Added compatibility with existing code
}

const CitySelector = ({ selectedCity = '', onCitySelect, onCityChange, cities }: CitySelectorProps) => {
  // Handle both callback patterns
  const handleCityClick = (city: string) => {
    onCitySelect(city);
    if (onCityChange) {
      onCityChange(city);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-8 animate-slide-up">
      <h3 className="flex items-center text-lg font-medium text-youth-charcoal mb-3">
        <MapPin className="h-5 w-5 mr-2 text-youth-blue" />
        Popular Locations
      </h3>
      <div className="flex flex-wrap gap-3">
        {cities.length > 0 ? (
          cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className={`px-5 py-2 rounded-full transition-all duration-300 
                ${selectedCity === city 
                  ? 'bg-youth-blue text-white shadow-md' 
                  : 'bg-white text-youth-charcoal hover:bg-youth-blue/10 border border-youth-blue/20'}`}
            >
              {city}
            </button>
          ))
        ) : (
          <p className="text-youth-charcoal/60 italic">No locations available</p>
        )}
      </div>
    </div>
  );
};

export default CitySelector;
