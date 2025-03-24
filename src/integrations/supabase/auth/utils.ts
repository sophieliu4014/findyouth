
import { ImageErrorType } from "./types";

// Helper function to categorize image upload errors
export function categorizeImageError(error: any): ImageErrorType {
  if (!error) {
    return { type: 'unknown', message: 'Unknown error' };
  }
  
  const errorMessage = error.message || "Unknown error";
  
  if (errorMessage.includes('permission')) {
    return { type: 'storage_access', message: 'Permission denied when uploading.' };
  } else if (errorMessage.includes('413') || errorMessage.includes('too large')) {
    return { type: 'file_too_large', message: 'Image file is too large.' };
  } else if (errorMessage.includes('invalid format')) {
    return { type: 'invalid_format', message: 'Invalid file format.' };
  } else if (errorMessage.includes('network')) {
    return { type: 'network', message: 'Network error.' };
  } else if (errorMessage.includes('upload failed')) {
    return { type: 'upload_failed', message: 'Upload failed.' };
  } else {
    return { type: 'unknown', message: errorMessage };
  }
}
