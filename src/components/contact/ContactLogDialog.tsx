
import React from 'react';
import { ContactLog } from '@/types/database.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ContactLogForm from './ContactLogForm';

interface ContactLogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLog: ContactLog | null;
  elderId?: string;
  onSuccess: () => void;
}

const ContactLogDialog: React.FC<ContactLogDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedLog,
  elderId,
  onSuccess,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedLog ? 'Edit Contact Log' : 'Add New Contact Log'}
          </DialogTitle>
        </DialogHeader>
        <ContactLogForm
          initialData={selectedLog || undefined}
          elderId={elderId}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactLogDialog;
