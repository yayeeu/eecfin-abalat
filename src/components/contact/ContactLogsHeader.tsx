
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface ContactLogsHeaderProps {
  onAddNew: () => void;
}

const ContactLogsHeader: React.FC<ContactLogsHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Contact Logs</h1>
      <Button onClick={onAddNew} className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Add New Contact Log
      </Button>
    </div>
  );
};

export default ContactLogsHeader;
