
import React from 'react';
import { Loader2 } from 'lucide-react';

const MemberLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading member data...</span>
    </div>
  );
};

export default MemberLoadingState;
