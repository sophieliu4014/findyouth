
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getBannerImageFromStorage, getCacheBustedUrl } from '@/hooks/utils/image-utils';
import { toast } from 'sonner';

interface NonprofitHeaderProps {
  title: string;
  bannerImageUrl?: string | null;
  nonprofitId?: string;
}

const NonprofitHeader = ({ title, bannerImageUrl, nonprofitId }: NonprofitHeaderProps) => {
  const [finalBannerUrl, setFinalBannerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);
  const [loadKey, setLoadKey] = useState<number>(Date.now());
  
  // Try to get banner from storage if not provided
  useEffect(() => {
    const fetchBanner = async () => {
      setIsLoading(true);
      setImageError(false);
      console.log(`Fetching banner for ${title} with ID: ${nonprofitId}`);
      console.log(`Initial banner URL: ${bannerImageUrl}`);
      
      try {
        // If banner URL is provided directly, use it
        if (bannerImageUrl) {
          console.log(`Using provided banner URL: ${bannerImageUrl}`);
          // Force cache bust
          const cacheBustedUrl = getCacheBustedUrl(bannerImageUrl);
          console.log(`Cache-busted URL: ${cacheBustedUrl}`);
          setFinalBannerUrl(cacheBustedUrl);
          setIsLoading(false);
          return;
        }
        
        // If no direct URL but we have an ID, check storage
        if (nonprofitId) {
          console.log(`Checking storage with ID: ${nonprofitId}`);
          const storageUrl = await getBannerImageFromStorage(nonprofitId);
          
          if (storageUrl) {
            console.log(`Found banner in storage: ${storageUrl}`);
            // Force cache bust
            const cacheBustedUrl = getCacheBustedUrl(storageUrl);
            console.log(`Cache-busted URL: ${cacheBustedUrl}`);
            setFinalBannerUrl(cacheBustedUrl);
            setIsLoading(false);
            return;
          }
          
          console.log(`No banner found in storage for ${nonprofitId}`);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBanner();
  }, [bannerImageUrl, nonprofitId, title, loadKey]);

  const handleImageError = () => {
    console.error("Failed to load banner image:", finalBannerUrl);
    setImageError(true);
    
    // If the image fails to load, try refreshing with a new cache-bust
    if (finalBannerUrl && !imageError) {
      console.log("Retrying image load with new cache-bust parameter");
      setTimeout(() => {
        setLoadKey(Date.now());
      }, 500);
    }
  };

  return (
    <div className="relative">
      {/* Banner image with fallback */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-youth-blue to-youth-purple overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : finalBannerUrl && !imageError ? (
          <img 
            src={finalBannerUrl} 
            alt={`${title} banner`} 
            className="w-full h-full object-cover"
            key={`banner-${loadKey}`} // Force image refresh when URL changes
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-youth-blue to-youth-purple opacity-80"></div>
            {imageError && (
              <div className="relative z-10 flex flex-col items-center text-white">
                <ImageOff className="h-8 w-8 mb-2" />
                <span className="text-sm">Banner unavailable</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Back button and title */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between -mt-8 relative z-10">
          <Link to="/find-activities">
            <Button variant="outline" className="bg-white shadow-sm mb-4 md:mb-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Activities
            </Button>
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold bg-white px-6 py-3 rounded-lg shadow-sm">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default NonprofitHeader;
