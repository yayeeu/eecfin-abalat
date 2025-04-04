
import React from 'react';
import { useDrag } from 'react-dnd';
import { Member } from '@/types/database.types';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Phone, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
  currentElderId: string | null;
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
      <CardContent className="p-3 flex items-center gap-3">
        <div className="text-gray-400">
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{member.name}</div>
          
          <div className="flex flex-col mt-1 text-sm text-gray-500">
            {member.email && (
              <div className="flex items-center gap-1 truncate">
                <Mail className="h-3 w-3" />
                <span className="truncate">{member.email}</span>
              </div>
            )}
            
            {member.phone && (
              <div className="flex items-center gap-1 truncate">
                <Phone className="h-3 w-3" />
                <span className="truncate">{member.phone}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
