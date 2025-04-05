
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Member } from '@/types/database.types';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  return (
    <Card
      className={cn(
        "shadow-sm border hover:border-blue-300 hover:shadow-md transition-all",
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
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
