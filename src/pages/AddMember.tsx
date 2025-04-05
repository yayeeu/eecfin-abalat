
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Loader2 } from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import CustomFooter from '@/components/CustomFooter';
import { getMember, updateMember, createMember, getRoleByName } from '@/lib/memberService';
import { getMembersForDropdown } from '@/lib/services/memberDropdownService';
import { getAllRoles } from '@/lib/services/roleService';
import { toast } from '@/hooks/use-toast';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const memberSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  postal_code: z.string().optional().or(z.literal('')),
  role: z.string().optional(),
  gender: z.string().optional(),
  marital_status: z.string().optional(),
  spouse_name: z.string().optional().or(z.literal('')),
  children_names: z.string().optional().or(z.literal('')),
  previous_church: z.string().optional().or(z.literal('')),
  role_in_previous_church: z.string().optional().or(z.literal('')),
  emergency_contact: z.string().optional().or(z.literal('')),
  status: z.string().optional(),
  is_baptised: z.boolean().optional(),
  has_letter_from_prev_church: z.boolean().optional(),
  num_children: z.string().optional()
    .transform(val => val === '' ? 0 : parseInt(val, 10))
    .pipe(z.number().min(0).optional()),
});

type MemberFormValues = z.infer<typeof memberSchema>;

const AddMember = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Initialize form
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
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
      num_children: '0', // This is a string in the form that gets transformed to number
    },
  });

  // Fetch member data if editing
  const { data: member, isLoading: memberLoading } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => getMember(memberId as string),
    enabled: !!memberId,
  });

  // Fetch roles for dropdown
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
  });

  // Pre-fill form when editing existing member
  useEffect(() => {
    if (member && !memberLoading) {
      form.reset({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        city: member.city || '',
        postal_code: member.postal_code || '',
        role: member.roles?.name || 'member',
        gender: member.gender || '',
        marital_status: member.marital_status || '',
        spouse_name: member.spouse_name || '',
        children_names: member.children_names || '',
        previous_church: member.previous_church || '',
        role_in_previous_church: member.role_in_previous_church || '',
        emergency_contact: member.emergency_contact || '',
        status: member.status || 'active',
        is_baptised: member.is_baptised || false,
        has_letter_from_prev_church: member.has_letter_from_prev_church || false,
        num_children: member.num_children !== undefined ? member.num_children.toString() : '0', // Convert number to string for form
      });
    }
  }, [member, memberLoading, form]);

  // Handle form submission
  const onSubmit = async (data: MemberFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Ensure we have a name as it's required by the backend
      if (!data.name) {
        throw new Error('Name is required');
      }
      
      // Get the transformed num_children value (will be a number after zod transformation)
      const formattedData = {
        ...data,
        name: data.name, // Ensure name is explicitly passed
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
        // Get role id by name for create
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
      
      // Redirect back to members management
      navigate('/admin/manage-members');
    } catch (error: any) {
      console.error('Error saving member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (memberId && memberLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading member data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Sidebar Component */}
          <AdminSidebar />

          {/* Main content area */}
          <div className="flex flex-col flex-1">
            {/* Header Component */}
            <AdminHeader />

            {/* Content */}
            <div className="flex-1 p-6">
              <Card className="w-full max-w-5xl mx-auto">
                <CardHeader>
                  <CardTitle>{memberId ? 'Edit Member' : 'Add New Member'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="basic">Basic Information</TabsTrigger>
                      <TabsTrigger value="personal">Personal Information</TabsTrigger>
                      <TabsTrigger value="church">Church Information</TabsTrigger>
                    </TabsList>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <TabsContent value="basic" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name*</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
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
                                    <Input {...field} type="email" />
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
                                    <Input {...field} />
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
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
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
                                    <Input {...field} />
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
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select member status" />
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
                            
                            <FormField
                              control={form.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select member role" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {rolesLoading ? (
                                        <SelectItem value="loading">Loading...</SelectItem>
                                      ) : (
                                        roles?.map((role) => (
                                          <SelectItem key={role.id} value={role.name}>
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="personal" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">Female</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
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
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select marital status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="single">Single</SelectItem>
                                      <SelectItem value="married">Married</SelectItem>
                                      <SelectItem value="divorced">Divorced</SelectItem>
                                      <SelectItem value="widowed">Widowed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="spouse_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Spouse Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="num_children"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Number of Children</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="number" min="0" />
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
                                    <Input {...field} placeholder="Separate with commas" />
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
                                    <Input {...field} placeholder="Name and number" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="church" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="previous_church"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Previous Church</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
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
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="is_baptised"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Is Baptised</FormLabel>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="has_letter_from_prev_church"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Has Letter from Previous Church</FormLabel>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>
                        
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => navigate('/admin/manage-members')}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : memberId ? 'Update Member' : 'Create Member'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Footer Component */}
            <CustomFooter />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AddMember;
