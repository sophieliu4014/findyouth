
/**
 * Utility functions for handling dates and times in the application
 */

/**
 * Checks if an event date has already passed
 * @param eventDate - The date string of the event
 * @returns boolean indicating if the event has passed
 */
export const isEventPassed = (eventDate: string): boolean => {
  if (!eventDate) return false;
  
  // Try to extract date information from the formatted date string
  // Format is typically "Month Day, Year at Time AM/PM"
  try {
    // Convert the formatted event date string back to a Date object
    const date = new Date(eventDate);
    
    // Compare with current date
    return date < new Date();
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
