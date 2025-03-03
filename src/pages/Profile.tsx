
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '@/lib/auth';
import { signOut } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
    
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate saving profile (would connect to Supabase in a real implementation)
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-youth-blue" />
            <p>Loading profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Profile | FindYOUth</title>
        <meta name="description" content="Manage your FindYOUth profile and account settings." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-youth-softgray py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-youth-charcoal">Your Profile</h1>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="text-youth-charcoal hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                Log Out
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-youth-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-youth-blue">
                        {fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold">{fullName}</h2>
                    <p className="text-youth-charcoal/70">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-youth-charcoal mb-1">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-youth-blue"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-youth-charcoal mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        value={user?.email || ''}
                        disabled
                      />
                      <p className="mt-1 text-xs text-youth-charcoal/70">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-youth-blue hover:bg-youth-purple transition-colors"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Profile;
