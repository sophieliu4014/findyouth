
/**
 * Utility functions for handling dates and times in the application
 */

/**
 * Checks if an event has passed by more than 24 hours considering its end date
 * @param eventDate - The start date string of the event
 * @param endDate - Optional end date string of the event
 * @returns boolean indicating if the event has passed by more than 24 hours
 */
export const isEventPassed = (eventDate: string, endDate?: string | null): boolean => {
  if (!eventDate) return false;
  
  try {
    const dateToCheck = endDate ? new Date(endDate) : new Date(eventDate);
    const currentDate = new Date();
    
    // Add 24 hours (in milliseconds) to the event date
    const eventDatePlus24Hours = new Date(dateToCheck.getTime() + (24 * 60 * 60 * 1000));
    
    // Compare with current date
    return eventDatePlus24Hours < currentDate;
  } catch (error) {
    console.error("Error parsing event date:", error);
    return false;
  }
};

/**
 * Divides events into active and past events
 * @param events - Array of events to categorize
 * @returns Object containing activeEvents and pastEvents arrays
 */
export const categorizeEvents = (events: any[]) => {
  const activeEvents: any[] = [];
  const pastEvents: any[] = [];
  
  events.forEach(event => {
    if (isEventPassed(event.date, event.end_date)) {
      pastEvents.push(event);
    } else {
      activeEvents.push(event);
    }
  });
  
  return { activeEvents, pastEvents };
};
