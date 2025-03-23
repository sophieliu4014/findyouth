
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, Camera, Save } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local preview when existingBannerUrl changes
  useEffect(() => {
    if (existingBannerUrl && existingBannerUrl !== imagePreview) {
      console.log("BannerImageUpload: Updating preview from existingBannerUrl:", existingBannerUrl);
      setImagePreview(existingBannerUrl);
    }
  }, [existingBannerUrl, imagePreview]);

  // Banner dimensions
  const BANNER_WIDTH = 1200;
  const BANNER_HEIGHT = 300;
  const ASPECT_RATIO = BANNER_WIDTH / BANNER_HEIGHT;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    setBannerImageError(null);
    
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
      return;
    }
    
    // Validate file size (3MB max)
    if (file.size > 3 * 1024 * 1024) {
      console.error("Banner file too large:", file.size);
      setBannerImageError("File size must be less than 3MB");
      return;
    }

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
        setBannerImageError(`Please upload an image with a width:height ratio close to ${BANNER_WIDTH}:${BANNER_HEIGHT} (current: ${img.width}:${img.height})`);
        return;
      }
      
      // If all validations pass
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log("Banner image preview created");
      };
      reader.readAsDataURL(file);
      setBannerImage(file);
      console.log("Banner image set for upload");
    };
    
    img.src = objectUrl;
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
        
        {imagePreview ? (
          <div className="flex flex-col items-center gap-4 w-full p-6">
            <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-lg">
              <img 
                src={imagePreview} 
                alt="Banner preview" 
                className="w-full h-full object-cover"
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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-500" />
            </div>
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
      {bannerImageError && (
        <div className="flex items-center mt-1 text-destructive">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <p className="text-xs font-medium">{bannerImageError}</p>
        </div>
      )}
    </div>
  );
};

export default BannerImageUpload;
