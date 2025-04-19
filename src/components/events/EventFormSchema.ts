
import { z } from 'zod';
import { causeAreas } from '../form/filters/FilterConstants';

// Form validation schema
export const eventFormSchema = z.object({
  title: z.string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .refine(
      (value) => value.trim().split(/\s+/).length <= 10,
      { message: 'Title must be 10 words or fewer' }
    ),
  description: z.string()
    .refine(
      (value) => value.trim().split(/\s+/).length >= 25,
      { message: 'Description must be at least 25 words' }
    ),
  date: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().optional(),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  applicationDeadline: z.string().optional(),
  street: z.string().min(1, { message: 'Street address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zip: z.string().min(1, { message: 'ZIP code is required' }),
  signupFormUrl: z.string().url({ message: 'Please enter a valid URL' }).min(1, { message: 'Signup URL is required' }),
  attachedLinks: z.string().optional(),
  causeAreas: z.array(z.string()).min(1, { message: 'At least one cause area is required' }).max(3, { message: 'Maximum of 3 cause areas allowed' }),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

// Use the cause areas from FilterConstants.ts but remove the "All Causes" option
export const CAUSE_AREAS = causeAreas.filter(cause => cause !== "All Causes");
