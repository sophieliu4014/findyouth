
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface ProfileSubmitButtonProps {
  isSaving: boolean;
}

const ProfileSubmitButton = ({ isSaving }: ProfileSubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full md:w-auto bg-youth-blue hover:bg-youth-purple transition-colors"
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving Changes...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Profile Changes
        </>
      )}
    </Button>
  );
};

export default ProfileSubmitButton;
