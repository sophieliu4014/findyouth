import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Save, Upload, Edit, User, Camera } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '@/lib/auth';
import { signOut, uploadProfileImage, uploadBannerImage } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import BannerImageUpload from '@/components/registration/BannerImageUpload';

const Profile = () => {
  const { user, isAuthenticated, isLoading, refreshAuth } = useAuthStore();
  const [organizationName, setOrganizationName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageError, setBannerImageError] = useState<string | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
    
    if (user?.user_metadata?.organization_name) {
      setOrganizationName(user.user_metadata.organization_name);
    }

    if (user?.user_metadata?.nonprofit_data?.profileImageUrl) {
      setImagePreview(user.user_metadata.nonprofit_data.profileImageUrl);
    }
    
    if (user?.user_metadata?.nonprofit_data?.bannerImageUrl) {
      setBannerImagePreview(user.user_metadata.nonprofit_data.bannerImageUrl);
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setProfileImage(file);
  };
  
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      let profileImageUrl = user?.user_metadata?.nonprofit_data?.profileImageUrl || '';
      let bannerImageUrl = user?.user_metadata?.nonprofit_data?.bannerImageUrl || '';
      
      if (profileImage) {
        const identifier = user?.id || Date.now().toString();
        const newImageUrl = await uploadProfileImage(profileImage, identifier);
        if (newImageUrl) {
          profileImageUrl = newImageUrl;
        }
      }
      
      if (bannerImage) {
        const identifier = `banner-${user?.id || Date.now().toString()}`;
        const newBannerUrl = await uploadBannerImage(bannerImage, identifier);
        if (newBannerUrl) {
          bannerImageUrl = newBannerUrl;
        }
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
          organization_name: organizationName,
          nonprofit_data: {
            ...user?.user_metadata?.nonprofit_data,
            profileImageUrl,
            bannerImageUrl
          }
        }
      });
      
      if (error) throw error;
      
      if (user?.id) {
        const { error: nonprofitError } = await supabase
          .from('nonprofits')
          .update({
            organization_name: organizationName,
            profile_image_url: profileImageUrl,
            banner_image_url: bannerImageUrl
          })
          .eq('id', user.id);
        
        if (nonprofitError) {
          console.error('Error updating nonprofit profile:', nonprofitError);
        }
      }
      
      await refreshAuth();
      toast.success('Profile updated successfully');
      
      setProfileImage(null);
      setBannerImage(null);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
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
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-8 relative">
              <div className="h-32 sm:h-48 w-full rounded-lg overflow-hidden bg-youth-blue/10 mb-4">
                {bannerImagePreview ? (
                  <img 
                    src={bannerImagePreview} 
                    alt="Banner" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-youth-charcoal/50 text-sm">No banner image</p>
                  </div>
                )}
                
                <div className="absolute top-8 right-8">
                  <BannerImageUpload 
                    setBannerImage={setBannerImage}
                    setBannerImageError={setBannerImageError}
                    bannerImageError={bannerImageError}
                    existingBannerUrl={bannerImagePreview}
                    insideForm={false}
                  />
                </div>
              </div>
              
              <div className="text-center">
                {bannerImage && (
                  <div className="mt-2 animate-fade-in">
                    <p className="text-sm text-youth-blue mb-2">New banner selected. Save to apply changes.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-8">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-youth-blue/10 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-youth-blue">
                        {organizationName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <label 
                    htmlFor="profile-image-upload" 
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 border border-gray-200"
                  >
                    <Upload className="h-4 w-4 text-youth-blue" />
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-semibold">{organizationName}</h2>
                <p className="text-youth-charcoal/70">{user?.email}</p>
                <p className="text-xs text-youth-charcoal/50 mt-2">
                  Click the upload icon to change your profile picture
                </p>
                
                {(profileImage || bannerImage) && (
                  <Button 
                    onClick={handleSaveProfile}
                    className="mt-4 bg-youth-blue hover:bg-youth-purple transition-colors"
                    disabled={isSaving}
                    size="sm"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Image Changes
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
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
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="organizationName" className="block text-sm font-medium text-youth-charcoal mb-1">
                        Organization Name
                      </label>
                      <Input
                        id="organizationName"
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-youth-charcoal mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-gray-50"
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

export default Profile;
