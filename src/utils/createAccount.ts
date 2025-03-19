
import { signUpWithEmail } from '@/integrations/supabase/auth';

// This function should only be used in development for testing purposes
export const createTestAccount = async () => {
  const email = "sophieliu4014@gmail.com";
  const password = "@Sophie2008";
  
  try {
    const result = await signUpWithEmail(email, password);
    console.log('Account creation result:', result);
    return result;
  } catch (error) {
    console.error('Failed to create test account:', error);
    throw error;
  }
};

// Execute immediately
createTestAccount()
  .then(result => {
    console.log('Account creation completed:', result);
  })
  .catch(error => {
    console.error('Account creation failed:', error);
  });
