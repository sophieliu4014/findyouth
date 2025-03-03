
// This file is now just a re-export file to maintain backward compatibility
import { Event } from './event-types';
import { useEventData } from './useEventData';
import { useOrganizationEvents } from './useOrganizationEvents';
import { useCauseEvents } from './useCauseEvents';

export { 
  Event,
  useEventData,
  useOrganizationEvents,
  useCauseEvents
};

export default useEventData;
