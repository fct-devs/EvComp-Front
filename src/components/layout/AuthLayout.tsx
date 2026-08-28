import React from 'react';
import { TechPlaceholder } from '../ui/TechPlaceholder';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-brand-dark">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-black border-r border-white/10 items-center justify-center relative shadow-2xl">
        <TechPlaceholder />
      </div>
      
      <div className="w-full md:w-1/2 lg:w-2/5 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative min-h-[100dvh] md:min-h-0">
        
        <div className="absolute top-6 left-6 md:top-8 md:right-8 md:left-auto flex items-center opacity-80 hover:opacity-100 transition-opacity z-20">
          <img 
            src="/bannerSecompp3semFundoBranco.png" 
            alt="SECOMPP 26" 
            className="w-auto h-34 md:h-36"
          />
        </div>
        
        {children}
      </div>
    </div>
  );
}