import React from 'react';
import { TechPlaceholder } from '../ui/TechPlaceholder';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-brand-dark">
      {/* Lado Esquerdo - Imagem/Ilustração */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-slate-900 border-r border-white/10 items-center justify-center relative shadow-2xl">
        <TechPlaceholder />
      </div>
      
      {/* Lado Direito - Formulário */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative min-h-[100dvh] md:min-h-0">
        {/* Logo EvComp */}
        <div className="absolute top-6 left-6 md:top-8 md:right-8 md:left-auto flex items-center space-x-2 opacity-80 z-20">
          <span className="font-bold text-lg tracking-wider text-white">EvComp</span>
        </div>
        
        {children}
      </div>
    </div>
  );
}
