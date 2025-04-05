
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { getMemberTypes, getMembersByType } from '@/lib/memberTypeService';
import { Loader2 } from 'lucide-react';

const MemberTypeStats: React.FC = () => {
  const { data: memberTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['member-types'],
    queryFn: getMemberTypes
  });

  const { data: membersByType, isLoading: membersLoading } = useQuery({
    queryKey: ['members-by-type'],
    queryFn: getMembersByType
  });

  if (typesLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {memberTypes?.map((type) => {
        const count = membersByType?.find(m => m.typeId === type.id)?.count || 0;
        
        return (
          <Card key={type.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">{type.name}</div>
              <div className="text-2xl font-bold mt-1">{count}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MemberTypeStats;
