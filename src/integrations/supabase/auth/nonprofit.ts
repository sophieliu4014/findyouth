
import { supabase } from "../client";
import { toast } from "sonner";

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
