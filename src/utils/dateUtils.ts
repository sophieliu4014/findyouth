/**
 * Utility functions for handling dates and times in the application
 */

/**
 * Checks if an event date has passed by more than 24 hours
 * @param eventDate - The date string of the event
 * @returns boolean indicating if the event has passed by more than 24 hours
 */
export const isEventPassed = (eventDate: string): boolean => {
  if (!eventDate) return false;
  
  try {
    const date = new Date(eventDate);
    const currentDate = new Date();
    
    // Add 24 hours (in milliseconds) to the event date
    const eventDatePlus24Hours = new Date(date.getTime() + (24 * 60 * 60 * 1000));
    
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
    if (isEventPassed(event.date)) {
      pastEvents.push(event);
    } else {
      activeEvents.push(event);
    }
  });
  
  return { activeEvents, pastEvents };
};
