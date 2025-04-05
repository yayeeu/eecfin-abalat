
import React from 'react';
import { Users, MapPin } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ViewToggleProps {
  viewMode: string;
  onViewModeChange: (value: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <Tabs
      value={viewMode}
      onValueChange={onViewModeChange}
      className="w-auto"
    >
      <TabsList className="grid w-[180px] grid-cols-2">
        <TabsTrigger value="list" className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          List
        </TabsTrigger>
        
        <TabsTrigger value="map" className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          Map
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewToggle;
