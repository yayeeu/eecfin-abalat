
import React from 'react';
import InvolvedHero from '@/components/get-involved/InvolvedHero';
import MinistrySection from '@/components/get-involved/MinistrySection';
import SmallGroupSection from '@/components/get-involved/SmallGroupSection';
import SupportSection from '@/components/get-involved/SupportSection';
import CTASection from '@/components/get-involved/CTASection';

const GetInvolved = () => {
  return (
    <div>
      <InvolvedHero />
      
      <div className="bg-white py-16">
        <div className="container-custom grid md:grid-cols-2 gap-8">
          {/* Left column - Ministries */}
          <div className="md:col-span-1">
            <MinistrySection />
          </div>
          
          {/* Right column - Small Groups */}
          <div className="md:col-span-1">
            <SmallGroupSection />
          </div>
        </div>
      </div>
      
      <SupportSection />
      <CTASection />
    </div>
  );
};

export default React.memo(GetInvolved);
