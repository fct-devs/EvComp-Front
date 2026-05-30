import React from 'react';

export const TechPlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-brand-dark opacity-80 z-0"></div>
    {/* Decorative background grid */}
    <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
    
    <div className="z-10 bg-white/5 p-8 rounded-full border border-white/10 shadow-2xl backdrop-blur-md">
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Neutral Placeholder */}
        <circle cx="12" cy="12" r="10" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2"/>
        <circle cx="12" cy="12" r="4" fill="#3b82f6" fillOpacity="0.5"/>
      </svg>
    </div>
    
    <div className="z-10 space-y-2">
      <h1 className="text-4xl font-extrabold text-white tracking-tight">Ev<span className="text-brand-accent">Comp</span></h1>
      <p className="text-lg text-gray-300 max-w-md font-light">Sistema de Gestão de Presença e Certificação Acadêmica. FCT UNESP.</p>
    </div>
  </div>
);
