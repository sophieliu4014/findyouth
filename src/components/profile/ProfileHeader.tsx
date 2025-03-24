
import { useProfileHeader } from './header/useProfileHeader';
import { BannerImageSection, ProfileSection, StorageErrorAlert } from './header';

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
    bannerImage,
    setBannerImage,
    bannerImageError,
    setBannerImageError,
    bannerUploadError,
    bannerImagePreview,
    isLoadingBanner,
    imageLoadError,
    isVerifyingStorage,
    previewKey,
    handleImageError,
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
          bannerUploadError={bannerUploadError}
          handleStorageRetry={handleStorageRetry}
        />
        
        {/* Banner image section */}
        <BannerImageSection
          isLoading={isLoadingBanner}
          bannerImagePreview={bannerImagePreview}
          handleImageError={handleImageError}
          imageLoadError={imageLoadError}
          previewKey={previewKey}
          bannerImage={bannerImage}
          setBannerImage={setBannerImage}
          setBannerImageError={setBannerImageError}
          bannerImageError={bannerImageError}
          handleSaveProfile={handleSaveProfile}
          userId={userId}
          profileImageUrl={profileImageUrl}
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
