
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Edit, Info } from 'lucide-react';
import { Member } from '@/types/database.types';
import AddFollowUpDialog from './AddFollowUpDialog';

interface MemberCardProps {
  member: Member;
  onMemberClick: (memberId: string) => void;
  onViewDetails: (member: Member) => void;
  onEditMember: (memberId: string) => void;
  readOnly?: boolean;
  refetch?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ 
  member, 
  onMemberClick, 
  onViewDetails, 
  onEditMember,
  readOnly = false,
  refetch
}) => {
  // Get initials for avatar fallback
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Card 
      className="overflow-hidden" 
      onClick={() => onMemberClick(member.id)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-24 w-24 mb-3">
            {member.image && <AvatarImage src={member.image} alt={member.name || 'Member'} />}
            <AvatarFallback className="text-xl">{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{member.name || 'Unknown'}</h3>
            <Badge 
              variant={
                member.status === 'active' ? 'success' : 
                member.status === 'inactive' ? 'secondary' : 
                'outline'
              }
              className="mt-1"
            >
              {member.status || 'Unknown'}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          {member.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{member.phone}</span>
            </div>
          )}
          
          {member.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
          
          {member.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">{member.address}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-3 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(member);
          }}
          className="flex items-center"
        >
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>
        
        {!readOnly && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEditMember(member.id);
              }}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <div onClick={(e) => e.stopPropagation()}>
              <AddFollowUpDialog 
                member={member} 
                onSuccess={refetch}
              />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MemberCard;
