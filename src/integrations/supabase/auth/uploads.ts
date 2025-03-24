
import { supabase } from "../client";
import { toast } from "sonner";
import { categorizeImageError } from "./utils";

// Upload profile image to Supabase storage
export const uploadProfileImage = async (file: File, identifier: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${identifier}.${fileExt}`;
    
    console.log(`Uploading profile file to bucket 'profile-images', path: ${filePath}`);
    
    // Upload the file to the profile-images bucket
    const { data, error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful, data:', data);

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    console.log('File uploaded successfully, public URL:', publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading profile image:', error);
    toast.error(`Failed to upload image: ${error.message}`);
    throw new Error(`Failed to upload profile image: ${error.message}`);
  }
};

// Upload banner image to Supabase storage with improved error handling
export const uploadBannerImage = async (file: File, identifier: string): Promise<string | null> => {
  console.log(`Starting banner upload with file: ${file.name}, size: ${file.size}, type: ${file.type}`);
  
  try {
    // Validate file type first
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      const error = new Error('Invalid file type. Please use JPEG or PNG images.');
      console.error('Banner file type validation failed:', error);
      toast.error('Invalid file type. Please use JPEG or PNG images.');
      return null;
    }
    
    // Validate file size (3MB max)
    if (file.size > 3 * 1024 * 1024) {
      const error = new Error('File size must be less than 3MB');
      console.error('Banner file size validation failed:', error);
      toast.error('File size must be less than 3MB');
      return null;
    }
    
    // Use banner- prefix for files in the profile-images bucket
    const fileExt = file.name.split('.').pop();
    const filePath = `banner-${identifier}.${fileExt}`;
    
    console.log(`Uploading banner to bucket 'profile-images', path: ${filePath}`);
    
    // Verify storage bucket access
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket('profile-images');
    
    if (bucketError) {
      console.error('Storage bucket verification failed:', bucketError);
      toast.error(`Storage access error: ${bucketError.message}`);
      return null;
    }
    
    console.log('Storage bucket verified:', bucketData);
    
    // Upload to profile-images bucket with the banner- prefix
    const { data, error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '0', // Disable cache completely - force fresh each time
        upsert: true
      });

    if (uploadError) {
      console.error('Banner upload error with details:', uploadError);
      // Show a more detailed error message
      if (uploadError.message.includes('permission')) {
        toast.error('Permission denied when uploading. Please contact support.');
      } else if (uploadError.message.includes('413') || uploadError.message.includes('too large')) {
        toast.error('Image file is too large. Please use a smaller image (max 3MB).');
      } else {
        toast.error(`Upload failed: ${uploadError.message}`);
      }
      return null;
    }

    console.log('Banner upload successful, data:', data);

    // Get the public URL with a cache bust parameter
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      const error = new Error('Failed to get public URL for uploaded banner image');
      console.error(error);
      toast.error('Failed to get public URL for uploaded image');
      return null;
    }

    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
    console.log('Banner file uploaded successfully, public URL with cache bust:', cacheBustedUrl);
    
    // Verify the image is accessible
    try {
      const response = await fetch(cacheBustedUrl, { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      
      if (!response.ok) {
        console.warn(`Uploaded image URL returned status ${response.status}: ${cacheBustedUrl}`);
        toast.warning('Image uploaded but may not be immediately available. Please refresh in a moment.');
      } else {
        console.log('Image URL verified accessible:', cacheBustedUrl);
      }
    } catch (verifyError) {
      console.warn('Could not verify image URL accessibility:', verifyError);
      // Don't block the process for this error
    }
    
    toast.success('Banner image uploaded successfully!');
    return cacheBustedUrl;
  } catch (error: any) {
    console.error('Error uploading banner image with full stack:', error);
    
    // Use our error categorization helper
    const errorDetails = categorizeImageError(error);
    
    // Display appropriate error message based on type
    toast.error(`Failed to upload banner image: ${errorDetails.message}`);
    
    return null;
  }
};
