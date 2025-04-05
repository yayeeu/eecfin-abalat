
import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, Mail, Phone, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Member {
  id: string;
  name?: string;
  email?: string;
}

interface MemberCardProps {
  member: Member;
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
      <CardContent className="p-3 flex items-center gap-3">
        <div className="text-gray-400">
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{member.name || "Unnamed Member"}</div>
          
          {member.email && (
            <div className="flex items-center gap-1 truncate text-sm text-gray-500">
              <Mail className="h-3 w-3" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
        </div>
        
        <Badge variant="outline" className="ml-2">
          {currentElderId === "unassigned" ? "Unassigned" : "Assigned"}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
