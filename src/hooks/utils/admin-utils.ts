
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
  
  try {
    console.log('Checking admin status via admin_users table for user:', userId);
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If error is not found, it's not an admin
      if (error.code === 'PGRST116') {
        console.log('User is not an admin:', userId);
        return false;
      }
      
      console.error('Error checking admin status:', error);
      return false;
    }
    
    const isAdmin = !!data;
    console.log('Admin check result for', userId, ':', isAdmin);
    return isAdmin;
  } catch (error) {
    console.error('Error in checkAdminStatus:', error);
    return false;
  }
};

/**
 * Check if a user can manage a specific event (is creator or admin)
 * Uses the same logic as the database RLS policies
 * @param userId Current user ID
 * @param creatorId Event creator's ID 
 * @param isAdmin Whether the user is an admin
 * @returns Boolean indicating if the user can manage this event
 */
export const canManageEvent = (userId: string | undefined, creatorId: string | undefined, isAdmin: boolean): boolean => {
  if (!userId) {
    console.log('Missing userId for permission check');
    return false;
  }
  
  const isCreator = userId === creatorId;
  console.log('Permission check details:', { 
    userId, 
    creatorId, 
    isAdmin, 
    isCreator, 
    canManage: isCreator || isAdmin
  });
  
  // User can manage the event if they created it OR they're an admin
  return isCreator || isAdmin;
};

/**
 * Server-side check if a user can manage an event
 * Uses the same database function as RLS
 * @param userId Current user ID
 * @param eventId Event ID to check
 * @returns Promise resolving to boolean indicating if user can manage event
 */
export const canManageEventServer = async (userId: string | undefined, eventId: string | undefined): Promise<boolean> => {
  if (!userId || !eventId) {
    console.log('Missing userId or eventId for server permission check');
    return false;
  }
  
  try {
    console.log('Checking event management permission via RPC for user:', userId, 'on event:', eventId);
    const { data, error } = await supabase.rpc('can_manage_event', { 
      user_id: userId,
      event_id: eventId
    });
    
    if (error) {
      console.error('Error checking event management permission:', error);
      return false;
    }
    
    console.log('Event management permission check result:', data);
    return data === true;
  } catch (error) {
    console.error('Error in canManageEventServer:', error);
    return false;
  }
};
