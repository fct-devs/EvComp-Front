import React from 'react';

export const TechPlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
    
    <div 
      className="absolute inset-0 z-0 opacity-20" 
      style={{ backgroundImage: 'radial-gradient(#FCBF38 1px, transparent 1px)', backgroundSize: '30px 30px' }}
    ></div>
    
    <div className="z-10 flex flex-col items-center space-y-8">
      <img 
        src="/bannerSecompp3semFundoBranco.png" 
        alt="Logotipo Oficial SECOMPP 26" 
        className="w-auto h-40 md:h-48 drop-shadow-2xl"
      />
      
      <p className="text-lg text-gray-300 max-w-md font-light mx-auto">
        23ª Semana do Curso de Ciência da Computação da FCT-Unesp
      </p>
    </div>
  </div>
);