
import { supabase } from '@/integrations/supabase/client';

// Check if the current user has admin privileges
export const checkAdminStatus = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;
  
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
