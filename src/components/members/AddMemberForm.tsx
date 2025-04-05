
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMember, updateMember } from '@/lib/memberService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Member } from '@/types/database.types';

// Form validation schema
const memberSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  postal_code: z.string().optional().or(z.literal(''))
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface AddMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Member> | null;
  isEditMode?: boolean;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ 
  onSuccess, 
  onCancel,
  initialData = null,
  isEditMode = false
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize the form
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      postal_code: initialData?.postal_code || ''
    }
  });

  // Mutation for creating a new member
  const createMemberMutation = useMutation({
    mutationFn: (data: MemberFormValues) => createMember({
      ...data,
      // Make sure name is always provided and not undefined
      name: data.name,
      status: 'active'
    }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Member has been created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create member: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Mutation for updating an existing member
  const updateMemberMutation = useMutation({
    mutationFn: (data: MemberFormValues) => {
      if (!initialData?.id) {
        throw new Error('Member ID is required for updates');
      }
      return updateMember(initialData.id, data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Member has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      if (initialData?.id) {
        queryClient.invalidateQueries({ queryKey: ['member', initialData.id] });
      }
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update member: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Form submission handler
  const onSubmit = (data: MemberFormValues) => {
    if (isEditMode && initialData?.id) {
      updateMemberMutation.mutate(data);
    } else {
      createMemberMutation.mutate(data);
    }
  };

  const isPending = createMemberMutation.isPending || updateMemberMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="10001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditMode ? 'Update Member' : 'Create Member'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddMemberForm;
