
import { Loader2 } from 'lucide-react';
import { UploadError } from '@/components/ui/upload-error';

interface StorageErrorAlertProps {
  isVerifyingStorage: boolean;
  bannerUploadError: { message: string; details?: string } | null;
  handleStorageRetry: () => Promise<void>;
}

const StorageErrorAlert = ({ 
  isVerifyingStorage, 
  bannerUploadError, 
  handleStorageRetry 
}: StorageErrorAlertProps) => {
  return (
    <>
      {isVerifyingStorage && (
        <div className="bg-blue-50 p-2 text-blue-600 text-sm flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Verifying storage access...
        </div>
      )}
      
      {bannerUploadError && (
        <div className="px-4 pt-3">
          <UploadError
            message={bannerUploadError.message}
            details={bannerUploadError.details}
            severity="error"
            onRetry={handleStorageRetry}
          />
        </div>
      )}
    </>
  );
};

export default StorageErrorAlert;
