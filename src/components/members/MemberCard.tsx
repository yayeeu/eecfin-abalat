
import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent } from '../ui/card';
import { SimpleMember } from '@/hooks/useElderAssignments';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: SimpleMember;
  currentElderId: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, currentElderId }) => {
  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: 'MEMBER',
    item: { id: member.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <Card
      ref={drag}
      className={cn(
        "cursor-move shadow-sm border hover:border-blue-300 hover:shadow-md transition-all",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <CardContent className="p-3">
        <div className="font-medium truncate">{member.name || "Unnamed Member"}</div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
