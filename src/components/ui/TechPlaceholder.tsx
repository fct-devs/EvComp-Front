import React from 'react';

export const TechPlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
    
    <div 
      className="absolute inset-0 z-0 opacity-20" 
      style={{ backgroundImage: 'radial-gradient(#FCBF38 1px, transparent 1px)', backgroundSize: '30px 30px' }}
    ></div>
    
    <div className="z-10 flex flex-col items-center space-y-4">
      <div className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-2xl">
        Ev<span className="text-brand-accent">Comp</span>
      </div>
      
      <p className="text-base md:text-lg text-gray-300 max-w-md font-light mx-auto leading-relaxed">
        Sistema de Gestão de Eventos da Computação
      </p>
    </div>
  </div>
);