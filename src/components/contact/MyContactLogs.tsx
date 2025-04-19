import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContactLogs, deleteContactLog } from '@/lib/contactLogService';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ContactLog } from '@/types/database.types';
import ContactLogItem from './ContactLogItem';
import ContactLogDialog from './ContactLogDialog';
import { Card } from '@/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

interface MyContactLogsProps {
  onMemberClick: (memberId: string) => void;
}

const LOGS_PER_PAGE = 20;

const MyContactLogs: React.FC<MyContactLogsProps> = ({ onMemberClick }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ContactLog | null>(null);
  
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

  const deleteMutation = useMutation({
    mutationFn: deleteContactLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-contact-logs'] });
      toast({
        title: 'Success',
        description: 'Contact log deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete contact log',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (log: ContactLog) => {
    setSelectedLog(log);
    setIsFormOpen(true);
  };

  const handleDelete = (logId: string) => {
    if (window.confirm('Are you sure you want to delete this contact log?')) {
      deleteMutation.mutate(logId);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedLog(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No contact logs</AlertTitle>
        <AlertDescription>
          You don't have any contact logs yet.
        </AlertDescription>
      </Alert>
    );
  }

  const sortedLogs = [...logs].sort((a, b) => {
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  const totalPages = Math.ceil(sortedLogs.length / LOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
  const endIndex = startIndex + LOGS_PER_PAGE;
  const currentLogs = sortedLogs.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <Card>
        {currentLogs.map((log) => (
          <ContactLogItem
            key={log.id}
            log={log}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage === 1 ? (
              <Button 
                variant="outline" 
                size="default"
                className="gap-1 pl-2.5"
                disabled={true}
              >
                <span className="flex items-center gap-1">
                  <Loader2 className="h-4 w-4" />
                  Previous
                </span>
              </Button>
            ) : (
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage === totalPages ? (
              <Button 
                variant="outline" 
                size="default"
                className="gap-1 pr-2.5"
                disabled={true}
              >
                <span className="flex items-center gap-1">
                  Next
                  <Loader2 className="h-4 w-4" />
                </span>
              </Button>
            ) : (
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      <ContactLogDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        selectedLog={selectedLog}
        onSuccess={closeForm}
      />
    </div>
  );
};

export default MyContactLogs;
