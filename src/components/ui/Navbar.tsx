import React from 'react';
import Link from 'next/link';

export const Navbar = ({ role = 'PARTICIPANTE' }: { role?: 'PARTICIPANTE' | 'COLETOR' | 'ADMIN' }) => {
  return (
    <nav className="w-full h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <Link href={role === 'ADMIN' ? '/admin' : '/dashboard'} className="font-bold text-lg tracking-wider text-white">EvComp</Link>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
        <Link href={role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-gray-300 hover:text-white transition-colors">HOME / EVENTOS</Link>
        
        {role === 'ADMIN' && (
          <>
            <Link href="/admin/eventos" className="text-gray-300 hover:text-white transition-colors">GESTÃO DE EVENTOS</Link>
            <Link href="/admin/participantes" className="text-gray-300 hover:text-white transition-colors">PARTICIPANTES</Link>
            <Link href="/admin/relatorios" className="text-gray-300 hover:text-white transition-colors">RELATÓRIOS</Link>
          </>
        )}
        
        {role === 'COLETOR' && (
          <Link href="/coletor/scan" className="text-brand-accent hover:text-blue-400 transition-colors">COLETAR PRESENÇA</Link>
        )}

        <Link href="/perfil" className="text-white hover:text-brand-accent transition-colors border-b-2 border-brand-accent pb-1">PROFILE</Link>
      </div>
    </nav>
  );
};
