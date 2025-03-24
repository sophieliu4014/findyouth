
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import BannerImageUpload from '@/components/registration/BannerImageUpload';
import ImageError from './ImageError';
import { getCacheBustedUrl } from '@/hooks/utils/image-utils';

interface BannerImageSectionProps {
  isLoading: boolean;
  bannerImagePreview: string | null;
  handleImageError: () => void;
  imageLoadError: boolean;
  previewKey: number;
  bannerImage: File | null;
  setBannerImage: (file: File | null) => void;
  setBannerImageError: (error: string | null) => void;
  bannerImageError: string | null;
  handleSaveProfile: () => Promise<void>;
}

const BannerImageSection = ({
  isLoading,
  bannerImagePreview,
  handleImageError,
  imageLoadError,
  previewKey,
  bannerImage,
  setBannerImage,
  setBannerImageError,
  bannerImageError,
  handleSaveProfile
}: BannerImageSectionProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 mb-8">
      <div className="h-40 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-youth-blue/10 to-youth-purple/10">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
          </div>
        ) : bannerImagePreview && !imageLoadError ? (
          <img 
            src={bannerImagePreview} 
            alt="Banner" 
            className="w-full h-full object-cover"
            key={`banner-preview-${previewKey}`}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-youth-blue/5 via-youth-purple/5 to-youth-blue/5">
            {imageLoadError && <ImageError />}
          </div>
        )}
      </div>
      
      <div className="p-3 text-center">
        <BannerImageUpload 
          setBannerImage={setBannerImage}
          setBannerImageError={setBannerImageError}
          bannerImageError={bannerImageError}
          existingBannerUrl={bannerImagePreview}
          insideForm={false}
          fileSelected={!!bannerImage}
          onSaveClick={handleSaveProfile}
        />
      </div>
    </div>
  );
};

export default BannerImageSection;
