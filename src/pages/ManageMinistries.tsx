
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMinistries, createMinistry, updateMinistry, deleteMinistry, Ministry } from '@/lib/ministryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

interface MinistryFormData {
  name: string;
  description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: 'active' | 'inactive';
}

const ManageMinistries: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [formData, setFormData] = useState<MinistryFormData>({
    name: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    status: 'active'
  });

  const { data: ministries, isLoading } = useQuery({
    queryKey: ['ministries'],
    queryFn: () => getMinistries(false), // Get all ministries, not just active
  });

  const createMutation = useMutation({
    mutationFn: createMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
      toast({ title: 'Success', description: 'Ministry created successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create ministry', variant: 'destructive' });
      console.error('Create ministry error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ministry> }) => updateMinistry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
      toast({ title: 'Success', description: 'Ministry updated successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update ministry', variant: 'destructive' });
      console.error('Update ministry error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
      toast({ title: 'Success', description: 'Ministry deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete ministry', variant: 'destructive' });
      console.error('Delete ministry error:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      status: 'active'
    });
    setEditingMinistry(null);
  };

  const handleEdit = (ministry: Ministry) => {
    setEditingMinistry(ministry);
    setFormData({
      name: ministry.name,
      description: ministry.description,
      contact_name: ministry.contact_name || '',
      contact_email: ministry.contact_email || '',
      contact_phone: ministry.contact_phone || '',
      status: ministry.status as 'active' | 'inactive'
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({ title: 'Error', description: 'Name and description are required', variant: 'destructive' });
      return;
    }

    if (editingMinistry) {
      updateMutation.mutate({ id: editingMinistry.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (ministry: Ministry) => {
    if (window.confirm(`Are you sure you want to delete "${ministry.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(ministry.id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading ministries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Ministries</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage church ministries</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ministry
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMinistry ? 'Edit Ministry' : 'Create New Ministry'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ministry Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Worship Team"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the ministry's purpose and activities..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact Person</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+358 40 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="ministry@example.com"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingMinistry ? 'Update' : 'Create'} Ministry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Ministries ({ministries?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {ministries && ministries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ministries.map((ministry) => (
                  <TableRow key={ministry.id}>
                    <TableCell className="font-medium">{ministry.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={ministry.description}>
                        {ministry.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {ministry.contact_name && (
                        <div>
                          <div className="font-medium">{ministry.contact_name}</div>
                          {ministry.contact_email && (
                            <div className="text-sm text-gray-600">{ministry.contact_email}</div>
                          )}
                          {ministry.contact_phone && (
                            <div className="text-sm text-gray-600">{ministry.contact_phone}</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ministry.status === 'active' ? 'default' : 'secondary'}>
                        {ministry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ministry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ministry)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No ministries found. Create your first ministry to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageMinistries;
