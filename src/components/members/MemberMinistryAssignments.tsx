
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Member, Ministry } from '@/types/database.types';
import { getMemberMinistries, assignMinistryToMember, removeMinistryFromMember } from '@/lib/memberService';
import { getMinistries } from '@/lib/ministryService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MemberMinistryAssignmentsProps {
  member: Member;
  readOnly?: boolean;
  onAssignmentChanged?: () => void;
}

const MemberMinistryAssignments: React.FC<MemberMinistryAssignmentsProps> = ({ 
  member, 
  readOnly = false,
  onAssignmentChanged
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>('');
  
  // Fetch member's ministries
  const { 
    data: memberMinistries, 
    isLoading: ministriesLoading,
    isError: ministriesError
  } = useQuery({
    queryKey: ['memberMinistries', member.id],
    queryFn: () => getMemberMinistries(member.id),
    enabled: !!member.id
  });
  
  // Fetch all ministries for dropdown
  const {
    data: allMinistries,
    isLoading: allMinistriesLoading
  } = useQuery({
    queryKey: ['ministries'],
    queryFn: () => getMinistries(true), // Only active ministries
    enabled: !readOnly // Only load if not in read-only mode
  });
  
  // Filter out ministries that the member is already part of
  const availableMinistries = React.useMemo(() => {
    if (!allMinistries || !memberMinistries) return [];
    
    return allMinistries.filter(ministry => 
      !memberMinistries.some(m => m.id === ministry.id)
    );
  }, [allMinistries, memberMinistries]);
  
  // Reset selected ministry when available ministries change
  useEffect(() => {
    if (availableMinistries.length > 0 && !selectedMinistryId) {
      setSelectedMinistryId(availableMinistries[0].id);
    } else if (availableMinistries.length === 0) {
      setSelectedMinistryId('');
    }
  }, [availableMinistries, selectedMinistryId]);
  
  // Mutations for assigning and removing ministries
  const assignMinistryMutation = useMutation({
    mutationFn: () => assignMinistryToMember(member.id, selectedMinistryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberMinistries', member.id] });
      toast({
        title: 'Ministry assigned',
        description: 'The member has been assigned to this ministry.'
      });
      if (onAssignmentChanged) {
        onAssignmentChanged();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to assign ministry: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  const removeMinistryMutation = useMutation({
    mutationFn: (ministryId: string) => removeMinistryFromMember(member.id, ministryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberMinistries', member.id] });
      toast({
        title: 'Ministry removed',
        description: 'The member has been removed from this ministry.'
      });
      if (onAssignmentChanged) {
        onAssignmentChanged();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to remove ministry: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  const handleAssignMinistry = () => {
    if (selectedMinistryId) {
      assignMinistryMutation.mutate();
    }
  };
  
  const handleRemoveMinistry = (ministryId: string) => {
    removeMinistryMutation.mutate(ministryId);
  };
  
  if (ministriesLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading ministries...</span>
      </div>
    );
  }
  
  if (ministriesError) {
    return (
      <div className="text-red-500">
        Error loading ministry assignments.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {memberMinistries && memberMinistries.length > 0 ? (
          memberMinistries.map(ministry => (
            <Badge 
              key={ministry.id} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {ministry.name}
              {!readOnly && (
                <button 
                  onClick={() => handleRemoveMinistry(ministry.id)} 
                  className="ml-1 h-4 w-4 rounded-full hover:bg-slate-300 inline-flex items-center justify-center"
                  aria-label={`Remove from ${ministry.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))
        ) : (
          <div className="text-gray-500 text-sm">No ministries assigned</div>
        )}
      </div>
      
      {!readOnly && (
        <div className="flex items-center gap-2">
          <Select
            value={selectedMinistryId}
            onValueChange={setSelectedMinistryId}
            disabled={availableMinistries.length === 0 || allMinistriesLoading}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a ministry" />
            </SelectTrigger>
            <SelectContent>
              {availableMinistries.map(ministry => (
                <SelectItem key={ministry.id} value={ministry.id}>
                  {ministry.name}
                </SelectItem>
              ))}
              {availableMinistries.length === 0 && (
                <SelectItem value="none" disabled>
                  No available ministries
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAssignMinistry}
            disabled={!selectedMinistryId || assignMinistryMutation.isPending || availableMinistries.length === 0}
          >
            {assignMinistryMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Plus className="h-4 w-4 mr-1" />
            Assign
          </Button>
        </div>
      )}
    </div>
  );
};

export default MemberMinistryAssignments;
