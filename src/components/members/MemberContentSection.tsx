
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MemberMinistryAssignments from './MemberMinistryAssignments';
import MemberContactLogs from './MemberContactLogs';
import ElderAssignmentSelect from './ElderAssignmentSelect';
import { Member } from '@/types/database.types';

interface MemberContentSectionProps {
  member: Member;
  onDataChange: () => void;
}

const MemberContentSection: React.FC<MemberContentSectionProps> = ({ member, onDataChange }) => {
  return (
    <Tabs defaultValue="ministries" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="ministries">Ministry Assignments</TabsTrigger>
        <TabsTrigger value="elder">Elder Oversight</TabsTrigger>
        <TabsTrigger value="contact">Contact Log</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ministries" className="space-y-4">
        <MemberMinistryAssignments 
          member={member} 
          readOnly={false}
        />
      </TabsContent>
      
      <TabsContent value="elder" className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Assign an Elder</h3>
          <p className="text-sm text-gray-500">
            Select an elder to be responsible for this member
          </p>
        </div>
        
        <ElderAssignmentSelect 
          member={member} 
          onAssignmentChanged={onDataChange}
        />
      </TabsContent>
      
      <TabsContent value="contact" className="space-y-4">
        <MemberContactLogs 
          memberId={member.id}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MemberContentSection;
