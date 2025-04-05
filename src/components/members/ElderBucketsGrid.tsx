
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ElderBucket from "./ElderBucket";
import { SimpleElder, SimpleMember, ElderAssignmentsMap } from "@/hooks/useElderAssignments";

interface ElderBucketsGridProps {
  elders: SimpleElder[];
  members: SimpleMember[];
  elderAssignments: ElderAssignmentsMap;
  onMemberDrop: (memberId: string, targetElderId: string) => void;
}

const ElderBucketsGrid: React.FC<ElderBucketsGridProps> = ({
  elders,
  members,
  elderAssignments,
  onMemberDrop
}) => {
  const getMembersForElder = (elderId: string) => {
    const memberIds = elderAssignments[elderId] || [];
    return members.filter(member => memberIds.includes(member.id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <ElderBucket
            elderId="unassigned"
            elderName="Unassigned Members"
            members={getMembersForElder("unassigned")}
            onMemberDrop={onMemberDrop}
          />
        </div>

        {elders.map((elder) => (
          <div key={elder.id} className="col-span-1">
            <ElderBucket
              elderId={elder.id}
              elderName={elder.name || "Unknown Elder"}
              members={getMembersForElder(elder.id)}
              onMemberDrop={onMemberDrop}
            />
          </div>
        ))}
      </div>
    </DndProvider>
  );
};

export default ElderBucketsGrid;
