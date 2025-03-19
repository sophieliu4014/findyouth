
import { supabase } from "./client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";

// Types for authentication
export type AuthUser = User | null;
export type AuthSession = Session | null;

// Create nonprofit profile in the database
export const createNonprofitProfile = async ({
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
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    // Insert the nonprofit profile
    const { data: nonprofit, error: profileError } = await supabase
      .from('nonprofits')
      .insert({
        id: user.id,
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
        nonprofit_id: user.id,
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

// Upload profile image to Supabase storage
export const uploadProfileImage = async (file: File, identifier: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${identifier}.${fileExt}`;
    
    console.log(`Uploading file to bucket 'profile-images', path: ${filePath}`);
    
    // Direct upload approach - the bucket exists from our SQL but the check is failing
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

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
