
import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent } from '../ui/card';
import { Member } from '@/types/database.types';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
  currentElderId: string | "unassigned";
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
        {member.email && (
          <div className="text-xs text-gray-500 truncate">{member.email}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberCard;
