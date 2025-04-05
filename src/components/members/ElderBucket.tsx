
import React from "react";
import { useDrop } from "react-dnd";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import MemberCard from "./MemberCard";
import { Member } from "@/types/database.types";

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
  onMoveMember,
}) => {
  const handleDrop = (item: { id: string }) => {
    console.log(`Dropping member ${item.id} onto elder ${elderId || 'unassigned'}`);
    onMoveMember(item.id, elderId || "unassigned");
  };

  const [{ isOver }, drop] = useDrop({
    accept: "MEMBER",
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`p-4 rounded-lg border-2 ${
        isOver ? "border-primary bg-primary/10" : "border-gray-200"
      } min-h-[200px] transition-colors`}
    >
      <h3 className="font-semibold text-lg mb-3">{elderName}</h3>
      <div className="space-y-2">
        {members.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No members assigned</p>
        ) : (
          members.map((member) => (
            <MemberCard 
              key={member.id}
              member={member} 
              currentElderId={elderId || "unassigned"}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ElderBucket;
