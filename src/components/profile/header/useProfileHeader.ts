
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { uploadProfileImage, uploadBannerImage } from '@/integrations/supabase/auth';
import { getBannerImageFromStorage, getCacheBustedUrl, verifyStorageAccess, categorizeImageError } from '@/hooks/utils/image-utils';

export const useProfileHeader = (user: any, refreshAuth: () => Promise<void>) => {
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.user_metadata?.nonprofit_data?.profileImageUrl || null
  );
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageError, setBannerImageError] = useState<string | null>(null);
  const [bannerUploadError, setBannerUploadError] = useState<{ message: string; details?: string } | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isVerifyingStorage, setIsVerifyingStorage] = useState(false);
  const [previewKey, setPreviewKey] = useState<number>(Date.now());

  // Verify storage access on component mount
  useEffect(() => {
    const checkStorageAccess = async () => {
      setIsVerifyingStorage(true);
      try {
        const hasAccess = await verifyStorageAccess();
        if (!hasAccess) {
          console.warn("Storage access verification failed in ProfileHeader");
          setBannerUploadError({
            message: "Storage configuration issue detected",
            details: "Unable to verify access to storage. Banner uploads may not work correctly."
          });
        } else {
          console.log("Storage access verified successfully in ProfileHeader");
          setBannerUploadError(null);
        }
      } catch (error) {
        console.error("Error verifying storage access in ProfileHeader:", error);
        setBannerUploadError({
          message: "Storage access error",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      } finally {
        setIsVerifyingStorage(false);
      }
    };
    
    checkStorageAccess();
  }, []);

  useEffect(() => {
    const fetchBannerImage = async () => {
      setIsLoadingBanner(true);
      setImageLoadError(false);
      setBannerUploadError(null);
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
        const { message } = categorizeImageError(error);
        setBannerUploadError({
          message: "Failed to load banner image",
          details: message
        });
      } finally {
        setIsLoadingBanner(false);
      }
    };
    
    fetchBannerImage();
  }, [user, previewKey]);

  const handleImageError = () => {
    console.error("Failed to load banner image:", bannerImagePreview);
    setImageLoadError(true);
    setBannerUploadError({
      message: "Failed to load banner image",
      details: "The image could not be displayed. It may be inaccessible or in an unsupported format."
    });
  };

  const handleStorageRetry = async () => {
    if (isVerifyingStorage) return;
    
    setIsVerifyingStorage(true);
    setBannerUploadError(null);
    
    try {
      const hasAccess = await verifyStorageAccess();
      if (hasAccess) {
        toast.success("Storage access verified successfully");
        // Refresh the banner image
        setPreviewKey(Date.now());
      } else {
        setBannerUploadError({
          message: "Storage access issue persists",
          details: "Please try again later or contact support."
        });
        toast.error("Unable to access storage");
      }
    } catch (error) {
      console.error("Storage retry error:", error);
      setBannerUploadError({
        message: "Storage verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
      toast.error("Storage verification failed");
    } finally {
      setIsVerifyingStorage(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setBannerUploadError(null);
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
        
        try {
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
            throw new Error("Failed to get banner URL after upload");
          }
        } catch (error) {
          console.error("Banner upload error:", error);
          const { type, message } = categorizeImageError(error);
          
          setBannerUploadError({
            message: "Banner upload failed",
            details: message
          });
          
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
          toast.error(`Database update error: ${nonprofitError.message}`);
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
      
      const { type, message } = categorizeImageError(error);
      
      setBannerUploadError({
        message: "Failed to update profile",
        details: message
      });
      
      toast.error(`Failed to update profile: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const showSaveButton = profileImage !== null || bannerImage !== null;

  return {
    isSaving,
    profileImage,
    setProfileImage,
    imagePreview,
    setImagePreview,
    bannerImage,
    setBannerImage,
    bannerImageError,
    setBannerImageError,
    bannerUploadError,
    bannerImagePreview,
    isLoadingBanner,
    imageLoadError,
    isVerifyingStorage,
    previewKey,
    handleImageError,
    handleStorageRetry,
    handleSaveProfile,
    showSaveButton
  };
};
