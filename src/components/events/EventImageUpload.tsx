
import { useState, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface EventImageUploadProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

const EventImageUpload = ({ onImageSelect, previewUrl, setPreviewUrl }: EventImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle image file selection
  const handleFileSelect = (file: File) => {
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Pass file to parent component
    onImageSelect(file);
  };
  
  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
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
      handleFileSelect(files[0]);
    }
  };
  
  // Remove preview image
  const handleRemoveImage = () => {
    setPreviewUrl(null);
  };
  
  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  return (
    <div className="mt-2">
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Event preview" 
            className="w-full h-48 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
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
              Drag and drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Recommended: High-quality JPG or PNG, landscape orientation
            </p>
            <label className="bg-youth-blue hover:bg-youth-purple text-white py-2 px-4 rounded-md cursor-pointer transition-colors">
              Select Image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventImageUpload;
