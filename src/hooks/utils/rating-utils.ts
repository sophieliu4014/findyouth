
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
