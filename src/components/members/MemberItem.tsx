
import React from 'react';
import { useDrag } from 'react-dnd';
import { Member } from '@/types/database.types';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface MemberItemProps {
  member: Member;
  currentElderId: string | null;
}

const MemberItem: React.FC<MemberItemProps> = ({ member, currentElderId }) => {
  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: 'member',
    item: { id: member.id, currentElderId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`cursor-move rounded-md p-2 bg-background border ${
        isDragging ? 'opacity-50' : ''
      } hover:bg-muted transition-colors`}
    >
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name || ''} 
              className="h-8 w-8 rounded-full object-cover" 
            />
          ) : (
            <User className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="truncate">{member.name || 'Unnamed Member'}</div>
      </div>
    </div>
  );
};

export default MemberItem;
