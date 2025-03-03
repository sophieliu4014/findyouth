
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';
import { signOut } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    setIsOpen(false);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-youth-charcoal hover:text-youth-purple transition-colors">
          Log In
        </Link>
        <Link to="/signup" className="btn-primary">
          Sign Up
        </Link>
      </div>
    );
  }
  
  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="flex items-center p-2 rounded-full hover:bg-youth-blue/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-youth-blue rounded-full flex items-center justify-center text-white">
          {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || user?.email}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4 mr-2" />
            Your Profile
          </Link>
          
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
