
import React from 'react';
import { Member } from '@/types/database.types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, User } from 'lucide-react';

interface MembersTableProps {
  members: Member[];
  onMemberClick: (memberId: string) => void;
  readOnly?: boolean;
}

const MembersTable: React.FC<MembersTableProps> = ({ 
  members, 
  onMemberClick,
  readOnly = false
}) => {
  if (members.length === 0) {
    return (
      <div className="p-8 text-center">
        <User className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Status</TableHead>
          {!readOnly && <TableHead>Role</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow 
            key={member.id} 
            className={`${!readOnly ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onClick={() => onMemberClick(member.id)}
          >
            <TableCell className="font-medium">
              {member.name || 'Unknown'}
            </TableCell>
            <TableCell>
              <div className="flex flex-col space-y-1">
                {member.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {member.address ? (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm truncate max-w-[200px]">{member.address}</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No address</span>
              )}
            </TableCell>
            <TableCell>
              <Badge 
                variant={
                  member.status === 'active' ? 'success' : 
                  member.status === 'inactive' ? 'secondary' : 
                  'outline'
                }
              >
                {member.status || 'Unknown'}
              </Badge>
            </TableCell>
            {!readOnly && (
              <TableCell>
                <span className="text-sm">
                  {member.roles?.name || member.role || 'Regular Member'}
                </span>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MembersTable;
