
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getBannerImageFromStorage } from '@/hooks/utils/image-utils';

interface NonprofitHeaderProps {
  title: string;
  bannerImageUrl?: string | null;
  nonprofitId?: string;
}

const NonprofitHeader = ({ title, bannerImageUrl, nonprofitId }: NonprofitHeaderProps) => {
  const [finalBannerUrl, setFinalBannerUrl] = useState<string | null>(bannerImageUrl || null);
  const [isLoading, setIsLoading] = useState<boolean>(!bannerImageUrl && !!nonprofitId);
  
  // Try to get banner from storage if not provided
  useEffect(() => {
    if (!bannerImageUrl && nonprofitId) {
      const fetchBanner = async () => {
        try {
          const storageUrl = await getBannerImageFromStorage(nonprofitId);
          if (storageUrl) {
            console.log(`Found banner in storage for ${nonprofitId}: ${storageUrl}`);
            setFinalBannerUrl(storageUrl);
          }
        } catch (error) {
          console.error("Error fetching banner from storage:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchBanner();
    } else {
      setIsLoading(false);
    }
  }, [bannerImageUrl, nonprofitId]);

  return (
    <div className="relative">
      {/* Banner image with fallback */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-youth-blue to-youth-purple overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : finalBannerUrl ? (
          <img 
            src={finalBannerUrl} 
            alt={`${title} banner`} 
            className="w-full h-full object-cover"
            key={finalBannerUrl} // Force image refresh when URL changes
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-youth-blue to-youth-purple opacity-80"></div>
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
