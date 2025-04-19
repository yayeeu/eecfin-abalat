
import React from 'react';
import SearchBar from '@/components/members/SearchBar';
import ViewToggle from '@/components/members/ViewToggle';

interface ContactLogsControlsProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: string;
  onViewModeChange: (mode: string) => void;
}

const ContactLogsControls: React.FC<ContactLogsControlsProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-4">
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
      />
      <div className="flex gap-2">
        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
    </div>
  );
};

export default ContactLogsControls;
