
import { z } from 'zod';
import { causeAreas } from '../form/filters/FilterConstants';

// Form validation schema
export const eventFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  date: z.string().min(1, { message: 'Date is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  applicationDeadline: z.string().optional(),
  street: z.string().min(1, { message: 'Street address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zip: z.string().min(1, { message: 'ZIP code is required' }),
  signupFormUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.string().length(0)),
  attachedLinks: z.string().optional(),
  causeArea: z.string().min(1, { message: 'Cause area is required' }),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

// Use the cause areas from FilterConstants.ts but remove the "All Causes" option
export const CAUSE_AREAS = causeAreas.filter(cause => cause !== "All Causes");
