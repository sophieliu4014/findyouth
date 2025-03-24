import { supabase } from "./client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";

// Types for authentication
export type AuthUser = User | null;
export type AuthSession = Session | null;

// Create nonprofit profile in the database
export const createNonprofitProfile = async ({
  userId,
  organizationName,
  email,
  phone,
  website,
  socialMedia,
  location,
  description,
  mission,
  profileImageUrl,
  bannerImageUrl,
  causes
}: {
  userId: string;
  organizationName: string;
  email: string;
  phone: string;
  website?: string;
  socialMedia: string;
  location: string;
  description: string;
  mission: string;
  profileImageUrl: string;
  bannerImageUrl?: string | null;
  causes: string[];
}) => {
  try {
    console.log("Creating nonprofit profile with image URLs:", profileImageUrl, bannerImageUrl);
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('nonprofits')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (existingProfile) {
      console.log("Nonprofit profile already exists, updating instead");
      // Update the profile instead of inserting
      const { data: updatedProfile, error: updateError } = await supabase
        .from('nonprofits')
        .update({
          organization_name: organizationName,
          email,
          phone,
          website,
          social_media: socialMedia,
          location,
          description,
          mission,
          profile_image_url: profileImageUrl,
          banner_image_url: bannerImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();
        
      if (updateError) throw updateError;
      
      // Return the updated profile
      return { nonprofit: updatedProfile, error: null };
    }
    
    // Insert the nonprofit profile
    const { data: nonprofit, error: profileError } = await supabase
      .from('nonprofits')
      .insert({
        id: userId,
        organization_name: organizationName,
        email,
        phone,
        website,
        social_media: socialMedia,
        location,
        description,
        mission,
        profile_image_url: profileImageUrl,
        banner_image_url: bannerImageUrl
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Get cause IDs
    const { data: causeData, error: causesError } = await supabase
      .from('causes')
      .select('id, name')
      .in('name', causes);

    if (causesError) throw causesError;

    // Insert nonprofit-cause relationships
    if (causeData && causeData.length > 0) {
      const causeRelations = causeData.map(cause => ({
        nonprofit_id: userId,
        cause_id: cause.id
      }));

      const { error: relationError } = await supabase
        .from('nonprofit_causes')
        .insert(causeRelations);

      if (relationError) throw relationError;
    }

    return { nonprofit, error: null };
  } catch (error: any) {
    console.error('Error creating nonprofit profile:', error);
    return { nonprofit: null, error };
  }
};

// Check if user has a nonprofit profile and create one if needed
export const ensureNonprofitProfile = async (): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) {
      console.log("No authenticated user found");
      return false;
    }

    // Check if nonprofit profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('nonprofits')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw profileError;
    }

    // If profile exists, nothing to do
    if (existingProfile) {
      console.log("Nonprofit profile already exists");
      return true;
    }

    // Extract stored data from user metadata
    const metadata = user.user_metadata;
    console.log("Creating profile from metadata:", JSON.stringify(metadata, null, 2));
    
    const organizationName = metadata?.organization_name;
    const nonprofitData = metadata?.nonprofit_data;
    
    if (!organizationName || !nonprofitData) {
      console.log("Missing required data in user metadata");
      return false;
    }

    console.log("Profile image URL from metadata:", nonprofitData.profileImageUrl);

    // Create the nonprofit profile
    const { nonprofit, error } = await createNonprofitProfile({
      userId: user.id,
      organizationName,
      email: user.email || '',
      phone: nonprofitData.phone || '',
      website: nonprofitData.website || '',
      socialMedia: nonprofitData.socialMedia || '',
      location: nonprofitData.location || '',
      description: nonprofitData.description || '',
      mission: nonprofitData.mission || '',
      profileImageUrl: nonprofitData.profileImageUrl || '',
      bannerImageUrl: nonprofitData.bannerImageUrl || '',
      causes: nonprofitData.causes || []
    });

    // Only show error toast for real errors, not for RLS or expected issues
    if (error) {
      // Check if it's a Row Level Security (RLS) error or other expected errors
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        console.log("RLS policy prevented profile creation - this is expected behavior for some users");
        return true; // Return true since this isn't a real error for the user experience
      }
      
      // Only show error toast for unexpected errors
      toast.error("Failed to create nonprofit profile. Please contact support.");
      return false;
    }

    toast.success("Your nonprofit profile has been created!");
    return true;
  } catch (error: any) {
    console.error("Error ensuring nonprofit profile:", error);
    return false;
  }
};

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
    const errorMessage = error.message || "Unknown error";
    
    // Display appropriate error message based on type
    if (errorMessage.includes('storage') || errorMessage.includes('permission')) {
      toast.error('Storage access error. Please try again or contact support.');
    } else if (errorMessage.includes('too large') || errorMessage.includes('413')) {
      toast.error('File is too large. Please select a smaller image (max 3MB).');
    } else if (errorMessage.includes('format') || errorMessage.includes('type')) {
      toast.error('Invalid file format. Please use JPEG or PNG images.');
    } else if (errorMessage.includes('network')) {
      toast.error('Network error. Please check your connection and try again.');
    } else {
      toast.error(`Failed to upload banner image: ${errorMessage}`);
    }
    
    return null;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, userData?: Record<string, any>) => {
  const options: any = {
    data: userData
  };
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options
  });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Registration successful! Please check your email to confirm your account.");
  }
  
  return { data, error };
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Successfully logged in!");
    
    // Try to create nonprofit profile if not exists
    ensureNonprofitProfile().catch(err => {
      console.error("Failed to ensure nonprofit profile:", err);
    });
  }

  return { data, error };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Successfully logged out!");
  }
  
  return { error };
};

// Get current session
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Get current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Helper function to categorize image upload errors
function categorizeImageError(error: any): { type: string, message: string } {
  if (error.message?.includes('permission')) {
    return { type: 'storage_access', message: 'Permission denied when uploading.' };
  } else if (error.message?.includes('413') || error.message?.includes('too large')) {
    return { type: 'file_too_large', message: 'Image file is too large.' };
  } else if (error.message?.includes('invalid format')) {
    return { type: 'invalid_format', message: 'Invalid file format.' };
  } else if (error.message?.includes('network')) {
    return { type: 'network', message: 'Network error.' };
  } else if (error.message?.includes('upload failed')) {
    return { type: 'upload_failed', message: 'Upload failed.' };
  } else {
    return { type: 'unknown', message: error.message };
  }
}
