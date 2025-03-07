
import { z } from 'zod';

export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters." })
  .refine(password => /[A-Z]/.test(password), { 
    message: "Password must include at least one capital letter."
  })
  .refine(password => /[0-9]/.test(password), { 
    message: "Password must include at least one number."
  })
  .refine(password => /[^A-Za-z0-9]/.test(password), { 
    message: "Password must include at least one symbol."
  });

export const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  password: passwordSchema,
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
  socialMedia: z.string().url({
    message: "Please enter a valid social media URL.",
  }),
  location: z.string().min(2, {
    message: "Please enter your organization's location.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  mission: z.string().min(20, {
    message: "Mission statement must be at least 20 characters.",
  }),
  causes: z.array(z.string()).min(1, {
    message: "Please select at least one cause.",
  }).max(3, {
    message: "You can select up to 3 causes.",
  })
});

export type FormValues = z.infer<typeof formSchema>;
