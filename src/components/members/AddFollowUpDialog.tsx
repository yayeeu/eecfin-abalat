
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import ContactLogForm from '@/components/contact/ContactLogForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Member } from '@/types/database.types';

interface AddFollowUpDialogProps {
  member: Member;
  onSuccess?: () => void;
}

const AddFollowUpDialog: React.FC<AddFollowUpDialogProps> = ({ member, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const handleSuccess = () => {
    setOpen(false);
    toast({
      title: "Follow-up added",
      description: `Successfully added follow-up contact for ${member.name}`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
        >
          <ClipboardList className="h-4 w-4 mr-1" />
          Add follow-up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Contact Follow-up</DialogTitle>
        </DialogHeader>
        {user && (
          <div className="py-4">
            <ContactLogForm 
              elderId={user.id} 
              memberId={member.id} 
              onSuccess={handleSuccess} 
              onCancel={() => setOpen(false)}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFollowUpDialog;
