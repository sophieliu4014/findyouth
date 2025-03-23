
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileImageSectionProps {
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  setProfileImage: (file: File | null) => void;
  organizationName: string;
  email?: string;
}

const ProfileImageSection = ({
  imagePreview,
  setImagePreview,
  setProfileImage,
  organizationName,
  email
}: ProfileImageSectionProps) => {
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setProfileImage(file);
  };
  
  return (
    <>
      <div className="relative w-32 h-32 mx-auto mb-4">
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Profile" 
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-youth-blue/10 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-youth-blue">
              {organizationName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <label 
          htmlFor="profile-image-upload" 
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 border border-gray-200"
        >
          <Upload className="h-4 w-4 text-youth-blue" />
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>
      <h2 className="text-xl font-semibold">{organizationName}</h2>
      {email && <p className="text-youth-charcoal/70">{email}</p>}
      <p className="text-xs text-youth-charcoal/50 mt-2">
        Click the upload icon to change your profile picture
      </p>
    </>
  );
};

export default ProfileImageSection;
