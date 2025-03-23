
// Calculate average rating from reviews
export function calculateAverageRating(reviewsData: any[] | null): number {
  const defaultRating = 4;
  
  if (!reviewsData || reviewsData.length === 0) {
    return defaultRating;
  }
  
  const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
  return Math.round(sum / reviewsData.length);
}
