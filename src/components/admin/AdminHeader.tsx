
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const { signOut } = useAuth();
  
  return (
    <header className="w-full bg-eecfin-navy py-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-12 w-auto flex-shrink-0">
            <img 
              src="/lovable-uploads/010ebde5-605e-4cfe-b2cc-1caacf7c5734.png" 
              alt="EECFIN Logo" 
              className="h-full object-contain"
            />
          </div>
          <h1 className="text-eecfin-gold text-2xl ml-6 font-bold">Admin Dashboard</h1>
        </div>
        
        <Button 
          variant="outline" 
          className="text-eecfin-gold border-eecfin-gold hover:bg-eecfin-navy/80 hover:text-eecfin-gold"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
