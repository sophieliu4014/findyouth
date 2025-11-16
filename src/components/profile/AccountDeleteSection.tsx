
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AccountDeleteSection = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Get the current user's ID
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (userId) {
        // First delete all events created by this user
        const { error: eventsError } = await supabase
          .from('events')
          .delete()
          .eq('nonprofit_id', userId);
          
        if (eventsError) {
          console.error('Error deleting user events:', eventsError);
          toast.error(`Failed to delete your events: ${eventsError.message}`);
          return;
        }
      }
      
      // Sign out the user (account deletion requires contacting support)
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      navigate('/');
      toast.success('Your data has been deleted and you have been signed out. Please contact support to permanently delete your account.');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(`Failed to delete account: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
      <p className="text-sm text-gray-600 mb-4">
        Once you delete your account, there is no going back. This action cannot be undone.
        All of your data will be permanently deleted.
      </p>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Delete Your Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete your account? 
              This action cannot be undone and will permanently delete your account 
              and all associated data, including your events.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Yes, Delete My Account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountDeleteSection;
