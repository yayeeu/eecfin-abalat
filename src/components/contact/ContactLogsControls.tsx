
import React from 'react';

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
  // Return empty div as we're removing the controls
  return <div className="mb-4"></div>;
};

export default ContactLogsControls;
