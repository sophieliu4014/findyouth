import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';
import { AlertTriangle } from 'lucide-react';

interface OrganizationInfoFieldsProps {
  control: Control<FormValues>;
}

const OrganizationInfoFields = ({ control }: OrganizationInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name*</FormLabel>
              <FormControl>
                <Input placeholder="Youth Eco Initiative" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Password*</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              {!field.value || /(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(field.value) ? null : (
                <div className="mt-1 text-xs text-red-500">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Please incorporate capital letters, symbols, and numbers</span>
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address*</FormLabel>
              <FormControl>
                <Input placeholder="contact@example.org" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number*</FormLabel>
              <FormControl>
                <Input placeholder="(604) 555-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL (if available)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.yourorganization.org" {...field} />
              </FormControl>
              <FormDescription>
                Enter your organization's website if you have one
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="socialMedia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Media URL*</FormLabel>
              <FormControl>
                <Input placeholder="https://www.instagram.com/yourorg" {...field} />
              </FormControl>
              <FormDescription>
                Link to your main social media (Instagram, TikTok, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location*</FormLabel>
            <FormControl>
              <Input placeholder="Vancouver, BC" {...field} />
            </FormControl>
            <FormDescription>
              City where your nonprofit is headquartered
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default OrganizationInfoFields;
