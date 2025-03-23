
import { supabase } from '@/integrations/supabase/client';
import { generateFallbackImageUrl } from './image-utils';
import { NONPROFIT_NAME_MAP } from '../types/event-types';
import { getProfileImageFromStorage } from './image-utils';

export const fetchNonprofitData = async (nonprofitId: string) => {
  try {
    console.log(`Attempting to fetch nonprofit data for ID: ${nonprofitId}`);
    
    if (!nonprofitId) {
      console.error('No nonprofit ID provided');
      return {
        name: 'Organization',
        profileImage: generateFallbackImageUrl('default'),
        description: 'No description available',
        location: '',
        bannerImageUrl: null
      };
    }
    
    // First, try to get from the nonprofits table which has the most complete data
    const { data: nonprofitData, error: nonprofitError } = await supabase
      .from('nonprofits')
      .select('*')
      .eq('id', nonprofitId)
      .single();
    
    if (nonprofitError) {
      console.log(`Error fetching from nonprofits table: ${nonprofitError.message}`);
    }
    
    if (nonprofitData) {
      console.log('Successfully fetched nonprofit data from nonprofits table');
      return {
        name: nonprofitData.organization_name,
        profileImage: nonprofitData.profile_image_url || await getProfileImageFromStorage(nonprofitId),
        description: nonprofitData.description || 'No description available',
        location: nonprofitData.location || '',
        bannerImageUrl: nonprofitData.banner_image_url || null
      };
    }
    
    // If no data in nonprofits table, try to get from user metadata
    console.log('No data in nonprofits table, attempting to fetch from user metadata');
    try {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(nonprofitId);
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        throw userError;
      }
      
      if (userData?.user) {
        console.log('Successfully fetched user data from auth');
        const metadata = userData.user.user_metadata || {};
        const nonprofitData = metadata.nonprofit_data || {};
        
        return {
          name: metadata.organization_name || NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
          profileImage: nonprofitData.profileImageUrl || await getProfileImageFromStorage(nonprofitId),
          description: nonprofitData.description || 'No description available',
          location: nonprofitData.location || '',
          bannerImageUrl: nonprofitData.bannerImageUrl || null
        };
      }
    } catch (userDataError) {
      console.error('Error in user data fetch process:', userDataError);
      // Continue to fallback
    }
    
    // Fallback to hardcoded values if no data found
    console.log('No user data found, using fallback values');
    return {
      name: NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
      profileImage: generateFallbackImageUrl(nonprofitId),
      description: 'No description available',
      location: '',
      bannerImageUrl: null
    };
  } catch (error) {
    console.error('Error in fetchNonprofitData:', error);
    // Return fallback data even in case of errors
    return {
      name: NONPROFIT_NAME_MAP[nonprofitId] || 'Organization',
      profileImage: generateFallbackImageUrl(nonprofitId),
      description: 'No description available',
      location: '',
      bannerImageUrl: null
    };
  }
};
