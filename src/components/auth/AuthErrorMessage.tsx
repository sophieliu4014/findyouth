
import { AlertCircle } from 'lucide-react';

interface AuthErrorMessageProps {
  message: string;
}

const AuthErrorMessage = ({ message }: AuthErrorMessageProps) => {
  if (!message) return null;
  
  return (
    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
};

export default AuthErrorMessage;
