
import React from 'react';
import { Separator } from "@/components/ui/separator";

const WhoWeHero = () => {
  return (
    <section className="relative bg-eecfin-navy overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/54e6cd73-6658-4990-b0c6-d369f39e1cb9.png" 
          alt="Church background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-eecfin-navy/50"></div>
      </div>
      <div className="container-custom text-center relative z-10 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Who We Are</h1>
        <p className="text-xl max-w-3xl mx-auto text-white/90 mb-4">
          EECFIN strives to be a vibrant, multicultural church where Ethiopian Christians and people from all backgrounds 
          can worship together, grow in faith, and serve our community in Finland with the love of Christ.
        </p>
        <div className="flex items-center justify-center mt-6">
          <Separator className="w-24 bg-eecfin-gold h-0.5" />
        </div>
      </div>
    </section>
  );
};

export default WhoWeHero;
