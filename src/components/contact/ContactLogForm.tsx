
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createContactLog } from '@/lib/contactLogService';
import { useToast } from '@/hooks/use-toast';
import { ContactLog } from '@/types/database.types';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Update the form schema to use the correct contact type values
const formSchema = z.object({
  contact_type: z.enum(['Text Message', 'In Person', 'Phone Call', 'Email', 'Other']),
  notes: z.string().min(1, 'Notes are required'),
  flagged: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactLogFormProps {
  elderId: string;
  memberId: string;
  initialData?: ContactLog;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ContactLogForm: React.FC<ContactLogFormProps> = ({ 
  elderId, 
  memberId, 
  initialData, 
  onSuccess,
  onCancel 
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_type: initialData?.contact_type as 'Text Message' | 'In Person' | 'Phone Call' | 'Email' | 'Other' || 'In Person',
      notes: initialData?.notes || '',
      flagged: initialData?.flagged || false,
    },
  });
  
  const contactTypes = [
    { value: 'Text Message', label: 'Text Message' },
    { value: 'In Person', label: 'In Person' },
    { value: 'Phone Call', label: 'Phone Call' },
    { value: 'Email', label: 'Email' },
    { value: 'Other', label: 'Other' },
  ];
  
  // Fix: Update the mutation to accept the correct parameter format
  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return createContactLog({
        elder_id: elderId,
        member_id: memberId,
        contact_type: data.contact_type,
        notes: data.notes,
        flagged: data.flagged,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Contact log created',
        description: 'The contact log has been created successfully',
      });
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error('Error creating contact log:', error);
      toast({
        title: 'Error',
        description: 'There was a problem creating the contact log',
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="contact_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contactTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter notes about the contact" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="flagged"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Flag for Follow-up</FormLabel>
                <p className="text-sm text-gray-500">
                  Mark this contact for follow-up action
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : initialData ? 'Update Contact Log' : 'Save Contact Log'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactLogForm;
