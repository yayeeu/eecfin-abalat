
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContactLogs } from '@/lib/contactLogService';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface MyContactLogsProps {
  onMemberClick: (memberId: string) => void;
}

const memberTypeColors = {
  'regular': 'bg-purple-100 text-purple-800',
  'new': 'bg-green-100 text-green-800',
  'visitor': 'bg-blue-100 text-blue-800',
  'inactive': 'bg-gray-100 text-gray-800',
  'elder': 'bg-yellow-100 text-yellow-800'
} as const;

const MyContactLogs: React.FC<MyContactLogsProps> = ({ onMemberClick }) => {
  const { toast } = useToast();
  
  const { data: logs = [], isLoading, isError } = useQuery({
    queryKey: ['my-contact-logs'],
    queryFn: () => getContactLogs({ myLogs: true }),
    meta: {
      onError: (error: any) => {
        console.error('Error fetching contact logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load contact logs data. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was a problem loading your contact logs. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (logs.length === 0) {
    return (
      <Alert className="my-4 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No contact logs</AlertTitle>
        <AlertDescription>
          You don't have any contact logs yet. Contact logs will appear here when you record interactions with members.
        </AlertDescription>
      </Alert>
    );
  }

  // Group logs by member type
  const groupedLogs = logs.reduce((acc: Record<string, any[]>, log) => {
    const memberType = log.member?.role || 'regular';
    if (!acc[memberType]) {
      acc[memberType] = [];
    }
    acc[memberType].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-white rounded-lg border shadow-sm">
        <h3 className="font-medium mb-2">Member Types</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(memberTypeColors).map(([type, colorClass]) => (
            <span 
              key={type}
              className={`px-2 py-1 rounded-full text-xs capitalize ${colorClass}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {groupedLogs && Object.entries(groupedLogs).map(([memberType, logs]) => (
          <AccordionItem
            key={memberType}
            value={memberType}
            className="bg-white rounded-lg border shadow-sm"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="font-semibold capitalize">{memberType}</p>
                  <p className="text-sm text-muted-foreground">
                    {logs.length} contact{logs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                {logs.map((log) => (
                  <Card key={log.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent 
                      className="p-4"
                      onClick={() => log.member_id && onMemberClick(log.member_id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.member?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.contact_type} - {formatDistanceToNow(new Date(log.created_at || ''), { addSuffix: true })}
                          </p>
                          {log.notes && (
                            <p className="mt-2 text-sm">{log.notes}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default MyContactLogs;
