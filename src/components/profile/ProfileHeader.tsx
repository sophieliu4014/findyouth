
import { useProfileHeader } from './header/useProfileHeader';
import { ProfileSection, StorageErrorAlert } from './header';

interface ProfileHeaderProps {
  user: any;
  refreshAuth: () => Promise<void>;
}

const ProfileHeader = ({ user, refreshAuth }: ProfileHeaderProps) => {
  const {
    isSaving,
    profileImage,
    setProfileImage,
    imagePreview,
    setImagePreview,
    imageLoadError,
    isVerifyingStorage,
    handleStorageRetry,
    handleSaveProfile,
    showSaveButton
  } = useProfileHeader(user, refreshAuth);

  const organizationName = user?.user_metadata?.organization_name || '';
  const userId = user?.id || '';
  const profileImageUrl = user?.user_metadata?.nonprofit_data?.profileImageUrl || null;

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 mb-8">
        {/* Storage verification and error messages */}
        <StorageErrorAlert
          isVerifyingStorage={isVerifyingStorage}
          bannerUploadError={null}
          handleStorageRetry={handleStorageRetry}
        />
      </div>
      
      {/* Profile image section */}
      <ProfileSection
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setProfileImage={setProfileImage}
        organizationName={organizationName}
        email={user?.email}
        profileImage={profileImage}
        isSaving={isSaving}
        handleSaveProfile={handleSaveProfile}
        showBannerSaveButton={showSaveButton}
      />
    </>
  );
};

export default ProfileHeader;
