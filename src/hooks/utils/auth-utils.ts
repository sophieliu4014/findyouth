
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Sends a password reset email to the provided email address
 */
export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
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
