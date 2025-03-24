
import { ImageOff } from 'lucide-react';

interface ImageErrorProps {
  message?: string;
  submessage?: string;
}

const ImageError = ({ message = "Banner image not available", submessage = "Try refreshing or uploading a new image" }: ImageErrorProps) => {
  return (
    <div className="flex flex-col items-center text-youth-blue/70">
      <ImageOff className="h-8 w-8 mb-2" />
      <span className="text-sm">{message}</span>
      <span className="text-xs text-gray-500 mt-1">{submessage}</span>
    </div>
  );
};

export default ImageError;
