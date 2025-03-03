
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import LocationSearch from '../components/form/LocationSearch';
import FilterBar from '../components/form/FilterBar';
import EventCard from '../components/EventCard';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'Beach Cleanup at English Bay',
    organization: 'Ocean Savers Youth',
    date: 'July 15, 2023 • 9:00 AM - 1:00 PM',
    location: 'Vancouver',
    causeArea: 'Environment',
    rating: 4,
    imageUrl: '/lovable-uploads/24cda86f-6f97-487a-8935-3303afe5f74f.png',
    profileImage: '/lovable-uploads/479537ce-602b-4cae-b9c5-8dd2260e9189.png'
  },
  {
    id: '2',
    title: 'Seniors Tech Support Workshop',
    organization: 'Youth Tech Mentors',
    date: 'July 22, 2023 • 10:00 AM - 12:00 PM',
    location: 'Burnaby',
    causeArea: 'Education',
    rating: 5,
    imageUrl: '/lovable-uploads/c7f34d07-048b-4220-b62f-6209230a4c06.png',
    profileImage: '/lovable-uploads/d7e03b26-0f1a-4a34-a376-208821f596e8.png'
  },
  {
    id: '3',
    title: 'Youth Art Exhibition Setup',
    organization: 'Creative Future Collective',
    date: 'July 29, 2023 • 2:00 PM - 6:00 PM',
    location: 'Richmond',
    causeArea: 'Arts & Culture',
    rating: 4,
    imageUrl: '/lovable-uploads/b21be609-4cc0-4aac-85dc-0844f18cf1f5.png',
    profileImage: '/lovable-uploads/a2a4477e-dc8b-4d7e-b5d8-cd1b236aa182.png'
  }
];

// Mock organizations
const mockOrganizations = [
  'Ocean Savers Youth',
  'Youth Tech Mentors',
  'Creative Future Collective',
  'Parklands Conservancy Youth',
  'Student Food Network'
];

const FindActivities = () => {
  const location = useLocation();
  const [address, setAddress] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [filters, setFilters] = useState({
    cause: '',
    location: '',
    organization: ''
  });

  // Handle location search from hero section
  useEffect(() => {
    if (location.state) {
      if (location.state.address) {
        setAddress(location.state.address);
      }
      if (location.state.keyword) {
        setKeyword(location.state.keyword);
      }
      if (location.state.location) {
        const newFilters = { ...filters, location: location.state.location };
        setFilters(newFilters);
        applyFilters(newFilters, location.state.keyword || '');
      }
    }
  }, [location.state]);

  // Apply all filters
  const applyFilters = (currentFilters: typeof filters, searchKeyword: string) => {
    let results = [...mockEvents];
    
    // Apply keyword search
    if (searchKeyword) {
      const lowerKeyword = searchKeyword.toLowerCase();
      results = results.filter(event => 
        event.title.toLowerCase().includes(lowerKeyword) || 
        event.organization.toLowerCase().includes(lowerKeyword) ||
        event.causeArea.toLowerCase().includes(lowerKeyword)
      );
    }
    
    // Apply category filters
    if (currentFilters.cause) {
      results = results.filter(event => event.causeArea === currentFilters.cause);
    }
    
    if (currentFilters.location) {
      results = results.filter(event => event.location === currentFilters.location);
    }
    
    if (currentFilters.organization) {
      results = results.filter(event => event.organization === currentFilters.organization);
    }
    
    setFilteredEvents(results);
  };

  // Handle search by address
  const handleSearch = (query: string) => {
    setAddress(query);
    // In a real app, we would use this address to fetch events near the location
  };

  // Handle keyword search
  const handleKeywordSearch = (query: string) => {
    setKeyword(query);
    applyFilters(filters, query);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    applyFilters(newFilters, keyword);
  };

  return (
    <>
      <Helmet>
        <title>Find Activities | FindYOUth</title>
        <meta name="description" content="Discover volunteer opportunities with youth-led nonprofits across Greater Vancouver." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
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
              onSearch={handleKeywordSearch}
              placeholder="Search for activities, organizations, or causes"
              initialValue={keyword}
            />
          </div>

          {/* Location search */}
          <div className="mb-8 animate-slide-up">
            <LocationSearch 
              onSearch={handleSearch}
              placeholder="Enter your address to find volunteer opportunities near you"
              initialValue={address}
            />
          </div>
          
          {/* City buttons */}
          <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
            <p className="text-youth-charcoal/80 mb-3">Or explore by city</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Vancouver', 'Burnaby', 'Richmond'].map((city) => (
                <button
                  key={city}
                  onClick={() => handleFilterChange({...filters, location: city})}
                  className={`px-8 py-2 rounded-full transition-all duration-300 border 
                    ${filters.location === city 
                      ? 'bg-youth-blue text-white border-youth-blue' 
                      : 'bg-white/90 text-youth-charcoal hover:bg-youth-blue/10 border-youth-blue/20'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filters */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <FilterBar 
              onFilterChange={handleFilterChange}
              organizations={mockOrganizations}
              initialFilters={filters}
            />
          </div>
        </div>
        
        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <EventCard {...event} />
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 glass-panel animate-fade-in">
              <h3 className="text-xl font-medium text-youth-charcoal mb-2">No events found</h3>
              <p className="text-youth-charcoal/70">
                Try adjusting your filters or search criteria to find volunteer opportunities.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default FindActivities;
