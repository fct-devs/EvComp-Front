'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export const Navbar = ({ role = 'PARTICIPANTE' }: { role?: 'PARTICIPANTE' | 'COLETOR' | 'ADMIN' }) => {
  const [actualRole, setActualRole] = useState<'PARTICIPANTE' | 'COLETOR' | 'ADMIN'>(role);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const displayRole = mounted ? actualRole : role;

  const getLinkClass = (path: string, exact: boolean = false) => {
    if (!pathname) return "text-gray-300 hover:text-white transition-colors block py-2 md:py-0 text-base font-light tracking-wide";
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return isActive 
      ? "text-brand-accent transition-colors block py-2 md:py-0 text-base font-medium tracking-wide" 
      : "text-gray-300 hover:text-white transition-colors block py-2 md:py-0 text-base font-light tracking-wide";
  };

  const regularLinks = (
    <>
      <Link href={displayRole === 'ADMIN' ? '/admin' : '/dashboard'} className={getLinkClass(displayRole === 'ADMIN' ? '/admin' : '/dashboard', true)}>Home</Link>
      
      {displayRole !== 'ADMIN' && (
        <Link href="/dashboard/eventos" className={getLinkClass('/dashboard/eventos')}>Eventos</Link>
      )}
      
      {(displayRole === 'PARTICIPANTE' || displayRole === 'COLETOR') && (
        <>
          <Link href="/dashboard/minhas-inscricoes" className={getLinkClass('/dashboard/minhas-inscricoes')}>Inscrições</Link>
          <Link href="/dashboard/certificados" className={getLinkClass('/dashboard/certificados')}>Certificados</Link>
        </>
      )}
      
      {displayRole === 'ADMIN' && (
        <>
          <Link href="/admin/eventos" className={getLinkClass('/admin/eventos')}>Gestão</Link>
          <Link href="/admin/coletores" className={getLinkClass('/admin/coletores')}>Coletores</Link>
          <Link href="/admin/relatorios" className={getLinkClass('/admin/relatorios')}>Relatórios</Link>
        </>
      )}
      
      {displayRole === 'COLETOR' && (
        <Link href="/coletor/scan" className={getLinkClass('/coletor/scan')}>Coletar Presença</Link>
      )}
    </>
  );

  return (
    <nav className="w-full bg-black border-b border-white/20 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 lg:px-12 h-20 max-w-[1400px] mx-auto">
        
        <div className="flex items-center">
          <Link href={displayRole === 'ADMIN' ? '/admin' : '/dashboard'}>
            <img 
              src="/bannerSecompp3semFundoBranco.png" 
              alt="SECOMPP 26" 
              className="h-26 md:h-28 w-auto hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {regularLinks}
          
          <Link href="/perfil" className="bg-brand-accent hover:bg-yellow-400 text-black px-6 py-2 rounded-md font-medium text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md">
            Perfil
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-brand-accent transition-colors focus:outline-none"
            aria-label="Alternar menu mobile"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 flex flex-col space-y-4 px-6 pt-4 pb-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {regularLinks}
          <Link href="/perfil" className="bg-brand-accent text-black px-4 py-3 rounded-md font-medium text-base text-center mt-2">
            Perfil
          </Link>
        </div>
      )}
    </nav>
  );
};