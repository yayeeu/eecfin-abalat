
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContactStats } from '@/hooks/useContactStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ActivityStats: React.FC = () => {
  const { 
    allStats, allLoading, allError,
    myStats, myLoading, myError 
  } = useContactStats();
  
  const renderContactsTable = (stats: any, loading: boolean, error: unknown) => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center py-8 text-red-500">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <span>Error loading contact statistics</span>
        </div>
      );
    }
    
    if (!stats) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No contact data available
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek?.total || 0}</div>
              <div className="text-xs text-muted-foreground">Total contacts made</div>
              
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact Type</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.thisWeek?.byType && Object.entries(stats.thisWeek.byType).map(([type, count]) => (
                    <TableRow key={type}>
                      <TableCell>{type}</TableCell>
                      <TableCell className="text-right">{String(count)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Last Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lastWeek?.total || 0}</div>
              <div className="text-xs text-muted-foreground">Total contacts made</div>
              
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact Type</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.lastWeek?.byType && Object.entries(stats.lastWeek.byType).map(([type, count]) => (
                    <TableRow key={type}>
                      <TableCell>{type}</TableCell>
                      <TableCell className="text-right">{String(count)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="my">
          <TabsList className="mb-4">
            <TabsTrigger value="my">My Activity</TabsTrigger>
            <TabsTrigger value="all">All Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="my">
            {renderContactsTable(myStats, myLoading, myError)}
          </TabsContent>
          <TabsContent value="all">
            {renderContactsTable(allStats, allLoading, allError)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityStats;
