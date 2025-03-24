
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Sends a password reset email to the provided email address
 */
export const sendPasswordResetEmail = async (email: string) => {
  try {
    // For production deployments, it's better to use a fixed URL or environment variable
    // instead of window.location.origin which will be localhost in development
    const redirectUrl = 'https://findyouth.org/reset-password';
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { 
      success: false, 
      error: error.message || "An error occurred while sending the reset link" 
    };
  }
};

/**
 * Updates the user's password with a new password
 */
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Password update error:", error);
    return { 
      success: false, 
      error: error.message || "An error occurred while updating your password" 
    };
  }
};
