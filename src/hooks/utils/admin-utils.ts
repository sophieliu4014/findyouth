
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user has admin privileges
 * @param userId The user ID to check
 * @returns A boolean indicating whether the user has admin privileges
 */
export const checkAdminStatus = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) {
    console.log('No userId provided for admin check');
    return false;
  }
  
  // Hardcoded admin ID for findyouthbc@gmail.com
  if (userId === 'e76a0e1b-6a87-4dac-8714-1c9e9052f52c') {
    console.log('Admin user detected via hardcoded ID:', userId);
    return true;
  }
  
  try {
    console.log('Checking admin status via RPC for user:', userId);
    const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    console.log('Admin check via RPC for', userId, 'returned:', data);
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
  if (!userId || !creatorId) {
    console.log('Missing userId or creatorId for permission check', { userId, creatorId });
    return false;
  }
  
  const isCreator = userId === creatorId;
  console.log('Permission check details:', { 
    userId, 
    creatorId, 
    isAdmin, 
    isCreator, 
    canManage: isCreator || isAdmin,
    userEqualsCreator: userId === creatorId
  });
  
  // User can manage the event if they created it OR they're an admin
  return isCreator || isAdmin;
};
