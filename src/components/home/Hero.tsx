
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
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/c8a5f090-6366-46c8-aa61-36e33745e1cd.png" 
          alt="Youth volunteers working together" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white text-center">
        <h1 className="text-5xl md:text-6xl font-work-sans mb-6">
          Helping Youth to
          <span className="block mt-2 font-bold relative">
            Find Youth
            <span className="absolute -bottom-2 left-0 right-0 h-2 bg-youth-blue/80 rounded-full"></span>
          </span>
        </h1>
        
        <p className="text-xl font-comfortaa max-w-3xl mx-auto mb-10">
          FindYouth strives to connect youth all across Greater Vancouver, encouraging their leadership pursuits and helping them to become more involved in their communities.
        </p>
        
        <div className="max-w-2xl mx-auto mb-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search by keyword"
              className="w-full px-6 py-4 rounded-lg text-youth-charcoal bg-white/95 shadow-lg focus:ring-2 focus:ring-youth-blue/50 focus:outline-none transition-all"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-youth-blue text-white px-4 py-2 rounded-lg hover:bg-youth-purple transition-all duration-300"
            >
              <span className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search
              </span>
            </button>
          </form>
        </div>
        
        {/* City Buttons */}
        <div className="max-w-2xl mx-auto mb-10">
          <p className="text-white/90 mb-3">Or explore by city</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Vancouver', 'Burnaby', 'Richmond'].map((city) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-2 rounded-full transition-all duration-300 border border-white/20"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/contact" className="btn-primary py-3 px-10 hover:scale-105 transition-transform duration-300">
            CONTACT US
          </Link>
          <Link to="/find-volunteers" className="btn-primary bg-youth-blue py-3 px-10 hover:scale-105 transition-transform duration-300">
            HAVE A NONPROFIT?
          </Link>
        </div>
        
        <div className="mt-16 text-xs uppercase tracking-widest text-white/70">
          PHOTOGRAPH: BOYS & GIRLS CLUBS OF AMERICA, DECEMBER 12, 2022
        </div>
      </div>
    </section>
  );
};

export default Hero;
