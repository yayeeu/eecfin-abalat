
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddMemberForm from '@/components/members/AddMemberForm';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMember } from '@/lib/memberService';
import { useToast } from '@/hooks/use-toast';
import { Member } from '@/types/database.types';

const AddMember: React.FC = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<Partial<Member> | null>(null);
  const isEditMode = !!memberId;

  // Fetch member data if in edit mode
  const { data: memberData, isLoading } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => getMember(memberId!),
    enabled: isEditMode,
    meta: {
      onError: (error: any) => {
        console.error('Error fetching member:', error);
        toast({
          title: 'Error',
          description: 'Failed to load member data. Please try again.',
          variant: 'destructive',
        });
        navigate('/admin/manage-members');
      }
    }
  });

  useEffect(() => {
    if (memberData) {
      setInitialData(memberData);
    }
  }, [memberData]);

  const handleSuccess = () => {
    navigate('/admin/all-members');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/admin/all-members')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Members
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Member' : 'Add New Member'}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? 'Update member information by modifying the form below.' 
              : 'Create a new member by filling out the form below. Only the name field is required.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditMode && isLoading ? (
            <div className="py-10 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
                <p className="mt-3">Loading member data...</p>
              </div>
            </div>
          ) : (
            <AddMemberForm 
              onSuccess={handleSuccess} 
              initialData={initialData}
              isEditMode={isEditMode}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;
