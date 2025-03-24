
import { supabase } from '@/integrations/supabase/client';

// Error categories for image operations
export enum ImageErrorType {
  INVALID_URL = 'invalid_url',
  UPLOAD_FAILED = 'upload_failed',
  STORAGE_ACCESS = 'storage_access',
  FILE_TOO_LARGE = 'file_too_large',
  INVALID_FORMAT = 'invalid_format',
  NOT_FOUND = 'not_found',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

// Error response type for image operations
export interface ImageErrorResponse {
  type: ImageErrorType;
  message: string;
  details?: any;
}

// Validate image URL format
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  try {
    // Check if it's a URL with http or https protocol, or a Supabase storage URL
    return url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.includes('supabase.co/storage/v1/object/public/');
  } catch (e) {
    return false;
  }
}

// Generate a cache-busting URL to prevent stale images
export function getCacheBustedUrl(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

// Check if a profile image exists in storage and get its URL
export async function getProfileImageFromStorage(nonprofitId: string): Promise<string | null> {
  try {
    // Common image extensions to check
    const extensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    for (const ext of extensions) {
      const { data } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl(`${nonprofitId}.${ext}`);
        
      if (data && data.publicUrl) {
        // Use a GET request with range to verify existence
        try {
          const response = await fetch(data.publicUrl, { 
            method: 'GET',
            headers: { 'Range': 'bytes=0-1' }, // Only request the first bytes
            cache: 'no-store'
          });
          
          if (response.ok || response.status === 206) {
            console.log(`Found profile image in storage for ${nonprofitId}: ${data.publicUrl}`);
            return data.publicUrl;
          }
        } catch (e) {
          console.log(`URL exists but image not accessible: ${data.publicUrl}`);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting profile image from storage:", error);
    return null;
  }
}

// Check if a banner image exists in storage and get its URL
export async function getBannerImageFromStorage(nonprofitId: string): Promise<string | null> {
  try {
    if (!nonprofitId) {
      console.log("No nonprofit ID provided for banner image lookup");
      return null;
    }
    
    console.log(`Checking banner image for nonprofit ID: ${nonprofitId}`);
    
    // Common image extensions to check
    const extensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    for (const ext of extensions) {
      // Use profile-images bucket with banner- prefix
      const filename = `banner-${nonprofitId}.${ext}`;
      console.log(`Checking for banner image: ${filename}`);
      
      const { data } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl(filename);
        
      if (data && data.publicUrl) {
        console.log(`Found potential banner URL: ${data.publicUrl}`);
        
        // Skip verification - trust that the image exists if we have a URL
        console.log(`✅ Using banner image for ${nonprofitId} without verification: ${data.publicUrl}`);
        return data.publicUrl;
      }
    }
    
    console.log(`No banner image found for ID: ${nonprofitId}`);
    return null;
  } catch (error) {
    console.error("Error getting banner image from storage:", error);
    return null;
  }
}

// Generate a deterministic fallback image URL
export function generateFallbackImageUrl(id: string): string {
  const idValue = id.slice(-6).replace(/\D/g, '');
  const idNumber = idValue ? (parseInt(idValue, 10) % 100) : 42;
  return `https://source.unsplash.com/random/300x300?profile=${idNumber}`;
}

// Helper to categorize image upload errors
export function categorizeImageError(error: any): ImageErrorResponse {
  console.error("Categorizing image error:", error);
  
  // Storage-specific errors
  if (error?.message?.includes('storage') || error?.error?.includes('storage')) {
    return {
      type: ImageErrorType.STORAGE_ACCESS,
      message: 'Unable to access storage. Permission denied or storage not available.',
      details: error
    };
  }
  
  // Network errors
  if (error instanceof TypeError && error.message.includes('network')) {
    return {
      type: ImageErrorType.NETWORK,
      message: 'Network error. Please check your connection and try again.',
      details: error
    };
  }
  
  // File-specific errors
  if (error?.message?.includes('file size')) {
    return {
      type: ImageErrorType.FILE_TOO_LARGE,
      message: 'File is too large. Please select a smaller image (max 3MB).',
      details: error
    };
  }
  
  if (error?.message?.includes('file type') || error?.message?.includes('not supported')) {
    return {
      type: ImageErrorType.INVALID_FORMAT,
      message: 'File format not supported. Please use JPEG or PNG images.',
      details: error
    };
  }
  
  // URL-specific errors
  if (error?.message?.includes('URL') || error?.message?.includes('url')) {
    return {
      type: ImageErrorType.INVALID_URL,
      message: 'Invalid image URL format.',
      details: error
    };
  }
  
  // Generic upload errors
  if (error?.message?.includes('upload') || error?.statusCode === 413 || error?.code === 'ECONNABORTED') {
    return {
      type: ImageErrorType.UPLOAD_FAILED,
      message: 'Upload failed. Please try again with a smaller image or check your connection.',
      details: error
    };
  }
  
  // Not found errors
  if (error?.statusCode === 404 || error?.message?.includes('not found')) {
    return {
      type: ImageErrorType.NOT_FOUND,
      message: 'Image not found in storage.',
      details: error
    };
  }
  
  // Default case for unknown errors
  return {
    type: ImageErrorType.UNKNOWN,
    message: error?.message || 'An unknown error occurred with the image.',
    details: error
  };
}

// Verify storage access for testing/debugging
export async function verifyStorageAccess(): Promise<boolean> {
  try {
    // Try to list the first few items in the profile-images bucket
    const { data, error } = await supabase.storage
      .from('profile-images')
      .list('', {
        limit: 1,
      });
    
    if (error) {
      console.error("Storage access verification failed:", error);
      return false;
    }
    
    console.log("Storage access verification successful:", data);
    return true;
  } catch (error) {
    console.error("Error verifying storage access:", error);
    return false;
  }
}
