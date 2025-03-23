
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, User, Edit } from 'lucide-react';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signOut } from '@/integrations/supabase/auth';
import ProfileHeader from './ProfileHeader';
import AccountInfoTab from './AccountInfoTab';
import ProfileEditForm from './ProfileEditForm';

interface ProfilePageLayoutProps {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}

const ProfilePageLayout = ({ user, isAuthenticated, isLoading, refreshAuth }: ProfilePageLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleProfileUpdated = async () => {
    await refreshAuth();
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
            
            <ProfileHeader 
              user={user} 
              refreshAuth={refreshAuth} 
            />
            
            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account Information
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Public Profile
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <AccountInfoTab 
                  user={user} 
                  refreshAuth={refreshAuth} 
                />
              </TabsContent>
              
              <TabsContent value="profile">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4">Edit Public Profile</h3>
                  <p className="text-youth-charcoal/70 mb-6">
                    This information will be displayed on your public profile page.
                  </p>
                  
                  {user?.id && (
                    <ProfileEditForm 
                      userId={user.id} 
                      onProfileUpdated={handleProfileUpdated}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center">
              <a 
                href={`/nonprofit/${user?.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-youth-blue hover:underline text-sm"
              >
                View your public profile page →
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ProfilePageLayout;
