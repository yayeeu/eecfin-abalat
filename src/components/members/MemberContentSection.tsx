
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ElderBucket from './ElderBucket';
import { Member } from '@/types/database.types';
import { AlertCircle } from 'lucide-react';

interface MemberContentSectionProps {
  elders: any[];
  unassignedMembers: Member[];
  elderGroups: { [key: string]: Member[] };
  onMoveMember: (memberId: string, elderId: string | null) => void;
}

const MemberContentSection: React.FC<MemberContentSectionProps> = ({ 
  elders, 
  unassignedMembers, 
  elderGroups,
  onMoveMember 
}) => {
  useEffect(() => {
    console.log('MemberContentSection rendered with elders:', elders);
    console.log('Unassigned members:', unassignedMembers.length);
    console.log('Elder groups:', elderGroups);
  }, [elders, unassignedMembers, elderGroups]);

  if (!elders || elders.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg flex items-start">
          <AlertCircle className="text-yellow-500 h-6 w-6 mr-4 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">No elders available</h3>
            <p className="text-yellow-700 mt-1">
              No elders found in the system. Please add members with the elder role to start assigning regular members to elders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Members</h1>
      </div>
      
      <p className="text-gray-600 mb-8">
        Drag and drop members between elders to reassign them. Members without assigned elders are listed under "Unassigned".
      </p>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Unassigned Members Bucket */}
          <Card className="bg-gray-50 border-dashed">
            <CardHeader>
              <CardTitle>Unassigned Members</CardTitle>
              <CardDescription>Members not assigned to any elder ({unassignedMembers.length})</CardDescription>
            </CardHeader>
            <CardContent>
              <ElderBucket 
                elderId={null}
                elderName="Unassigned"
                members={unassignedMembers}
                onMoveMember={onMoveMember}
              />
            </CardContent>
          </Card>

          {/* Elder Buckets */}
          {elders && elders.map(elder => (
            <Card key={elder.id} className="bg-white">
              <CardHeader>
                <CardTitle>{elder.name || 'Unnamed Elder'}</CardTitle>
                <CardDescription>
                  {elder.email && `Email: ${elder.email}`}
                  {elder.phone && <><br />Phone: {elder.phone}</>}
                  <div className="mt-1">
                    Assigned members: {(elderGroups[elder.id] || []).length}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ElderBucket 
                  elderId={elder.id}
                  elderName={elder.name || "Elder"}
                  members={elderGroups[elder.id] || []}
                  onMoveMember={onMoveMember}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default MemberContentSection;
