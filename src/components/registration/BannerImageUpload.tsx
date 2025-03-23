
import React, { useRef, useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';

interface BannerImageUploadProps {
  setBannerImage: (file: File | null) => void;
  setBannerImageError: (error: string | null) => void;
  bannerImageError: string | null;
}

const BannerImageUpload = ({ 
  setBannerImage, 
  setBannerImageError,
  bannerImageError 
}: BannerImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setImagePreview(null);
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

  return (
    <div className="space-y-2">
      <FormLabel>Banner Image (Optional)</FormLabel>
      <div 
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : bannerImageError 
              ? 'border-destructive bg-destructive/5' 
              : 'border-gray-300 hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ height: '150px', width: '100%' }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {imagePreview ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative w-full h-24 overflow-hidden rounded-lg">
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
                className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
              >
                Change
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-center">
              <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                Choose Banner Image
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                PNG or JPG (1200×300 recommended, max. 3MB)
              </p>
            </div>
          </div>
        )}
      </div>
      {bannerImageError && (
        <div className="flex items-center mt-1 text-destructive">
          <AlertCircle className="h-4 w-4 mr-1" />
          <p className="text-xs font-medium">{bannerImageError}</p>
        </div>
      )}
    </div>
  );
};

export default BannerImageUpload;
