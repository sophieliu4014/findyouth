
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      // In a real app, we would use the address to search
      navigate('/find-activities', { state: { address } });
    }
  };

  return (
    <section className="hero-section min-h-[85vh] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-youth-charcoal">
            Helping Youth to
            <span className="block mt-2 text-youth-purple relative">
              Find Youth
              <span className="absolute -bottom-2 left-0 right-0 h-2 bg-youth-blue/30 rounded-full"></span>
            </span>
          </h1>
          <p className="text-xl text-youth-charcoal/80 max-w-3xl mx-auto mb-8 animate-slide-up">
            FindYouth strives to connect youth all across Greater Vancouver, encouraging their leadership pursuits and helping them to become more involved in their communities.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <button className="btn-primary px-8 py-3 text-lg">
              Vancouver
            </button>
            <button className="btn-primary px-8 py-3 text-lg">
              Burnaby
            </button>
            <button className="btn-primary px-8 py-3 text-lg">
              Richmond
            </button>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your address to find volunteer opportunities near you"
                className="input-field pr-24 text-lg"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-youth-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
              >
                <span className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Find Activities
                </span>
              </button>
            </div>
          </form>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* These would link to appropriate sections */}
          <div className="glass-panel p-6 group hover:shadow-lg transition-all animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-200">
              <img 
                src="/lovable-uploads/fc516796-2f02-4769-83bc-7e3007b87a32.png" 
                alt="Find Opportunities" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-youth-charcoal group-hover:text-youth-purple transition-colors">Find Opportunities</h2>
            <p className="text-youth-charcoal/80">Discover volunteer activities with local youth-led nonprofits making a difference in your community.</p>
          </div>
          
          <div className="glass-panel p-6 group hover:shadow-lg transition-all animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-200">
              <img 
                src="/lovable-uploads/1feaea8a-91ab-40d9-864a-58fdf70ee0d3.png" 
                alt="Find Volunteers" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-youth-charcoal group-hover:text-youth-purple transition-colors">Find Volunteers</h2>
            <p className="text-youth-charcoal/80">Nonprofit organizations can connect with enthusiastic youth volunteers to support your cause.</p>
          </div>
          
          <div className="glass-panel p-6 group hover:shadow-lg transition-all animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-200">
              <img 
                src="/lovable-uploads/b3af0034-f246-4b58-ad55-b7c991055414.png" 
                alt="Discover NGOs" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-youth-charcoal group-hover:text-youth-purple transition-colors">Discover NGOs</h2>
            <p className="text-youth-charcoal/80">Explore youth-led nonprofits making an impact and build connections for collaboration and shared resources.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
