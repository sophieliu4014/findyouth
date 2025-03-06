
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Hero = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate('/find-activities', { state: { keyword } });
    }
  };

  const handleCityClick = (city: string) => {
    navigate('/find-activities', { state: { location: city } });
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center">
      {/* Background image with appropriate overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/c8a5f090-6366-46c8-aa61-36e33745e1cd.png" 
          alt="Youth volunteers working together" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-white text-center">
        <h1 className="text-5xl md:text-7xl font-work-sans mb-8 animate-fade-in drop-shadow-lg">
          <span className="block font-light">Empowering</span>
          <span className="block mt-2 font-bold text-[#7B99F4] drop-shadow-sm">
            Student Leaders
          </span>
          <span className="block mt-2 font-light">Connecting Volunteers</span>
        </h1>
        
        <p className="text-xl font-comfortaa max-w-3xl mx-auto mb-12 animate-fade-in animate-delay-100 drop-shadow-md">
          FindYouth strives to connect youth all across Greater Vancouver, encouraging their leadership pursuits and helping them to become more involved in their communities.
        </p>
        
        <div className="max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search volunteer opportunities by keyword"
              className="w-full px-6 py-4 rounded-full text-youth-charcoal bg-white/95 shadow-lg focus:ring-2 focus:ring-youth-blue/50 focus:outline-none transition-all"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-youth-blue text-white px-4 py-2 rounded-full hover:bg-youth-blue/90 transition-all duration-300"
            >
              <span className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search
              </span>
            </button>
          </form>
        </div>
        
        {/* City Buttons - semi-transparent with rounded style */}
        <div className="max-w-2xl mx-auto mb-12 animate-slide-up animate-delay-300">
          <p className="text-white mb-4">Or explore by city</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Vancouver', 'Burnaby', 'Richmond', 'Surrey'].map((city) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className="bg-white/50 hover:bg-youth-blue text-youth-charcoal hover:text-white px-8 py-2.5 rounded-full transition-all duration-300 border border-white/20 shadow-md hover:shadow-lg"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 animate-slide-up animate-delay-400">
          <Link to="/find-activities" className="w-full sm:w-auto bg-youth-blue hover:bg-youth-blue/90 text-white font-medium px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg">
            FIND OPPORTUNITIES
          </Link>
          <Link to="/register-ngo" className="w-full sm:w-auto bg-youth-purple hover:bg-youth-purple/90 text-white font-medium px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg border border-white/10">
            LIST YOUR NONPROFIT
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
