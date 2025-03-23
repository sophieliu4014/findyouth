
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';

const Profile = () => {
  const { user, isAuthenticated, isLoading, refreshAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <ProfilePageLayout
      user={user}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      refreshAuth={refreshAuth}
    />
  );
};

export default Profile;
