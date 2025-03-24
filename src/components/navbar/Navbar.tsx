
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, PlusCircle, Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import UserMenu from '../auth/UserMenu';
import { useAuthStore } from '@/lib/auth';

const Navbar = () => {
  const [isVolunteersOpen, setIsVolunteersOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  
  // Track scroll to make navbar more opaque when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeDropdowns = () => {
    setIsVolunteersOpen(false);
    setIsAboutOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-youth-blue/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-youth-blue/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeDropdowns}>
              <Logo />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/find-activities" 
              className={`text-youth-charcoal hover:text-youth-purple transition-colors font-medium tracking-wide relative py-2 ${
                isActive('/find-activities') 
                  ? 'font-semibold text-youth-purple after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-youth-purple/70' 
                  : ''
              }`}
              onClick={closeDropdowns}
            >
              Find Activities
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/create-event" 
                className={`text-youth-charcoal hover:text-youth-purple transition-colors font-medium tracking-wide flex items-center relative py-2 ${
                  isActive('/create-event') 
                    ? 'font-semibold text-youth-purple after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-youth-purple/70' 
                    : ''
                }`}
                onClick={closeDropdowns}
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Create Post
              </Link>
            )}
            
            <div className="relative group">
              <button 
                className={`flex items-center text-youth-charcoal hover:text-youth-purple transition-colors font-medium tracking-wide py-2 ${
                  isActive('/register-ngo') 
                    ? 'font-semibold text-youth-purple' 
                    : ''
                }`}
                onClick={() => {
                  setIsVolunteersOpen(!isVolunteersOpen);
                  setIsAboutOpen(false);
                }}
              >
                Find Volunteers
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isVolunteersOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isVolunteersOpen && (
                <div className="dropdown-menu bg-white/95 backdrop-blur-sm rounded-xl shadow-elevated border-none">
                  <Link to="/register-ngo" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Register your NGO</Link>
                  <Link to="/website-guidelines" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Website Guidelines</Link>
                </div>
              )}
            </div>
            
            <div className="relative group">
              <button 
                className={`flex items-center text-youth-charcoal hover:text-youth-purple transition-colors font-medium tracking-wide py-2 ${
                  isActive('/about') || isActive('/instagram') || isActive('/contact') 
                    ? 'font-semibold text-youth-purple' 
                    : ''
                }`}
                onClick={() => {
                  setIsAboutOpen(!isAboutOpen);
                  setIsVolunteersOpen(false);
                }}
              >
                About Us
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAboutOpen && (
                <div className="dropdown-menu bg-white/95 backdrop-blur-sm rounded-xl shadow-elevated border-none">
                  <Link to="/our-story" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Our Story</Link>
                  <Link to="/our-instagram" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Our Instagram</Link>
                  <Link to="/contact" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Contact Us</Link>
                </div>
              )}
            </div>
            
            <UserMenu />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-youth-charcoal p-2 rounded-full hover:bg-youth-purple/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-md animate-slide-down">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link 
              to="/find-activities" 
              className={`block py-3 px-3 rounded-lg ${isActive('/find-activities') ? 'bg-youth-purple/10 text-youth-purple font-medium' : 'text-youth-charcoal'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Activities
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/create-event" 
                className={`flex items-center py-3 px-3 rounded-lg ${isActive('/create-event') ? 'bg-youth-purple/10 text-youth-purple font-medium' : 'text-youth-charcoal'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            )}
            
            <div className="py-1">
              <div className="py-2 px-3 text-youth-charcoal font-medium">Find Volunteers</div>
              <Link 
                to="/register-ngo" 
                className={`block py-2 px-8 ${isActive('/register-ngo') ? 'text-youth-purple font-medium' : 'text-youth-charcoal/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register your NGO
              </Link>
              <Link 
                to="/website-guidelines" 
                className={`block py-2 px-8 ${isActive('/website-guidelines') ? 'text-youth-purple font-medium' : 'text-youth-charcoal/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Website Guidelines
              </Link>
            </div>
            
            <div className="py-1">
              <div className="py-2 px-3 text-youth-charcoal font-medium">About Us</div>
              <Link 
                to="/our-story" 
                className={`block py-2 px-8 ${isActive('/our-story') ? 'text-youth-purple font-medium' : 'text-youth-charcoal/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Story
              </Link>
              <Link 
                to="/our-instagram" 
                className={`block py-2 px-8 ${isActive('/our-instagram') ? 'text-youth-purple font-medium' : 'text-youth-charcoal/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Instagram
              </Link>
              <Link 
                to="/contact" 
                className={`block py-2 px-8 ${isActive('/contact') ? 'text-youth-purple font-medium' : 'text-youth-charcoal/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
