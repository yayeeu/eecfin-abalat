
import React from "react";
import { useDrop } from "react-dnd";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface Member {
  id: string;
  name?: string;
  email?: string;
}

interface ElderBucketProps {
  elderId: string | null;
  elderName: string;
  members: Member[];
  onMemberDrop?: (memberId: string, targetElderId: string) => void;
  onMoveMember?: (memberId: string, elderId: string | null) => void;
}

const ElderBucket: React.FC<ElderBucketProps> = ({
  elderId,
  elderName,
  members,
  onMemberDrop,
  onMoveMember,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "MEMBER",
    drop: (item: { id: string }) => {
      if (onMemberDrop && elderId !== null) {
        onMemberDrop(item.id, elderId);
      }
      if (onMoveMember) {
        onMoveMember(item.id, elderId);
      }
    },
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
            <Card key={member.id} className="cursor-move">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {member.name || "Unnamed Member"}
                    </p>
                    <p className="text-sm text-gray-500">{member.email || ""}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {elderId === null || elderId === "unassigned" ? "Unassigned" : "Assigned"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ElderBucket;
