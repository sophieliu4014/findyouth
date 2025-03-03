
import { useEffect } from 'react';
import { initializeAuthListener, useAuthStore } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const refreshAuth = useAuthStore((state) => state.refreshAuth);
  
  useEffect(() => {
    // Initialize auth state
    refreshAuth();
    
    // Initialize the auth listener
    const { data: authListener } = initializeAuthListener();

    // Handle auth changes from other tabs/windows
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      authListener?.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshAuth]);

  return <>{children}</>;
};

export default AuthProvider;
