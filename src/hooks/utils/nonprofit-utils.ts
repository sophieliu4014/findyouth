
import { supabase } from '@/integrations/supabase/client';
import { generateFallbackImageUrl } from './image-utils';
import { NONPROFIT_NAME_MAP } from '../types/event-types';
import { getProfileImageFromStorage } from './image-utils';

export const fetchNonprofitData = async (nonprofitId: string) => {
  try {
    // First, try to get from the nonprofits table which has the most complete data
    const { data: nonprofitData, error: nonprofitError } = await supabase
      .from('nonprofits')
      .select('*')
      .eq('id', nonprofitId)
      .single();
    
    if (nonprofitData) {
      return {
        name: nonprofitData.organization_name,
        profileImage: nonprofitData.profile_image_url || await getProfileImageFromStorage(nonprofitId),
        description: nonprofitData.description,
        location: nonprofitData.location,
        bannerImageUrl: nonprofitData.banner_image_url || null
      };
    }
    
    // If no data in nonprofits table, try to get from user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(nonprofitId);
    
    if (userData?.user) {
      const metadata = userData.user.user_metadata;
      const nonprofitData = metadata.nonprofit_data || {};
      
      return {
        name: metadata.organization_name || NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
        profileImage: nonprofitData.profileImageUrl || await getProfileImageFromStorage(nonprofitId),
        description: nonprofitData.description,
        location: nonprofitData.location,
        bannerImageUrl: nonprofitData.bannerImageUrl || null
      };
    }
    
    // Fallback to hardcoded values if no data found
    return {
      name: NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
      profileImage: generateFallbackImageUrl(nonprofitId),
      location: '',
      bannerImageUrl: null
    };
  } catch (error) {
    console.error('Error fetching nonprofit data:', error);
    return {
      name: NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
      profileImage: generateFallbackImageUrl(nonprofitId),
      location: '',
      bannerImageUrl: null
    };
  }
};
