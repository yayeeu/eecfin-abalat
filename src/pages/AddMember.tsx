
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddMemberForm from '@/components/members/AddMemberForm';
import { ArrowLeft } from 'lucide-react';

const AddMember: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/manage-members');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/admin/manage-members')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Member Management
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Member</CardTitle>
          <CardDescription>
            Create a new member by filling out the form below. Only the name field is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddMemberForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;
