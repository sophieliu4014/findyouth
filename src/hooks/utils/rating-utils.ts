
// Calculate average rating from reviews
export function calculateAverageRating(reviewsData: any[] | null): number {
  const defaultRating = 4;
  
  if (!reviewsData || reviewsData.length === 0) {
    return defaultRating;
  }
  
  const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviewsData.length) * 10) / 10; // Round to 1 decimal place
}

// Format rating to display (e.g., "4.5" or "4" if it's a whole number)
export function formatRating(rating: number): string {
  return rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
}

// Get anonymous user identifier for ratings
export function getStoredAnonymousId(): string | null {
  return localStorage.getItem('anonymous_user_id');
}

// Create and store anonymous user identifier if not exists
export function ensureAnonymousId(): string {
  let anonymousId = localStorage.getItem('anonymous_user_id');
  
  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
    localStorage.setItem('anonymous_user_id', anonymousId);
    console.log('Created new anonymous ID:', anonymousId);
  } else {
    console.log('Using existing anonymous ID:', anonymousId);
  }
  
  return anonymousId;
}
