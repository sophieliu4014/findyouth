
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export interface SearchSectionProps {
  initialKeyword?: string;
  initialAddress?: string;
  onSearch: (keyword: string, location: string, address: string) => void;
}

const SearchSection = ({ 
  initialKeyword = '', 
  initialAddress = '',
  onSearch
}: SearchSectionProps) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState(initialAddress);

  // Update form values when props change
  useEffect(() => {
    setKeyword(initialKeyword || '');
    setAddress(initialAddress || '');
  }, [initialKeyword, initialAddress]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, location, address);
  };

  return (
    <div className="glass-panel p-6 rounded-xl">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="keyword" className="block text-sm font-medium text-youth-charcoal mb-1">
            Keyword
          </label>
          <input
            id="keyword"
            type="text"
            placeholder="Search by title, description, or organization"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-youth-blue/50"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="location" className="block text-sm font-medium text-youth-charcoal mb-1">
            City
          </label>
          <input
            id="location"
            type="text"
            placeholder="Enter city (e.g. Vancouver)"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-youth-blue/50"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="address" className="block text-sm font-medium text-youth-charcoal mb-1">
            Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Enter specific address"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-youth-blue/50"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <div className="self-end">
          <button
            type="submit"
            className="h-[42px] px-6 py-2 bg-youth-blue text-white rounded-md hover:bg-youth-blue/90 transition-colors flex items-center"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;
