
import { supabase } from "../client";
import { toast } from "sonner";
import { AuthUser, AuthSession } from "./types";
import { ensureNonprofitProfile } from "./nonprofit";

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, userData?: Record<string, any>) => {
  const options: any = {
    data: userData
  };
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options
  });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Registration successful! Please check your email to confirm your account.");
  }
  
  return { data, error };
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Successfully logged in!");
    
    // Try to create nonprofit profile if not exists
    ensureNonprofitProfile().catch(err => {
      console.error("Failed to ensure nonprofit profile:", err);
    });
  }

  return { data, error };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Successfully logged out!");
  }
  
  return { error };
};

// Get current session
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Get current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};
