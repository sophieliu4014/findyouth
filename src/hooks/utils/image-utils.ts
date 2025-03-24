
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
  if (!url) return '';
  
  try {
    // Remove any existing timestamp parameters first
    let cleanUrl = url;
    if (url.includes('?t=')) {
      cleanUrl = url.split('?t=')[0];
    } else if (url.includes('&t=')) {
      const parts = url.split('&t=');
      cleanUrl = parts[0] + (parts[1].includes('&') ? '&' + parts[1].split('&').slice(1).join('&') : '');
    }
    
    // Add new timestamp
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}t=${Date.now()}`;
  } catch (error) {
    console.error("Error generating cache-busted URL:", error);
    return url; // Return original URL if error occurs
  }
}

// Check if a profile image exists in storage and get its URL
export async function getProfileImageFromStorage(nonprofitId: string): Promise<string | null> {
  if (!nonprofitId) {
    console.log("No nonprofit ID provided for profile image lookup");
    return null;
  }
  
  try {
    console.log(`Checking profile image for nonprofit ID: ${nonprofitId}`);
    
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
            method: 'HEAD',
            cache: 'no-store'
          });
          
          if (response.ok) {
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
        
        // Verify the image is accessible with a HEAD request
        try {
          const response = await fetch(data.publicUrl, { 
            method: 'HEAD',
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
          });
          
          if (response.ok) {
            console.log(`✅ Banner image verified for ${nonprofitId}: ${data.publicUrl}`);
            return data.publicUrl;
          } else {
            console.log(`❌ Banner image URL exists but returned status ${response.status}: ${data.publicUrl}`);
          }
        } catch (e) {
          console.log(`❌ Banner image URL exists but is not accessible: ${data.publicUrl}`, e);
        }
      }
    }
    
    console.log(`No accessible banner image found for ID: ${nonprofitId}`);
    return null;
  } catch (error) {
    console.error("Error getting banner image from storage:", error);
    return null;
  }
}

// Generate a deterministic fallback image URL
export function generateFallbackImageUrl(id: string): string {
  const idValue = id?.slice(-6).replace(/\D/g, '') || '';
  const idNumber = idValue ? (parseInt(idValue, 10) % 100) : 42;
  return `https://source.unsplash.com/random/300x300?profile=${idNumber}`;
}

// Generate a deterministic gradient based on a user identifier or profile image
export function generateDynamicGradient(profileImage: string | null, userId: string): string {
  // If no userId is provided, use a default gradient
  if (!userId) {
    return `bg-gradient-to-r from-youth-blue/20 to-youth-purple/20`;
  }

  // Generate a consistent number from userId for deterministic gradients
  const generateHashFromId = (id: string): number => {
    return id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  };
  
  const hash = generateHashFromId(userId);
  
  // Create a set of predefined gradients that look good
  const gradients = [
    'bg-gradient-to-r from-youth-blue/20 to-youth-purple/20',
    'bg-gradient-to-r from-youth-purple/20 to-youth-blue/20',
    'bg-gradient-to-r from-[#fdfcfb] to-[#e2d1c3]',
    'bg-gradient-to-r from-[#accbee] to-[#e7f0fd]',
    'bg-gradient-to-r from-[#d299c2] to-[#fef9d7]',
    'bg-gradient-to-r from-[#e6b980] to-[#eacda3]',
    'bg-gradient-to-r from-[#c1c161] to-[#d4d4b1]',
    'bg-gradient-to-r from-[#f5987a] to-[#f6edb2]',
    'bg-gradient-to-r from-[#ee9ca7] to-[#ffdde1]',
    'bg-gradient-to-r from-[#8fd3f4] to-[#84fab0]'
  ];
  
  // Select a gradient deterministically based on the hash
  const gradientIndex = hash % gradients.length;
  return gradients[gradientIndex];
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
