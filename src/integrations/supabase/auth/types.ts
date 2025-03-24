
import { Session, User } from '@supabase/supabase-js';

// Types for authentication
export type AuthUser = User | null;
export type AuthSession = Session | null;

// Type for error categorization
export type ImageErrorType = {
  type: string;
  message: string;
};
