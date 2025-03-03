
import { useState } from 'react';
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
    <div className="mb-10 text-center">
      <h1 className="text-4xl font-bold text-youth-charcoal mb-4 animate-fade-in">
        Find Volunteer Activities
      </h1>
      <p className="text-youth-charcoal/80 max-w-3xl mx-auto mb-8 animate-fade-in">
        Discover meaningful volunteer opportunities with youth-led nonprofits across Greater Vancouver
      </p>
      
      {/* Search section */}
      <div className="mb-4 animate-slide-up">
        <LocationSearch 
          onSearch={onKeywordSearch}
          placeholder="Search for activities, organizations, or causes"
          initialValue={keyword}
        />
      </div>
    </div>
  );
};

export default SearchSection;
