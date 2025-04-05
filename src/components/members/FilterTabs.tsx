
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  value: string;
  label: string;
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
    { value: 'all', label: 'All' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'my-members', label: 'My Members' }
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
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default FilterTabs;
