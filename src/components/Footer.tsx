
import { Link } from 'react-router-dom';
import { Heart, Mail, ExternalLink } from 'lucide-react';
import Logo from './ui/Logo';

const Footer = () => {
  return (
    <footer className="bg-youth-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Logo />
            </div>
            <p className="mt-4 text-gray-300">
              Connecting youth-led nonprofits with passionate volunteers across Greater Vancouver.
            </p>
            <div className="mt-4 flex space-x-4">
              <a 
                href="https://instagram.com/findyouthbc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/find-activities" className="text-gray-300 hover:text-white transition-colors">
                  Find Activities
                </Link>
              </li>
              <li>
                <Link to="/find-volunteers" className="text-gray-300 hover:text-white transition-colors">
                  Find Volunteers
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-gray-300 hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/website-guidelines" className="text-gray-300 hover:text-white transition-colors">
                  Website Guidelines
                </Link>
              </li>
              <li>
                <Link to="/register-ngo" className="text-gray-300 hover:text-white transition-colors">
                  Register Your NGO
                </Link>
              </li>
              <li>
                <Link to="/ngo-login" className="text-gray-300 hover:text-white transition-colors">
                  NGO Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:findyouthbc@gmail.com" className="hover:text-white transition-colors">
                  findyouthbc@gmail.com
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <ExternalLink className="h-5 w-5 mr-2" />
                <a 
                  href="https://instagram.com/findyouthbc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @findyouthbc
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FindYOUth. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0 flex items-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> in Vancouver, BC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
