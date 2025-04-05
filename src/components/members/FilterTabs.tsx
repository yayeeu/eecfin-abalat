
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flag, User, Users } from 'lucide-react';

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  customTabs?: Tab[];
}

const FilterTabs: React.FC<FilterTabsProps> = ({ 
  activeTab, 
  onTabChange,
  customTabs
}) => {
  const defaultTabs: Tab[] = [
    { value: 'all', label: 'All', icon: <Users className="h-4 w-4 mr-1" /> },
    { value: 'flagged', label: 'Flagged', icon: <Flag className="h-4 w-4 mr-1" color="orange" /> },
    { value: 'my-members', label: 'My Members', icon: <User className="h-4 w-4 mr-1" /> }
  ];

  const tabs = customTabs || defaultTabs;

  return (
    <TabsList className="bg-muted/50 mb-4">
      {tabs.map(tab => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={activeTab === tab.value ? 'font-medium' : ''}
          data-state={activeTab === tab.value ? 'active' : 'inactive'}
        >
          <div className="flex items-center">
            {tab.icon}
            {tab.label}
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default FilterTabs;
