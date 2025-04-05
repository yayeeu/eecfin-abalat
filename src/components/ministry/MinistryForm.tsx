
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ministry, Member } from '@/types/database.types';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image, ImagePlus, Loader2 } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DialogFooter,
} from '@/components/ui/dialog';

// Updated the schema to use string instead of enum
const formSchema = z.object({
  name: z.string().min(1, 'Ministry name is required'),
  description: z.string().min(1, 'Description is required'),
  contact_person_id: z.string().min(1, 'Contact person is required'),
  contact_email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  photo: z.string().optional(),
  status: z.string().min(1, 'Status is required') // Changed from z.enum to z.string()
});

type FormValues = z.infer<typeof formSchema>;

interface MinistryFormProps {
  ministry: Ministry | null;
  elders: Member[];
  members: Member[];
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  onContactPersonChange: (contactPersonId: string) => void;
  selectedMember: Member | null;
}

const MinistryForm: React.FC<MinistryFormProps> = ({
  ministry,
  elders,
  members,
  onSubmit,
  onCancel,
  onContactPersonChange,
  selectedMember
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(ministry?.photo || null);
  const [isUploading, setIsUploading] = useState(false);

  const emptyMinistry: Omit<Ministry, 'id' | 'created_at' | 'contact_name' | 'contact_phone'> = {
    name: '',
    description: '',
    contact_person_id: '',
    contact_email: '',
    status: 'active',
    photo: ''
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: ministry ? {
      name: ministry.name,
      description: ministry.description,
      contact_person_id: ministry.contact_person_id || '',
      contact_email: ministry.contact_email || '',
      status: ministry.status,
      photo: ministry.photo || ''
    } : emptyMinistry
  });

  const activeMembers = members?.filter(member => member.status === 'active') || [];
  const activeElders = elders || [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Update the form value
      form.setValue('photo', previewUrl);
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    if (imageFile) {
      setIsUploading(true);
      try {
        // In a real implementation, you would upload the file to a server/storage service
        // and get back a URL to store in the database
        
        // For this example, we're just using the local preview URL
        // In a real app, replace this with your actual upload code
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
        
        // After "upload", submit the form with the values including the image URL
        onSubmit(values);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    } else {
      // If no new image, just submit the form with existing values
      onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ministry Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter ministry name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter ministry description" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormLabel className="block mb-2">Ministry Image</FormLabel>
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative w-full h-40 mb-4 rounded overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Ministry preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    className="absolute bottom-2 right-2 bg-white/80"
                    onClick={() => {
                      setImagePreview(null);
                      form.setValue('photo', '');
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="w-full h-40 mb-4 flex items-center justify-center bg-gray-100 rounded">
                  <ImagePlus className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <Button type="button" variant="outline" className="flex items-center gap-2">
                      <ImagePlus className="h-4 w-4" />
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Status *</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ministry status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="contact_person_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person *</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onContactPersonChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contact person" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 border-b">
                      <p className="font-semibold">Elders</p>
                    </div>
                    {activeElders.length > 0 ? (
                      activeElders.map((elder) => (
                        <SelectItem key={elder.id} value={elder.id}>
                          {elder.name} {elder.email ? `(${elder.email})` : ''}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No active elders available
                      </SelectItem>
                    )}
                    
                    <div className="p-2 border-b mt-2">
                      <p className="font-semibold">Other Members</p>
                    </div>
                    {activeMembers.length > 0 ? (
                      activeMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} {member.email ? `(${member.email})` : ''}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No active members available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Preferably select an elder as the contact person
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ministry Email *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="ministry@example.com" 
                  type="email"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Email address for the ministry (may be different from contact person's email)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedMember && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium">Selected Contact Information:</p>
            <p className="text-sm">Name: {selectedMember.name}</p>
            <p className="text-sm">Email: {selectedMember.email}</p>
            {selectedMember.phone && <p className="text-sm">Phone: {selectedMember.phone}</p>}
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-eecfin-navy"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {ministry ? 'Update Ministry' : 'Add Ministry'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default MinistryForm;
