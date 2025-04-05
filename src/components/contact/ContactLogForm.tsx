
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createContactLog, updateContactLog } from '@/lib/contactLogService';
import { ContactLog } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getMemberDropdownOptions } from '@/lib/services/memberDropdownService';
import { getElderDropdownOptions } from '@/lib/services/elderService';

export interface ContactLogFormProps {
  initialData?: ContactLog;
  onSuccess: () => void;
  onCancel: () => void;
  elderId?: string;
  memberId?: string;
}

const ContactLogForm: React.FC<ContactLogFormProps> = ({ 
  initialData, 
  onSuccess, 
  onCancel,
  elderId,
  memberId
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ContactLog>({
    defaultValues: initialData || {
      contact_type: 'Phone Call',
      notes: '',
      flagged: false,
      elder_id: elderId || '',
      member_id: memberId || ''
    }
  });

  const contactType = watch('contact_type');
  const selectedElderId = watch('elder_id');
  const selectedMemberId = watch('member_id');
  const isFlagged = watch('flagged');

  // Fetch elder options for dropdown
  const { 
    data: elderOptions = [], 
    isLoading: loadingElders 
  } = useQuery({
    queryKey: ['elder-options'],
    queryFn: getElderDropdownOptions,
    enabled: !elderId // Only fetch if elderId is not provided
  });

  // Fetch member options for dropdown
  const { 
    data: memberOptions = [], 
    isLoading: loadingMembers 
  } = useQuery({
    queryKey: ['member-options'],
    queryFn: getMemberDropdownOptions,
    enabled: !memberId // Only fetch if memberId is not provided
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createContactLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-logs'] });
      toast({
        title: 'Contact log created',
        description: 'The contact log has been created successfully.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to create contact log: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactLog> }) => 
      updateContactLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-logs'] });
      toast({
        title: 'Contact log updated',
        description: 'The contact log has been updated successfully.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update contact log: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const onSubmit = async (data: ContactLog) => {
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateMutation.mutateAsync({ 
          id: initialData.id, 
          data: {
            contact_type: data.contact_type,
            notes: data.notes,
            flagged: data.flagged,
            elder_id: data.elder_id,
            member_id: data.member_id
          } 
        });
      } else {
        await createMutation.mutateAsync({
          contact_type: data.contact_type,
          notes: data.notes,
          flagged: data.flagged,
          elder_id: data.elder_id || elderId,
          member_id: data.member_id || memberId
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Elder selection - show only if elderId is not provided */}
      {!elderId && (
        <div className="space-y-2">
          <Label htmlFor="elder_id">Elder</Label>
          <Select 
            value={selectedElderId} 
            onValueChange={(value) => setValue('elder_id', value)}
            disabled={isSubmitting || loadingElders}
          >
            <SelectTrigger id="elder_id">
              <SelectValue placeholder="Select an elder" />
            </SelectTrigger>
            <SelectContent>
              {elderOptions.map((elder) => (
                <SelectItem key={elder.value} value={elder.value}>
                  {elder.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.elder_id && (
            <p className="text-sm text-red-500">{errors.elder_id.message}</p>
          )}
        </div>
      )}

      {/* Member selection - show only if memberId is not provided */}
      {!memberId && (
        <div className="space-y-2">
          <Label htmlFor="member_id">Member</Label>
          <Select 
            value={selectedMemberId} 
            onValueChange={(value) => setValue('member_id', value)}
            disabled={isSubmitting || loadingMembers}
          >
            <SelectTrigger id="member_id">
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {memberOptions.map((member) => (
                <SelectItem key={member.value} value={member.value}>
                  {member.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.member_id && (
            <p className="text-sm text-red-500">{errors.member_id.message}</p>
          )}
        </div>
      )}

      {/* Contact Type */}
      <div className="space-y-2">
        <Label htmlFor="contact_type">Contact Type</Label>
        <Select 
          value={contactType} 
          onValueChange={(value) => setValue('contact_type', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="contact_type">
            <SelectValue placeholder="Select contact type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Phone Call">Phone Call</SelectItem>
            <SelectItem value="Text Message">Text Message</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="In Person">In Person</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.contact_type && (
          <p className="text-sm text-red-500">{errors.contact_type.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Enter contact notes..."
          {...register('notes')}
          disabled={isSubmitting}
          className="min-h-[100px]"
        />
      </div>

      {/* Flag Contact */}
      <div className="flex items-center space-x-2">
        <Switch
          id="flagged"
          checked={isFlagged}
          onCheckedChange={(checked) => setValue('flagged', checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="flagged" className="cursor-pointer">
          Flag this contact for follow-up
        </Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting || (!selectedElderId && !elderId) || (!selectedMemberId && !memberId)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update Contact Log' : 'Create Contact Log'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContactLogForm;
