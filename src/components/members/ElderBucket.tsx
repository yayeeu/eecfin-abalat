
import React from 'react';
import { useDrop } from 'react-dnd';
import MemberCard from './MemberCard';
import { Member } from '@/types/database.types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ElderBucketProps {
  elderId: string | null;
  elderName: string;
  members: Member[];
  onMoveMember: (memberId: string, elderId: string | null) => void;
}

const ElderBucket: React.FC<ElderBucketProps> = ({ 
  elderId, 
  elderName, 
  members, 
  onMoveMember 
}) => {
  // Set up drop target
  const [{ isOver }, drop] = useDrop({
    accept: 'MEMBER',
    drop: (item: { id: string }) => {
      onMoveMember(item.id, elderId);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <div 
      ref={drop}
      className={`
        p-2 rounded-md min-h-[200px] transition-colors
        ${isOver ? 'bg-blue-50 border-2 border-blue-300' : 'border border-gray-200'}
      `}
    >
      <h3 className="text-sm font-medium mb-2 text-gray-500">
        {members.length} {members.length === 1 ? 'member' : 'members'}
      </h3>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {members.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No members assigned</p>
          ) : (
            members.map(member => (
              <MemberCard 
                key={member.id}
                member={member}
                currentElderId={elderId}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ElderBucket;
