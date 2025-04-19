
// Format date for display
export function formatEventDate(dateString: string, endDateString?: string): string {
  const eventDate = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  // If there's an end date and it's different from the start date
  if (endDateString && endDateString !== dateString) {
    const endDate = new Date(endDateString);
    const startFormatted = eventDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const endFormatted = endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startFormatted} to ${endFormatted}`;
  }
  
  return eventDate.toLocaleDateString('en-US', options);
}
