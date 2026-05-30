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
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        {/* Logo EvComp */}
        <div className="absolute top-8 right-8 flex items-center space-x-2 opacity-80">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span className="font-bold text-lg tracking-wider">EvComp</span>
        </div>
        
        {children}
      </div>
    </div>
  );
}
