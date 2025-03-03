
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
    <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
      <p className="text-youth-charcoal/80 mb-3">Or explore by city</p>
      <div className="flex flex-wrap justify-center gap-3">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
            className={`px-8 py-2 rounded-full transition-all duration-300 border 
              ${selectedCity === city 
                ? 'bg-youth-blue text-white border-youth-blue' 
                : 'bg-white/90 text-youth-charcoal hover:bg-youth-blue/10 border-youth-blue/20'}`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CitySelector;
