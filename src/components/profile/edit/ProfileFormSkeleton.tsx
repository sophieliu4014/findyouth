
import { Loader2 } from "lucide-react";

const ProfileFormSkeleton = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
    </div>
  );
};

export default ProfileFormSkeleton;
