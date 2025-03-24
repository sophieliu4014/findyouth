
import React from 'react';
import { AlertCircle, AlertTriangle, Info, XCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

export type UploadErrorSeverity = 'error' | 'warning' | 'info';

interface UploadErrorProps {
  message: string;
  details?: string;
  severity?: UploadErrorSeverity;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function UploadError({
  message,
  details,
  severity = 'error',
  onRetry,
  onDismiss
}: UploadErrorProps) {
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };
  
  const getBgColor = () => {
    switch (severity) {
      case 'error':
        return 'bg-destructive/10 border-destructive/20';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-destructive/10 border-destructive/20';
    }
  };
  
  const getTextColor = () => {
    switch (severity) {
      case 'error':
        return 'text-destructive';
      case 'warning':
        return 'text-amber-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-destructive';
    }
  };
  
  return (
    <div className={`flex items-start gap-3 rounded-md border p-3 ${getBgColor()}`}>
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
        {details && (
          <p className="text-xs mt-1 text-muted-foreground">{details}</p>
        )}
        
        {(onRetry || onDismiss) && (
          <div className="flex gap-2 mt-2">
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="h-8 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
