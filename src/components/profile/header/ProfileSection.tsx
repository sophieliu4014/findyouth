
import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileImageSection from '../ProfileImageSection';

interface ProfileSectionProps {
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  setProfileImage: (file: File | null) => void;
  organizationName: string;
  email?: string;
  profileImage: File | null;
  isSaving: boolean;
  handleSaveProfile: () => Promise<void>;
  showBannerSaveButton: boolean;
}

const ProfileSection = ({
  imagePreview,
  setImagePreview,
  setProfileImage,
  organizationName,
  email,
  profileImage,
  isSaving,
  handleSaveProfile,
  showBannerSaveButton
}: ProfileSectionProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-8">
      <div className="text-center">
        <ProfileImageSection 
          imagePreview={imagePreview} 
          setImagePreview={setImagePreview}
          setProfileImage={setProfileImage}
          organizationName={organizationName}
          email={email}
        />
        
        {showBannerSaveButton && !profileImage && (
          <Button 
            onClick={handleSaveProfile}
            className="mt-4 bg-youth-blue hover:bg-youth-purple transition-colors"
            disabled={isSaving}
            size="sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Image Changes
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
