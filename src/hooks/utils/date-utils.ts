
// Format date for display
export function formatEventDate(dateString: string): string {
  const eventDate = new Date(dateString);
  return eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
