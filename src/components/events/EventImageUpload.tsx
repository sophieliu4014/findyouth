
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface EventImageUploadProps {
  onImageSelect: (file: File | null) => void;
  initialImage?: string;
}

const EventImageUpload = ({ onImageSelect, initialImage }: EventImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }
    
    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    onImageSelect(file);
  };
  
  const clearImage = () => {
    setImagePreview(null);
    onImageSelect(null);
  };
  
  return (
    <div className="w-full">
      {imagePreview ? (
        <div className="relative">
          <img 
            src={imagePreview} 
            alt="Event" 
            className="w-full h-48 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label 
          htmlFor="event-image-upload" 
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-8 w-8 text-youth-blue mb-2" />
            <p className="text-sm text-youth-charcoal/70">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-youth-charcoal/60">
              PNG, JPG or WEBP (max. 2MB)
            </p>
          </div>
          <input
            id="event-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default EventImageUpload;
