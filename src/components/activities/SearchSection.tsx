
import { useState } from 'react';
import { Search } from 'lucide-react';
import LocationSearch from '../form/LocationSearch';

interface SearchSectionProps {
  keyword: string;
  address: string;
  onKeywordSearch: (query: string) => void;
  onLocationSearch: (query: string) => void;
}

const SearchSection = ({ 
  keyword, 
  address, 
  onKeywordSearch, 
  onLocationSearch 
}: SearchSectionProps) => {
  return (
    <div className="mb-12 text-center">
      <div className="bg-gradient-youth py-16 px-4 rounded-3xl mb-10 shadow-elevated">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in tracking-tight">
          Find Volunteer Activities
        </h1>
        <p className="text-white/90 max-w-3xl mx-auto mb-10 animate-fade-in leading-relaxed">
          Discover meaningful volunteer opportunities with youth-led nonprofits across Greater Vancouver
        </p>
        
        {/* Search section */}
        <div className="max-w-2xl mx-auto animate-slide-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for activities, causes, organizations, or locations"
              className="w-full px-6 py-4 rounded-full text-youth-charcoal bg-white/95 shadow-lg focus:ring-2 focus:ring-youth-blue/50 focus:outline-none transition-all"
              value={keyword}
              onChange={(e) => onKeywordSearch(e.target.value)}
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-youth-blue text-white p-3 rounded-full hover:bg-youth-purple transition-all duration-300 shadow-sm hover:shadow"
              onClick={() => onKeywordSearch(keyword)}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
