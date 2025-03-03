
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';

interface MissionFieldsProps {
  control: Control<FormValues>;
}

const MissionFields = ({ control }: MissionFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Description*</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your organization, when it was founded, and what areas you work in..." 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="mission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mission Statement*</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What is your organization's mission? What impact are you trying to make?" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MissionFields;
