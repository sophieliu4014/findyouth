
import { supabase } from '@/integrations/supabase/client';
import { NONPROFIT_NAME_MAP } from '../types/event-types';

// Fetch nonprofit data by ID
export const fetchNonprofitData = async (nonprofitId: string) => {
  try {
    // First try to fetch from nonprofits table
    const { data: nonprofitData, error: nonprofitError } = await supabase
      .from('nonprofits')
      .select('*')
      .eq('id', nonprofitId)
      .single();

    if (!nonprofitError && nonprofitData) {
      return {
        name: nonprofitData.organization_name,
        profileImage: nonprofitData.profile_image_url,
        description: nonprofitData.description,
        location: nonprofitData.location,
        bannerImageUrl: nonprofitData.banner_image_url
      };
    }

    // Fallback to profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', nonprofitId)
      .single();

    if (!profileError && profileData) {
      return {
        name: profileData.full_name || NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
        profileImage: profileData.avatar_url,
        description: 'No description available',
        location: 'Location not specified',
        bannerImageUrl: null
      };
    }

    // Fallback to the name map
    return {
      name: NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
      profileImage: null,
      description: 'No description available',
      location: 'Location not specified',
      bannerImageUrl: null
    };
  } catch (error) {
    console.error('Error fetching nonprofit data:', error);
    return {
      name: NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
      profileImage: null,
      description: 'No description available',
      location: 'Location not specified',
      bannerImageUrl: null
    };
  }
};

// Get profile image for a nonprofit
export const getProfileImageForNonprofit = async (nonprofitId: string) => {
  try {
    const nonprofitData = await fetchNonprofitData(nonprofitId);
    return nonprofitData.profileImage;
  } catch (error) {
    console.error('Error fetching nonprofit profile image:', error);
    return null;
  }
};
