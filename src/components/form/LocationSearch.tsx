
import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface LocationSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const LocationSearch = ({ onSearch, placeholder = "Enter your address" }: LocationSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          className="input-field pl-10 pr-10"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-youth-charcoal/50" />
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-youth-charcoal/50 hover:text-youth-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-youth-blue text-white p-1 rounded-md hover:bg-opacity-90 transition-all"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default LocationSearch;
