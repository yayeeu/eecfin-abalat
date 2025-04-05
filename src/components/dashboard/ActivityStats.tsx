
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContactStats } from '@/hooks/useContactStats';
import { Loader2 } from 'lucide-react';

const ActivityStats: React.FC = () => {
  const { allStats, allLoading, myStats, myLoading } = useContactStats();

  const renderActivityBox = (stats: any, title: string, isLoading: boolean) => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!stats) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-4">No activity data available</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">This Week</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded">
                  <div className="text-xs text-muted-foreground">Total Contacted</div>
                  <div className="text-xl font-bold">{stats.thisWeek.total}</div>
                </div>
                <div className="space-y-1">
                  {Object.entries(stats.thisWeek.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span>{type}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Last Week</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded">
                  <div className="text-xs text-muted-foreground">Total Contacted</div>
                  <div className="text-xl font-bold">{stats.lastWeek.total}</div>
                </div>
                <div className="space-y-1">
                  {Object.entries(stats.lastWeek.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span>{type}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="my" className="space-y-4">
      <TabsList>
        <TabsTrigger value="my">My Activity</TabsTrigger>
        <TabsTrigger value="all">All Activity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="my">
        {renderActivityBox(myStats, 'My Contact Activity', myLoading)}
      </TabsContent>
      
      <TabsContent value="all">
        {renderActivityBox(allStats, 'Church-wide Contact Activity', allLoading)}
      </TabsContent>
    </Tabs>
  );
};

export default ActivityStats;
