
import { supabase } from "./client";
import { Session, User } from '@supabase/supabase-js';

// Types for authentication
export type AuthUser = User | null;
export type AuthSession = Session | null;

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, userData?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
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

// Create nonprofit profile
export const createNonprofitProfile = async (nonprofitData: {
  organizationName: string;
  email: string;
  phone: string;
  website: string;
  socialMedia: string;
  location: string;
  description: string;
  mission: string;
  profileImageUrl?: string;
  causes: string[];
}) => {
  const { user } = await getCurrentUser();
  
  if (!user) {
    return { error: { message: "User not authenticated" } };
  }
  
  // Insert nonprofit profile
  const { data: nonprofit, error: nonprofitError } = await supabase
    .from('nonprofits')
    .insert({
      organization_name: nonprofitData.organizationName,
      email: nonprofitData.email,
      phone: nonprofitData.phone,
      website: nonprofitData.website || null,
      social_media: nonprofitData.socialMedia,
      location: nonprofitData.location,
      description: nonprofitData.description,
      mission: nonprofitData.mission,
      profile_image_url: nonprofitData.profileImageUrl || null,
      auth_id: user.id
    })
    .select()
    .single();
    
  if (nonprofitError) {
    console.error("Error creating nonprofit:", nonprofitError);
    return { error: nonprofitError };
  }
  
  // Get cause IDs
  const { data: causeData, error: causeError } = await supabase
    .from('causes')
    .select('id, name')
    .in('name', nonprofitData.causes);
    
  if (causeError) {
    console.error("Error fetching causes:", causeError);
    return { nonprofit, error: causeError };
  }
  
  // Link nonprofit to causes
  const causeLinks = causeData.map((cause) => ({
    nonprofit_id: nonprofit.id,
    cause_id: cause.id
  }));
  
  const { error: linkError } = await supabase
    .from('nonprofit_causes')
    .insert(causeLinks);
    
  if (linkError) {
    console.error("Error linking causes:", linkError);
    return { nonprofit, error: linkError };
  }
  
  return { nonprofit, error: null };
};

// Get nonprofit profile by auth ID
export const getNonprofitByAuthId = async () => {
  const { user } = await getCurrentUser();
  
  if (!user) {
    return { nonprofit: null, error: { message: "User not authenticated" } };
  }
  
  const { data, error } = await supabase
    .from('nonprofits')
    .select(`
      *,
      nonprofit_causes(
        causes(id, name)
      )
    `)
    .eq('auth_id', user.id)
    .single();
    
  return { nonprofit: data, error };
};

// Upload profile image with improved error handling
export const uploadProfileImage = async (file: File): Promise<string | null> => {
  try {
    console.log("Starting profile image upload...");
    
    // First check if we have an authenticated user
    const { user } = await getCurrentUser();
    
    if (!user) {
      console.error("Error: User not authenticated for image upload");
      throw new Error("User not authenticated");
    }
    
    // Validate the file
    if (!file || file.size === 0) {
      console.error("Error: Invalid file for upload");
      throw new Error("Invalid file");
    }
    
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      console.error("Error: File too large");
      throw new Error("File size exceeds 2MB limit");
    }
    
    // Sanitize the filename and create a unique path
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `nonprofit-profiles/${fileName}`;
    
    console.log(`Uploading to path: ${filePath}`);
    
    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      
      // Check for specific error types and provide better messages
      if (uploadError.message.includes("storage bucket") || uploadError.message.includes("not found")) {
        throw new Error("Storage bucket not configured properly. Please contact support.");
      }
      
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    if (!uploadData || !uploadData.path) {
      console.error("No upload data returned");
      throw new Error("Upload completed but no path returned");
    }
    
    console.log("File uploaded successfully, getting public URL");
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);
      
    if (!urlData || !urlData.publicUrl) {
      console.error("Failed to get public URL");
      throw new Error("Failed to generate public URL for uploaded image");
    }
    
    console.log("Image upload successful, public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Profile image upload failed:", error);
    throw error; // Re-throw to allow proper handling in the calling function
  }
};
