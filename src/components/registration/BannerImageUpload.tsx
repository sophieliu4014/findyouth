
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, Camera, Save, ImageOff, Loader2 } from 'lucide-react';
import { getCacheBustedUrl, verifyStorageAccess } from '@/hooks/utils/image-utils';
import { UploadError } from '@/components/ui/upload-error';
import { toast } from 'sonner';

interface BannerImageUploadProps {
  setBannerImage: (file: File | null) => void;
  setBannerImageError: (error: string | null) => void;
  bannerImageError: string | null;
  existingBannerUrl?: string | null;
  insideForm?: boolean;
  fileSelected?: boolean;
  onSaveClick?: () => void;
}

const BannerImageUpload = ({ 
  setBannerImage, 
  setBannerImageError,
  bannerImageError,
  existingBannerUrl,
  insideForm = false,
  fileSelected = false,
  onSaveClick
}: BannerImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(existingBannerUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [previewKey, setPreviewKey] = useState<number>(Date.now());
  const [isVerifyingStorage, setIsVerifyingStorage] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local preview when existingBannerUrl changes
  useEffect(() => {
    if (existingBannerUrl && existingBannerUrl !== imagePreview) {
      console.log("BannerImageUpload: Updating preview from existingBannerUrl:", existingBannerUrl);
      const cacheBustedUrl = getCacheBustedUrl(existingBannerUrl);
      setImagePreview(cacheBustedUrl);
      setImageError(false);
    }
  }, [existingBannerUrl, imagePreview]);

  // Banner dimensions
  const BANNER_WIDTH = 1200;
  const BANNER_HEIGHT = 300;
  const ASPECT_RATIO = BANNER_WIDTH / BANNER_HEIGHT;
  
  // Verify storage access on mount
  useEffect(() => {
    const checkStorageAccess = async () => {
      if (insideForm) {
        setIsVerifyingStorage(true);
        try {
          const hasAccess = await verifyStorageAccess();
          if (!hasAccess) {
            console.warn("Storage access verification failed");
            setErrorDetails("Storage access could not be verified. Uploads may not work correctly.");
          } else {
            console.log("Storage access verified successfully");
            setErrorDetails(null);
          }
        } catch (error) {
          console.error("Error verifying storage access:", error);
        } finally {
          setIsVerifyingStorage(false);
        }
      }
    };
    
    checkStorageAccess();
  }, [insideForm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    setBannerImageError(null);
    setImageError(false);
    setErrorDetails(null);
    setUploadProgress(null);
    
    if (!file) {
      setBannerImage(null);
      setImagePreview(existingBannerUrl || null);
      console.log("No banner file selected");
      return;
    }
    
    console.log("Banner file selected:", file.name, "Type:", file.type, "Size:", (file.size / 1024).toFixed(2) + "KB");
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      console.error("Invalid file type for banner:", file.type);
      setBannerImageError("Please upload a valid image file (JPEG or PNG)");
      setErrorDetails(`Received: ${file.type}. Supported types: JPEG, PNG`);
      return;
    }
    
    // Validate file size (3MB max)
    if (file.size > 3 * 1024 * 1024) {
      console.error("Banner file too large:", file.size);
      setBannerImageError("File size must be less than 3MB");
      setErrorDetails(`File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum allowed: 3MB`);
      return;
    }

    // Show upload progress simulation
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        return prev >= 90 ? 90 : prev + 10;
      });
    }, 200);

    // Check image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const imgAspectRatio = img.width / img.height;
      
      // Allow some flexibility in aspect ratio (±10%)
      const aspectRatioTolerance = 0.1;
      const isAspectRatioValid = 
        Math.abs(imgAspectRatio - ASPECT_RATIO) / ASPECT_RATIO <= aspectRatioTolerance;
      
      if (!isAspectRatioValid) {
        clearInterval(progressInterval);
        setUploadProgress(null);
        setBannerImageError(`Please upload an image with a width:height ratio close to ${BANNER_WIDTH}:${BANNER_HEIGHT} (current: ${img.width}:${img.height})`);
        setErrorDetails(`Your image: ${img.width}×${img.height}px (ratio: ${imgAspectRatio.toFixed(2)}). Recommended: ratio close to ${ASPECT_RATIO.toFixed(2)}`);
        return;
      }
      
      // If all validations pass
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log("Banner image preview created");
        // Reset any previous image errors
        setImageError(false);
        setPreviewKey(Date.now());
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Auto-hide progress after 1 second
        setTimeout(() => {
          setUploadProgress(null);
        }, 1000);
      };
      reader.readAsDataURL(file);
      setBannerImage(file);
      console.log("Banner image set for upload");
    };
    
    img.onerror = () => {
      clearInterval(progressInterval);
      setUploadProgress(null);
      setBannerImageError("Failed to load image. The file may be corrupted.");
      setErrorDetails("The selected file could not be loaded as an image. Please try another file.");
      console.error("Failed to load banner image");
    };
    
    img.src = objectUrl;
  };

  const handleImageError = () => {
    console.error("Failed to load banner preview image");
    setImageError(true);
  };

  const handleRetry = () => {
    if (isVerifyingStorage) return;
    
    console.log("Retrying storage verification...");
    setIsVerifyingStorage(true);
    
    verifyStorageAccess()
      .then(hasAccess => {
        if (hasAccess) {
          console.log("Storage access verified on retry");
          setErrorDetails(null);
          toast.success("Storage access verified successfully");
        } else {
          console.warn("Storage access verification failed on retry");
          setErrorDetails("Storage access still unavailable. Please try again later or contact support.");
          toast.error("Storage access still unavailable");
        }
      })
      .catch(error => {
        console.error("Error verifying storage access on retry:", error);
        setErrorDetails(`Storage verification error: ${error.message}`);
      })
      .finally(() => {
        setIsVerifyingStorage(false);
      });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // In the Profile component, we want to display just a button rather than the full upload area
  if (!insideForm) {
    return (
      <Button
        type="button"
        variant={fileSelected ? "youth-blue" : "secondary"}
        size="sm"
        onClick={fileSelected && onSaveClick ? onSaveClick : triggerFileInput}
        className={fileSelected ? "bg-youth-blue hover:bg-youth-purple text-white border border-transparent mx-auto" : "bg-white/80 hover:bg-white text-youth-charcoal border border-gray-200 mx-auto"}
      >
        {fileSelected ? (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Banner
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            Change Banner
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </Button>
    );
  }

  // In registration/other contexts, display the full upload area
  return (
    <div className="space-y-3 w-full">
      {/* Use a regular label when outside a form context */}
      <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Banner Image (Optional)
      </label>
      
      {/* Storage access checking indicator */}
      {isVerifyingStorage && (
        <div className="flex items-center text-sm text-blue-600 mb-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Verifying storage access...
        </div>
      )}
      
      {/* More detailed error with retry option */}
      {errorDetails && !bannerImageError && (
        <UploadError
          message="Storage configuration issue detected"
          details={errorDetails}
          severity="warning"
          onRetry={handleRetry}
        />
      )}
      
      <div 
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors w-full ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : bannerImageError 
              ? 'border-destructive bg-destructive/5' 
              : 'border-gray-300 hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ minHeight: '220px' }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Progress indicator for upload */}
        {uploadProgress !== null && (
          <div className="absolute top-3 left-0 right-0 px-4">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-youth-blue h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">{uploadProgress}%</span>
            </div>
          </div>
        )}
        
        {imagePreview && !imageError ? (
          <div className="flex flex-col items-center gap-4 w-full p-6">
            <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-lg">
              <img 
                src={imagePreview} 
                alt="Banner preview" 
                className="w-full h-full object-cover"
                key={`upload-preview-${previewKey}`}
                onError={handleImageError}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={triggerFileInput}
                className="absolute bottom-3 right-3 bg-white/90 hover:bg-white shadow-sm"
              >
                Change
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-10 px-6 w-full h-full">
            {imageError ? (
              <div className="flex flex-col items-center text-destructive">
                <ImageOff className="h-8 w-8 mb-2" />
                <span className="text-sm">Failed to load image</span>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-500" />
              </div>
            )}
            <div className="text-center">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={triggerFileInput}
                className="mb-3"
              >
                Choose Banner Image
              </Button>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                PNG or JPG (1200×300 recommended, max. 3MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Detailed error message with more context */}
      {bannerImageError && (
        <UploadError 
          message={bannerImageError}
          details={errorDetails || "Please check file format, size, and dimensions."}
          severity="error"
          onRetry={triggerFileInput}
        />
      )}
    </div>
  );
};

export default BannerImageUpload;
