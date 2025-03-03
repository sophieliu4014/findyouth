
import { create } from 'zustand';
import { AuthSession, AuthUser, getCurrentSession, getCurrentUser } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';

// Define the auth store type
interface AuthStore {
  user: AuthUser;
  session: AuthSession;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (user: AuthUser) => void;
  updateSession: (session: AuthSession) => void;
  refreshAuth: () => Promise<void>;
  clearAuth: () => void;
}

// Create the auth store
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  updateUser: (user) => set({ user, isAuthenticated: !!user }),
  updateSession: (session) => set({ session, isAuthenticated: !!session }),
  refreshAuth: async () => {
    try {
      set({ isLoading: true });
      const { user } = await getCurrentUser();
      const { session } = await getCurrentSession();
      set({ 
        user, 
        session, 
        isAuthenticated: !!user,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error refreshing auth:', error);
    }
  },
  clearAuth: () => set({ user: null, session: null, isAuthenticated: false })
}));

// Subscribe to auth changes
export const initializeAuthListener = () => {
  const { updateUser, updateSession, refreshAuth } = useAuthStore.getState();
  
  // Initial auth check
  refreshAuth();

  // Subscribe to auth changes
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    updateSession(session);
    
    if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
      updateUser(session?.user || null);
    } else if (event === 'SIGNED_OUT') {
      updateUser(null);
    }
  });
};
