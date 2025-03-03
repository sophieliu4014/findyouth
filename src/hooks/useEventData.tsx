
// Re-export hooks for backward compatibility
import useEventData from './useEventData';
import useOrganizationEvents from './useOrganizationEvents';
import useCauseEvents from './useCauseEvents';
import { Event } from './event-types';

export { useEventData as default, useOrganizationEvents, useCauseEvents, Event };
