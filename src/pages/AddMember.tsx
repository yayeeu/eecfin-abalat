
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createMember, getMember, updateMember } from '@/lib/memberService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { getAllRoles, getRoleByName } from '@/lib/services/roleService';
import { Loader2 } from 'lucide-react';

// Create form schema with proper type transformations
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email().optional().nullable(),
  status: z.string().optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  role: z.string().optional(),
  gender: z.string().optional().nullable(),
  marital_status: z.string().optional().nullable(),
  spouse_name: z.string().optional().nullable(),
  children_names: z.string().optional().nullable(),
  previous_church: z.string().optional().nullable(),
  role_in_previous_church: z.string().optional().nullable(),
  emergency_contact: z.string().optional().nullable(),
  is_baptised: z.boolean().optional(),
  has_letter_from_prev_church: z.boolean().optional(),
  num_children: z.string().transform(val => val ? parseInt(val, 10) : 0),
});

// Define the form type from the schema
type MemberFormValues = z.infer<typeof formSchema>;

const AddMember = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { memberId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      role: 'member',
      gender: '',
      marital_status: '',
      spouse_name: '',
      children_names: '',
      previous_church: '',
      role_in_previous_church: '',
      emergency_contact: '',
      status: 'active',
      is_baptised: false,
      has_letter_from_prev_church: false,
      num_children: '0', // Keep as string in the form
    },
  });

  useEffect(() => {
    const fetchMember = async () => {
      if (memberId) {
        try {
          const member = await getMember(memberId);
          if (member) {
            form.setValue('name', member.name);
            form.setValue('email', member.email || '');
            form.setValue('phone', member.phone || '');
            form.setValue('address', member.address || '');
            form.setValue('city', member.city || '');
            form.setValue('postal_code', member.postal_code || '');
            form.setValue('gender', member.gender || '');
            form.setValue('marital_status', member.marital_status || '');
            form.setValue('spouse_name', member.spouse_name || '');
            form.setValue('children_names', member.children_names || '');
            form.setValue('previous_church', member.previous_church || '');
            form.setValue('role_in_previous_church', member.role_in_previous_church || '');
            form.setValue('emergency_contact', member.emergency_contact || '');
            form.setValue('status', member.status || 'active');
            form.setValue('is_baptised', member.is_baptised || false);
            form.setValue('has_letter_from_prev_church', member.has_letter_from_prev_church || false);
            form.setValue('num_children', member.num_children?.toString() || '0');
            
            // Fetch role by id and set the role name
            if (member.role_id) {
              const roles = await getAllRoles();
              const role = roles.find(r => r.id === member.role_id);
              form.setValue('role', role?.name || 'member');
            } else {
              form.setValue('role', 'member');
            }
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to load member details',
            variant: 'destructive',
          });
        }
      }
    };

    fetchMember();
  }, [memberId, form, toast]);

  const onSubmit = async (data: MemberFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!data.name) {
        toast({
          title: 'Error',
          description: 'Name is required',
          variant: 'destructive',
        });
        throw new Error('Name is required');
      }
      
      // Transform data before sending to API
      // num_children is automatically transformed to a number by zod
      const formattedData = {
        ...data,
        name: data.name,
      };
      
      if (memberId) {
        // Get role id by name for update
        const roleData = await getRoleByName(data.role || 'member');
        
        // Update existing member
        await updateMember(memberId, {
          ...formattedData,
          role_id: roleData?.id,
        });
        
        toast({
          title: 'Success',
          description: 'Member updated successfully',
        });
      } else {
        // Get role id by name for new member
        const roleData = await getRoleByName(data.role || 'member');
        
        // Create new member
        await createMember({
          ...formattedData,
          role_id: roleData?.id,
        });
        
        toast({
          title: 'Success',
          description: 'Member created successfully',
        });
      }
      
      // Navigate back to members list
      navigate('/admin/members');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/admin/members')}>
          &larr; Back to Members
        </Button>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl mx-auto">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold tracking-tight">
            {memberId ? 'Edit Member' : 'Add New Member'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {memberId ? 'Update member details' : 'Enter details for the new member'}
          </p>
        </div>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Member Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@eecf.org" {...field} />
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
                      <Input placeholder="251911000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
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
                        <Input placeholder="City" {...field} />
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
                        <Input placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="elder">Elder</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Input placeholder="Gender" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marital_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <FormControl>
                        <Input placeholder="Marital Status" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="spouse_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spouse Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Spouse Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="children_names"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Children Names</FormLabel>
                    <FormControl>
                      <Input placeholder="Children Names" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previous_church"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Church</FormLabel>
                    <FormControl>
                      <Input placeholder="Previous Church" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role_in_previous_church"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role in Previous Church</FormLabel>
                    <FormControl>
                      <Input placeholder="Role in Previous Church" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergency_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_baptised"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Is Baptised
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="has_letter_from_prev_church"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Has Letter from Previous Church
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="num_children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Children</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Number of Children"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {memberId ? 'Update Member' : 'Create Member'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
