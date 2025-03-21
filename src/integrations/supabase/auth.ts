
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
  causes: string[];
}) => {
  try {
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
        profile_image_url: profileImageUrl
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
    const organizationName = metadata?.organization_name;
    const nonprofitData = metadata?.nonprofit_data;
    
    if (!organizationName || !nonprofitData) {
      console.log("Missing required data in user metadata");
      return false;
    }

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
      causes: nonprofitData.causes || []
    });

    if (error) {
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
    
    console.log(`Uploading file to bucket 'profile-images', path: ${filePath}`);
    
    // Try the upload without checking for bucket existence first
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
