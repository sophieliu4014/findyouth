import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BannerImageUpload from '@/components/registration/BannerImageUpload';
import ProfileImageSection from './ProfileImageSection';
import { supabase } from '@/integrations/supabase/client';
import { uploadProfileImage, uploadBannerImage } from '@/integrations/supabase/auth';
import { getBannerImageFromStorage } from '@/hooks/utils/image-utils';

interface ProfileHeaderProps {
  user: any;
  refreshAuth: () => Promise<void>;
}

const ProfileHeader = ({ user, refreshAuth }: ProfileHeaderProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.user_metadata?.nonprofit_data?.profileImageUrl || null
  );
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageError, setBannerImageError] = useState<string | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const organizationName = user?.user_metadata?.organization_name || '';

  useEffect(() => {
    const fetchBannerImage = async () => {
      setIsLoadingBanner(true);
      try {
        const metadataUrl = user?.user_metadata?.nonprofit_data?.bannerImageUrl;
        if (metadataUrl) {
          console.log('Using banner from metadata:', metadataUrl);
          setBannerImagePreview(metadataUrl);
          setIsLoadingBanner(false);
          return;
        }
        
        if (user?.id) {
          const storageUrl = await getBannerImageFromStorage(user.id);
          if (storageUrl) {
            console.log('Using banner from storage:', storageUrl);
            setBannerImagePreview(storageUrl);
            setIsLoadingBanner(false);
            return;
          }
        }
        
        if (user?.id) {
          const { data: nonprofitData, error } = await supabase
            .from('nonprofits')
            .select('banner_image_url')
            .eq('id', user.id)
            .single();
            
          if (!error && nonprofitData?.banner_image_url) {
            console.log('Using banner from nonprofits table:', nonprofitData.banner_image_url);
            setBannerImagePreview(nonprofitData.banner_image_url);
          }
        }
      } catch (error) {
        console.error('Error fetching banner image:', error);
      } finally {
        setIsLoadingBanner(false);
      }
    };
    
    fetchBannerImage();
  }, [user]);

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
        const identifier = user?.id || Date.now().toString();
        const newBannerUrl = await uploadBannerImage(bannerImage, `banner-${identifier}`);
        if (newBannerUrl) {
          bannerImageUrl = newBannerUrl;
          setBannerImagePreview(newBannerUrl);
        }
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
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
            profile_image_url: profileImageUrl,
            banner_image_url: bannerImageUrl
          })
          .eq('id', user.id);
        
        if (nonprofitError) {
          console.error('Error updating nonprofit profile:', nonprofitError);
        }
      }
      
      await refreshAuth();
      toast.success('Profile images updated successfully');
      
      setProfileImage(null);
      setBannerImage(null);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 mb-8">
        <div className="h-40 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-youth-blue/10 to-youth-purple/10">
          {isLoadingBanner ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
            </div>
          ) : bannerImagePreview ? (
            <img 
              src={bannerImagePreview} 
              alt="Banner" 
              className="w-full h-full object-cover"
              key={bannerImagePreview}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-youth-blue/5 via-youth-purple/5 to-youth-blue/5">
              {/* No text here, just a subtle gradient background */}
            </div>
          )}
        </div>
        
        <div className="p-3 text-center">
          <BannerImageUpload 
            setBannerImage={setBannerImage}
            setBannerImageError={setBannerImageError}
            bannerImageError={bannerImageError}
            existingBannerUrl={bannerImagePreview}
            insideForm={false}
          />
          
          {bannerImage && (
            <div className="animate-fade-in mt-2">
              <p className="text-sm text-youth-blue font-medium">New banner selected. Save to apply changes.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-8">
        <div className="text-center">
          <ProfileImageSection 
            imagePreview={imagePreview} 
            setImagePreview={setImagePreview}
            setProfileImage={setProfileImage}
            organizationName={organizationName}
            email={user?.email}
          />
          
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
    </>
  );
};

export default ProfileHeader;
