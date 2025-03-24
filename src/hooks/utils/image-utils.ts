import { supabase } from '@/integrations/supabase/client';

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
        // Try to fetch the URL to verify it exists
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
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
      const filename = `${nonprofitId}.${ext}`;
      console.log(`Checking for banner image: ${filename}`);
      
      const { data } = supabase
        .storage
        .from('banner-images')
        .getPublicUrl(filename);
        
      if (data && data.publicUrl) {
        console.log(`Found potential banner URL: ${data.publicUrl}`);
        
        // Add cache-busting parameter to prevent stale images
        const cacheBustUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
        
        // Try to fetch the URL to verify it exists
        try {
          const response = await fetch(cacheBustUrl, { method: 'HEAD', cache: 'no-cache' });
          if (response.ok) {
            console.log(`✅ Verified banner image in storage for ${nonprofitId}: ${data.publicUrl}`);
            return data.publicUrl;
          } else {
            console.log(`❌ Banner image not accessible (status ${response.status}): ${data.publicUrl}`);
          }
        } catch (e) {
          console.log(`❌ Error accessing banner image: ${data.publicUrl}`, e);
        }
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
