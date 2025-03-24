
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user has admin privileges
 * @param userId The user ID to check
 * @returns A boolean indicating whether the user has admin privileges
 */
export const checkAdminStatus = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;
  
  // Hardcoded admin ID for findyouthbc@gmail.com
  if (userId === 'e76a0e1b-6a87-4dac-8714-1c9e9052f52c') {
    return true;
  }
  
  try {
    const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error('Error in checkAdminStatus:', error);
    return false;
  }
};

/**
 * Check if a user can manage a specific event (is creator or admin)
 * @param userId Current user ID
 * @param creatorId Event creator's ID 
 * @param isAdmin Whether the user is an admin
 * @returns Boolean indicating if the user can manage this event
 */
export const canManageEvent = (userId: string | undefined, creatorId: string | undefined, isAdmin: boolean): boolean => {
  if (!userId || !creatorId) return false;
  
  // User can manage the event if they created it OR they're an admin
  return userId === creatorId || isAdmin;
};
