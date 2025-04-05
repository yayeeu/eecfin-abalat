
import React from 'react';
import { Users, Flag, User } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="w-full max-w-md grid grid-cols-3">
      <TabsTrigger value="all" className="flex items-center">
        <Users className="h-4 w-4 mr-1" />
        All
      </TabsTrigger>
      <TabsTrigger value="flagged" className="flex items-center">
        <Flag className="h-4 w-4 mr-1" />
        Flagged
      </TabsTrigger>
      <TabsTrigger value="my-members" className="flex items-center">
        <User className="h-4 w-4 mr-1" />
        My Members
      </TabsTrigger>
    </TabsList>
  );
};

export default FilterTabs;
