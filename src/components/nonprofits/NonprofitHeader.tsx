
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, ImageOff, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getBannerImageFromStorage, getCacheBustedUrl, generateDynamicGradient } from '@/hooks/utils/image-utils';
import { toast } from 'sonner';
import { UploadError } from '@/components/ui/upload-error';

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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Generate a gradient class based on the nonprofitId
  const gradientClasses = generateDynamicGradient(null, nonprofitId || '');
  
  // Try to get banner from storage if not provided
  useEffect(() => {
    const fetchBanner = async () => {
      setIsLoading(true);
      setImageError(false);
      setErrorDetails(null);
      console.log(`Fetching banner for ${title} with ID: ${nonprofitId}`);
      console.log(`Initial banner URL: ${bannerImageUrl}`);
      
      try {
        // If banner URL is provided directly, use it
        if (bannerImageUrl) {
          console.log(`Using provided banner URL: ${bannerImageUrl}`);
          // Force cache bust
          const cacheBustedUrl = getCacheBustedUrl(bannerImageUrl);
          console.log(`Cache-busted URL: ${cacheBustedUrl}`);
          
          // Verify the image is accessible with a quick HEAD request
          try {
            const response = await fetch(cacheBustedUrl, { 
              method: 'HEAD',
              cache: 'no-store',
              headers: { 'Cache-Control': 'no-cache' }
            });
            
            if (!response.ok) {
              console.warn(`Banner URL exists but returned status ${response.status}: ${cacheBustedUrl}`);
              throw new Error(`Image returned status ${response.status}`);
            }
            
            setFinalBannerUrl(cacheBustedUrl);
            setIsLoading(false);
            return;
          } catch (verifyError) {
            console.error("Error verifying banner URL:", verifyError);
            throw new Error(`Failed to verify banner URL: ${verifyError.message}`);
          }
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
          setErrorDetails("Banner image not found in storage");
        }
      } catch (error: any) {
        console.error("Error fetching banner:", error);
        setImageError(true);
        setErrorDetails(error.message || "Failed to load banner image");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBanner();
  }, [bannerImageUrl, nonprofitId, title, loadKey]);

  const handleImageError = () => {
    console.error("Failed to load banner image:", finalBannerUrl);
    setImageError(true);
    setErrorDetails("The image could not be displayed. It may be inaccessible or in an unsupported format.");
  };

  const handleRetryLoad = () => {
    console.log("Retrying banner image load");
    setLoadKey(Date.now()); // Force the useEffect to run again
    toast.info("Retrying to load banner image...");
  };

  return (
    <div className="relative">
      {/* Banner image with fallback */}
      <div className="w-full h-48 md:h-64 overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
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
          <div className={`w-full h-full flex items-center justify-center ${gradientClasses}`}>
            {imageError && (
              <div className="relative z-10 flex flex-col items-center text-white">
                <ImageOff className="h-8 w-8 mb-2" />
                <span className="text-sm">Banner unavailable</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetryLoad}
                  className="mt-2 bg-white/20 hover:bg-white/30 border-white/30 text-white"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Retry
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Error message if needed */}
      {imageError && errorDetails && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-2 mb-4 relative z-10">
          <UploadError 
            message="Failed to load banner image" 
            details={errorDetails}
            severity="warning"
            onRetry={handleRetryLoad}
          />
        </div>
      )}
      
      {/* Back button only - title has been removed */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative z-10 -mt-8 ml-2 md:ml-4">
          <Link to="/find-activities">
            <Button 
              variant="outline" 
              className="bg-white/70 hover:bg-white/90 backdrop-blur-sm shadow-sm border-transparent"
              rounded="full"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Activities
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NonprofitHeader;
