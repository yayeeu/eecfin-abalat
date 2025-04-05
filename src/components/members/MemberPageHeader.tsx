
import React from 'react';

interface MemberPageHeaderProps {
  title: string;
  description: string;
}

const MemberPageHeader: React.FC<MemberPageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-eecfin-navy">
        {title}
      </h1>
      <p className="text-gray-500 mt-2">
        {description}
      </p>
    </div>
  );
};

export default MemberPageHeader;
