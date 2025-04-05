
import React from 'react';
import { useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Member } from '@/types/database.types';
import MemberItem from '@/components/members/MemberItem';
import { Loader2, Users } from 'lucide-react';

interface UnassignedMembersCardProps {
  members: Member[];
  onDrop: (memberId: string, elderId: string | null) => void;
  isLoading: boolean;
}

const UnassignedMembersCard: React.FC<UnassignedMembersCardProps> = ({
  members,
  onDrop,
  isLoading
}) => {
  // Set up drop target
  const [{ isOver }, drop] = useDrop({
    accept: 'member',
    drop: (item: { id: string }) => {
      onDrop(item.id, null);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Card 
      className={`h-full ${isOver ? 'ring-2 ring-primary' : ''}`}
      ref={drop}
    >
      <CardHeader className="pb-2 bg-muted">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            Unassigned Members
          </div>
          <div className="flex items-center text-sm font-normal text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {members.length} members
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : members.length > 0 ? (
          <div className="space-y-2">
            {members.map(member => (
              <MemberItem 
                key={member.id} 
                member={member} 
                currentElderId={null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500 border border-dashed rounded-md">
            No unassigned members
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnassignedMembersCard;
