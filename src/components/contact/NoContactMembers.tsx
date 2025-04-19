
import React from 'react';
import { Member } from '@/types/database.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface NoContactMembersProps {
  members: Member[];
  onMemberClick: (id: string) => void;
  onAddContact: () => void;
}

const NoContactMembers: React.FC<NoContactMembersProps> = ({
  members,
  onMemberClick,
  onAddContact,
}) => {
  if (!members.length) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded">
        <p className="text-gray-500">All members have been contacted</p>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Members Without Contact History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell>
                  <button 
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => member.id && onMemberClick(member.id)}
                  >
                    {member.name || 'Unknown Member'}
                  </button>
                </TableCell>
                <TableCell>
                  {member.email && <div className="text-sm">{member.email}</div>}
                  {member.phone && <div className="text-sm">{member.phone}</div>}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    <Clock className="h-3 w-3 mr-1" />
                    No Contact
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onAddContact}
                  >
                    Add Contact
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NoContactMembers;
