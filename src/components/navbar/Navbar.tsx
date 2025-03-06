
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Logo from '../ui/Logo';
import UserMenu from '../auth/UserMenu';

const Navbar = () => {
  const [isVolunteersOpen, setIsVolunteersOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeDropdowns = () => {
    setIsVolunteersOpen(false);
    setIsAboutOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#E6D9FF] shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeDropdowns}>
              <Logo />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/find-activities" 
              className={`text-youth-charcoal hover:text-youth-purple transition-colors font-medium tracking-wide ${isActive('/find-activities') ? 'font-semibold text-youth-purple' : ''}`}
              onClick={closeDropdowns}
            >
              Find Activities
            </Link>
            
            <div className="relative">
              <button 
                className={`flex items-center text-youth-charcoal hover:text-youth-purple transition-colors font-medium tracking-wide ${isActive('/register-ngo') ? 'font-semibold text-youth-purple' : ''}`}
                onClick={() => {
                  setIsVolunteersOpen(!isVolunteersOpen);
                  setIsAboutOpen(false);
                }}
              >
                Find Volunteers
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isVolunteersOpen && (
                <div className="dropdown-menu bg-white/95 backdrop-blur-sm rounded-xl">
                  <Link to="/register-ngo" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Register your NGO</Link>
                  <Link to="/website-guidelines" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Website Guidelines</Link>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                className={`flex items-center text-youth-charcoal hover:text-youth-purple transition-colors font-medium tracking-wide ${isActive('/about') || isActive('/instagram') || isActive('/contact') ? 'font-semibold text-youth-purple' : ''}`}
                onClick={() => {
                  setIsAboutOpen(!isAboutOpen);
                  setIsVolunteersOpen(false);
                }}
              >
                About Us
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isAboutOpen && (
                <div className="dropdown-menu bg-white/95 backdrop-blur-sm rounded-xl">
                  <Link to="/our-story" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Our Story</Link>
                  <Link to="/our-instagram" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Our Instagram</Link>
                  <Link to="/contact" className="dropdown-item hover:bg-youth-softgray/50" onClick={closeDropdowns}>Contact Us</Link>
                </div>
              )}
            </div>
            
            <UserMenu />
          </nav>

          {/* Mobile menu button - would need to implement mobile menu */}
          <div className="md:hidden">
            <button className="text-youth-charcoal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
