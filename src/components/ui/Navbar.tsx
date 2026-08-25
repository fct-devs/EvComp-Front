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

  // Fecha o menu mobile quando a rota muda
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Para evitar hydration mismatch visual abrupto
  const displayRole = mounted ? actualRole : role;

  const getLinkClass = (path: string, exact: boolean = false) => {
    if (!pathname) return "text-gray-300 hover:text-white transition-colors block py-2 md:py-0";
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return isActive 
      ? "text-white border-l-4 md:border-l-0 md:border-b-2 border-brand-accent pl-2 md:pl-0 md:pb-1 transition-colors block py-2 md:py-0 bg-slate-800/50 md:bg-transparent" 
      : "text-gray-300 hover:text-white transition-colors block py-2 md:py-0 pl-2 md:pl-0";
  };

  const navLinks = (
    <>
      <Link href={displayRole === 'ADMIN' ? '/admin' : '/dashboard'} className={getLinkClass(displayRole === 'ADMIN' ? '/admin' : '/dashboard', true)}>HOME</Link>
      {displayRole !== 'ADMIN' && (
        <Link href="/dashboard/eventos" className={getLinkClass('/dashboard/eventos')}>EVENTOS</Link>
      )}
      {(displayRole === 'PARTICIPANTE' || displayRole === 'COLETOR') && (
        <>
          <Link href="/dashboard/minhas-inscricoes" className={getLinkClass('/dashboard/minhas-inscricoes')}>MINHAS INSCRIÇÕES</Link>
          <Link href="/dashboard/certificados" className={getLinkClass('/dashboard/certificados')}>CERTIFICADOS</Link>
          <Link href="/dashboard/pagamentos" className={getLinkClass('/dashboard/pagamentos')}>PAGAMENTOS</Link>
        </>
      )}

      {displayRole === 'ADMIN' && (
        <>
          <Link href="/admin/eventos" className={getLinkClass('/admin/eventos')}>GESTÃO DE EVENTOS</Link>
          <Link href="/admin/coletores" className={getLinkClass('/admin/coletores')}>COLETORES</Link>
          <Link href="/admin/relatorios" className={getLinkClass('/admin/relatorios')}>RELATÓRIOS</Link>
          <Link href="/admin/pagamentos" className={getLinkClass('/admin/pagamentos')}>PAGAMENTOS</Link>
        </>
      )}
      
      {displayRole === 'COLETOR' && (
        <Link href="/coletor/scan" className={getLinkClass('/coletor/scan')}>COLETAR PRESENÇA</Link>
      )}

      <Link href="/perfil" className={getLinkClass('/perfil')}>PERFIL</Link>
    </>
  );

  return (
    <nav className="w-full bg-slate-900 border-b border-white/10 sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between px-6 lg:px-12 h-16">
        <div className="flex items-center space-x-2">
          <Link href={displayRole === 'ADMIN' ? '/admin' : '/dashboard'} className="font-bold text-lg tracking-wider text-white">EvComp</Link>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          {navLinks}
        </div>

        {/* Menu Hamburger Mobile */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Alternar menu mobile"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/10 flex flex-col space-y-1 px-4 pt-2 pb-4 text-sm font-semibold shadow-inner animate-in slide-in-from-top-2 duration-200">
          {navLinks}
        </div>
      )}
    </nav>
  );
};
