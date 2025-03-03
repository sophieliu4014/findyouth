
import { useEffect } from 'react';
import { initializeAuthListener, useAuthStore } from '@/lib/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  useEffect(() => {
    // Initialize the auth listener
    const { data: authListener } = initializeAuthListener();

    // Cleanup on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
