
import React, { useRef, useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';

interface ProfileImageUploadProps {
  setProfileImage: (file: File | null) => void;
  setImageError: (error: string | null) => void;
  imageError: string | null;
}

const ProfileImageUpload = ({ 
  setProfileImage, 
  setImageError,
  imageError 
}: ProfileImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError(null);
    
    if (!file) {
      setProfileImage(null);
      setImagePreview(null);
      console.log("No file selected");
      return;
    }
    
    console.log("File selected:", file.name, "Type:", file.type, "Size:", (file.size / 1024).toFixed(2) + "KB");
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      setImageError("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }
    
    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      console.error("File too large:", file.size);
      setImageError("File size must be less than 2MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      console.log("Image preview created");
    };
    reader.readAsDataURL(file);
    setProfileImage(file);
    console.log("Profile image set for upload");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <FormLabel>Profile Picture*</FormLabel>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-primary">
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {imagePreview ? (
          <div className="flex flex-col items-center gap-4">
            <img src={imagePreview} alt="Profile preview" className="w-32 h-32 object-cover rounded-lg" />
            <Button type="button" variant="outline" onClick={triggerFileInput}>
              Change Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-center">
              <Button type="button" variant="outline" onClick={triggerFileInput}>
                Choose Image
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                PNG, JPG or GIF (max. 2MB)
              </p>
            </div>
          </div>
        )}
      </div>
      {imageError && (
        <div className="flex items-center mt-2 text-destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <p className="text-sm font-medium">{imageError}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
