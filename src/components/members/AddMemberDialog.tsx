
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddMemberForm from './AddMemberForm';

interface AddMemberDialogProps {
  trigger?: React.ReactNode;
  onMemberAdded?: () => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ 
  trigger, 
  onMemberAdded 
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onMemberAdded) onMemberAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Fill in the member details below. Only the name field is required.
          </DialogDescription>
        </DialogHeader>
        <AddMemberForm 
          onSuccess={handleSuccess} 
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
