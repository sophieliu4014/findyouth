
import { useState, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface EventImageUploadProps {
  onImageSelect: (file: File) => void;
  onAdditionalImagesSelect?: (files: File[]) => void;
  previewUrl: string | null;
  additionalPreviewUrls?: string[];
  setPreviewUrl: (url: string | null) => void;
  setAdditionalPreviewUrls?: (urls: string[]) => void;
}

const EventImageUpload = ({ 
  onImageSelect, 
  onAdditionalImagesSelect,
  previewUrl, 
  additionalPreviewUrls = [],
  setPreviewUrl,
  setAdditionalPreviewUrls
}: EventImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle image file selection
  const handleFileSelect = (files: FileList) => {
    if (files.length === 0) return;
    
    // Always use first image as main image if no main image exists
    if (!previewUrl && files.length > 0) {
      const mainImageFile = files[0];
      const mainImageUrl = URL.createObjectURL(mainImageFile);
      setPreviewUrl(mainImageUrl);
      onImageSelect(mainImageFile);
      
      // Handle additional images if they exist
      if (files.length > 1) {
        const additionalFiles = Array.from(files).slice(1);
        const additionalUrls = additionalFiles.map(file => URL.createObjectURL(file));
        setAdditionalPreviewUrls?.(additionalUrls);
        onAdditionalImagesSelect?.(additionalFiles);
      }
    } else {
      // If main image exists, all new images are additional
      const additionalFiles = Array.from(files);
      const additionalUrls = additionalFiles.map(file => URL.createObjectURL(file));
      setAdditionalPreviewUrls?.([...(additionalPreviewUrls || []), ...additionalUrls]);
      onAdditionalImagesSelect?.(additionalFiles);
    }
  };
  
  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };
  
  // Remove main preview image
  const handleRemoveMainImage = () => {
    setPreviewUrl(null);
  };

  // Remove additional preview image
  const handleRemoveAdditionalImage = (index: number) => {
    if (additionalPreviewUrls && setAdditionalPreviewUrls) {
      const newUrls = [...additionalPreviewUrls];
      newUrls.splice(index, 1);
      setAdditionalPreviewUrls(newUrls);
    }
  };
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      additionalPreviewUrls?.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrl, additionalPreviewUrls]);
  
  return (
    <div className="mt-2 space-y-4">
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Main event preview" 
            className="w-full h-48 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveMainImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center ${
            isDragging ? 'border-youth-purple bg-youth-purple/5' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <ImagePlus className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop images here, or click to select
            </p>
            <p className="text-xs text-gray-500 mb-3">
              First image will be the main event image
            </p>
            <label className="bg-youth-blue hover:bg-youth-purple text-white py-2 px-4 rounded-md cursor-pointer transition-colors">
              Select Images
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>
      )}

      {/* Additional Images Grid */}
      {additionalPreviewUrls && additionalPreviewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {additionalPreviewUrls.map((url, index) => (
            <div key={url} className="relative">
              <img 
                src={url} 
                alt={`Additional event image ${index + 1}`} 
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveAdditionalImage(index)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventImageUpload;
