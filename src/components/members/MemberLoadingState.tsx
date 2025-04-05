
import React from 'react';
import { Loader2 } from 'lucide-react';

interface MemberLoadingStateProps {
  message?: string;
}

const MemberLoadingState: React.FC<MemberLoadingStateProps> = ({ 
  message = 'Loading member data...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="flex items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span className="text-lg font-medium">{message}</span>
      </div>
    </div>
  );
};

export default MemberLoadingState;
