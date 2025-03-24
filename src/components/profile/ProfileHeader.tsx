import { useState, useEffect } from 'react';
import { Loader2, Save, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BannerImageUpload from '@/components/registration/BannerImageUpload';
import ProfileImageSection from './ProfileImageSection';
import { supabase } from '@/integrations/supabase/client';
import { uploadProfileImage, uploadBannerImage } from '@/integrations/supabase/auth';
import { getBannerImageFromStorage, getCacheBustedUrl } from '@/hooks/utils/image-utils';

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
  const [imageLoadError, setImageLoadError] = useState(false);
  const organizationName = user?.user_metadata?.organization_name || '';
  const [previewKey, setPreviewKey] = useState<number>(Date.now());

  useEffect(() => {
    const fetchBannerImage = async () => {
      setIsLoadingBanner(true);
      setImageLoadError(false);
      console.log("Fetching banner image for user:", user?.id);
      
      try {
        // First try from metadata
        const metadataUrl = user?.user_metadata?.nonprofit_data?.bannerImageUrl;
        if (metadataUrl) {
          console.log('Using banner from metadata:', metadataUrl);
          const cacheBustUrl = getCacheBustedUrl(metadataUrl);
          console.log('Cache-busted URL:', cacheBustUrl);
          setBannerImagePreview(cacheBustUrl);
          setIsLoadingBanner(false);
          return;
        }
        
        // Then try from storage
        if (user?.id) {
          console.log("Checking storage for banner with ID:", user.id);
          const storageUrl = await getBannerImageFromStorage(user.id);
          
          if (storageUrl) {
            console.log('Using banner from storage:', storageUrl);
            const cacheBustUrl = getCacheBustedUrl(storageUrl);
            console.log('Cache-busted URL:', cacheBustUrl);
            setBannerImagePreview(cacheBustUrl);
            setIsLoadingBanner(false);
            return;
          }
        }
        
        // Last, try from nonprofits table
        if (user?.id) {
          const { data: nonprofitData, error } = await supabase
            .from('nonprofits')
            .select('banner_image_url')
            .eq('id', user.id)
            .single();
            
          if (!error && nonprofitData?.banner_image_url) {
            console.log('Using banner from nonprofits table:', nonprofitData.banner_image_url);
            const cacheBustUrl = getCacheBustedUrl(nonprofitData.banner_image_url);
            console.log('Cache-busted URL:', cacheBustUrl);
            setBannerImagePreview(cacheBustUrl);
          } else {
            console.log('No banner found in nonprofits table or error:', error?.message);
          }
        }
      } catch (error) {
        console.error('Error fetching banner image:', error);
        setImageLoadError(true);
      } finally {
        setIsLoadingBanner(false);
      }
    };
    
    fetchBannerImage();
  }, [user, previewKey]);

  const handleImageError = () => {
    console.error("Failed to load banner image:", bannerImagePreview);
    setImageLoadError(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      console.log("Starting save profile process");
      
      let profileImageUrl = user?.user_metadata?.nonprofit_data?.profileImageUrl || '';
      let bannerImageUrl = user?.user_metadata?.nonprofit_data?.bannerImageUrl || '';
      
      if (profileImage) {
        console.log("Uploading profile image");
        const identifier = user?.id || Date.now().toString();
        const newImageUrl = await uploadProfileImage(profileImage, identifier);
        if (newImageUrl) {
          profileImageUrl = newImageUrl;
          console.log('Profile image uploaded successfully to:', newImageUrl);
        }
      }
      
      if (bannerImage) {
        console.log("Uploading banner image, file:", bannerImage.name, "Size:", bannerImage.size, "Type:", bannerImage.type);
        const identifier = user?.id || Date.now().toString();
        const newBannerUrl = await uploadBannerImage(bannerImage, identifier);
        if (newBannerUrl) {
          bannerImageUrl = newBannerUrl;
          console.log('Banner uploaded successfully to:', newBannerUrl);
          
          // Immediately update the preview with cache busting
          const cacheBustUrl = getCacheBustedUrl(newBannerUrl);
          console.log('Setting new banner preview with cache-bust:', cacheBustUrl);
          setBannerImagePreview(cacheBustUrl);
          setImageLoadError(false);
        } else {
          console.error("Failed to get banner URL after upload");
          toast.error("Failed to upload banner image");
          setIsSaving(false);
          return;
        }
      } else {
        console.log("No banner image to upload");
      }
      
      console.log("Updating user metadata with image URLs:", { profileImageUrl, bannerImageUrl });
      const { data, error } = await supabase.auth.updateUser({
        data: {
          nonprofit_data: {
            ...user?.user_metadata?.nonprofit_data,
            profileImageUrl,
            bannerImageUrl
          }
        }
      });
      
      if (error) {
        console.error("Error updating user metadata:", error);
        throw error;
      }
      
      console.log("User metadata updated successfully:", data);
      
      if (user?.id) {
        console.log("Updating nonprofit database record");
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
      
      // Force reload preview with new timestamp to break cache
      setPreviewKey(Date.now());
      
      setProfileImage(null);
      setBannerImage(null);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const showSaveButton = profileImage !== null || bannerImage !== null;

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 mb-8">
        <div className="h-40 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-youth-blue/10 to-youth-purple/10">
          {isLoadingBanner ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
            </div>
          ) : bannerImagePreview && !imageLoadError ? (
            <img 
              src={bannerImagePreview} 
              alt="Banner" 
              className="w-full h-full object-cover"
              key={`banner-preview-${previewKey}`}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-youth-blue/5 via-youth-purple/5 to-youth-blue/5">
              {imageLoadError && (
                <div className="flex flex-col items-center text-youth-blue/70">
                  <ImageOff className="h-8 w-8 mb-2" />
                  <span className="text-sm">Banner image not available</span>
                </div>
              )}
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
            fileSelected={!!bannerImage}
            onSaveClick={handleSaveProfile}
          />
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
          
          {showSaveButton && !bannerImage && (
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
