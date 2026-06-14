'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const Navbar = ({ role = 'PARTICIPANTE' }: { role?: 'PARTICIPANTE' | 'COLETOR' | 'ADMIN' }) => {
  const [actualRole, setActualRole] = useState<'PARTICIPANTE' | 'COLETOR' | 'ADMIN'>(role);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getCookie = (name: string) => document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
    
    const userRoleCookie = getCookie('user_role');
    const isColetorCookie = getCookie('is_coletor');

    if (userRoleCookie === 'ADMIN') {
      setActualRole('ADMIN');
    } else if (userRoleCookie === 'COLETOR' || isColetorCookie === 'true') {
      setActualRole('COLETOR');
    } else if (userRoleCookie === 'PARTICIPANTE') {
      setActualRole('PARTICIPANTE');
    }
  }, []);

  // Para evitar hydration mismatch visual abrupto
  const displayRole = mounted ? actualRole : role;

  return (
    <nav className="w-full h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <Link href={displayRole === 'ADMIN' ? '/admin' : '/dashboard'} className="font-bold text-lg tracking-wider text-white">EvComp</Link>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
        <Link href={displayRole === 'ADMIN' ? '/admin' : '/dashboard'} className="text-gray-300 hover:text-white transition-colors">HOME</Link>
        {displayRole !== 'ADMIN' && (
          <Link href="/dashboard/eventos" className="text-gray-300 hover:text-white transition-colors">EVENTOS</Link>
        )}
        {(displayRole === 'PARTICIPANTE' || displayRole === 'COLETOR') && (
          <>
            <Link href="/dashboard/minhas-inscricoes" className="text-gray-300 hover:text-white transition-colors">MINHAS INSCRIÇÕES</Link>
            <Link href="/dashboard/certificados" className="text-gray-300 hover:text-white transition-colors">CERTIFICADOS</Link>
          </>
        )}
        
        {displayRole === 'ADMIN' && (
          <>
            <Link href="/admin/eventos" className="text-gray-300 hover:text-white transition-colors">GESTÃO DE EVENTOS</Link>
            <Link href="/admin/coletores" className="text-gray-300 hover:text-white transition-colors">COLETORES</Link>
            <Link href="/admin/relatorios" className="text-gray-300 hover:text-white transition-colors">RELATÓRIOS</Link>
          </>
        )}
        
        {displayRole === 'COLETOR' && (
          <Link href="/coletor/scan" className="text-brand-accent hover:text-blue-400 transition-colors">COLETAR PRESENÇA</Link>
        )}

        <Link href="/perfil" className="text-white hover:text-brand-accent transition-colors border-b-2 border-brand-accent pb-1">PROFILE</Link>
      </div>
    </nav>
  );
};
