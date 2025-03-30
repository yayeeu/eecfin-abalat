
import React from 'react';
import AdminLink from '@/components/AdminLink';

const InvolvedHero: React.FC = () => {
  return (
    <section className="relative bg-eecfin-navy overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/54e6cd73-6658-4990-b0c6-d369f39e1cb9.png" 
          alt="Church background" 
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-eecfin-accent/40"></div>
      </div>
      <div className="container-custom text-center relative z-10 py-12">
        <div className="absolute top-2 right-2">
          <AdminLink />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Get Involved</h1>
        <p className="text-xl max-w-3xl mx-auto text-white/90">
          Discover ways to connect, serve, and grow as part of our church community.
        </p>
      </div>
    </section>
  );
};

export default InvolvedHero;
