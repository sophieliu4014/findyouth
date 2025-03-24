
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AccountDeleteSection from './AccountDeleteSection';

interface AccountInfoTabProps {
  user: any;
  refreshAuth: () => Promise<void>;
}

const AccountInfoTab = ({ user, refreshAuth }: AccountInfoTabProps) => {
  const [organizationName, setOrganizationName] = useState(
    user?.user_metadata?.organization_name || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          organization_name: organizationName,
        }
      });
      
      if (error) throw error;
      
      if (user?.id) {
        const { error: nonprofitError } = await supabase
          .from('nonprofits')
          .update({
            organization_name: organizationName,
          })
          .eq('id', user.id);
        
        if (nonprofitError) {
          console.error('Error updating nonprofit profile:', nonprofitError);
        }
      }
      
      await refreshAuth();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Account Information</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="organizationName" className="block text-sm font-medium text-youth-charcoal mb-1">
            Organization Name
          </label>
          <Input
            id="organizationName"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-youth-charcoal mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full bg-gray-50"
          />
          <p className="mt-1 text-xs text-youth-charcoal/70">
            Email cannot be changed
          </p>
        </div>
        
        <div className="pt-4">
          <Button
            onClick={handleSaveProfile}
            className="bg-youth-blue hover:bg-youth-purple transition-colors"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Add the account deletion section */}
      <AccountDeleteSection />
    </div>
  );
};

export default AccountInfoTab;
