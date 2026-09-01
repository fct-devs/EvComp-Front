'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Config } from '@/data/landingData';

const secoes = [
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'programacao', rotulo: 'Programação' },
  { id: 'ingressos', rotulo: 'Ingressos' },
  { id: 'localizacao', rotulo: 'Localização' },
  { id: 'duvidas', rotulo: 'Dúvidas' },
  { id: 'apoio', rotulo: 'Apoio' },
];

export function Cabecalho({ config }: { config: Config }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/secompp26-logo.png"
              alt="SECOMPP 2026"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {secoes.map((secao) => (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              className="text-sm font-medium text-gray-300 hover:text-brand-accent transition-colors"
            >
              {secao.rotulo}
            </a>
          ))}
        </nav>

        {/* Ações Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Acessar Conta
          </Link>
          <Link
            href="/cadastro"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-brand-accent/20"
          >
            {config.rotuloInscricao}
          </Link>
        </div>

        {/* Menu Mobile Hambúrguer */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {menuAberto && (
        <div className="md:hidden bg-slate-950 border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4">
          {secoes.map((secao) => (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              onClick={() => setMenuAberto(false)}
              className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-brand-accent hover:bg-white/5 rounded-md"
            >
              {secao.rotulo}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMenuAberto(false)}
              className="w-full text-center py-2.5 border border-white/20 rounded-lg text-white font-medium text-sm hover:bg-white/5"
            >
              Acessar Conta
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setMenuAberto(false)}
              className="w-full text-center py-2.5 rounded-lg bg-brand-accent text-black font-bold text-sm shadow-md"
            >
              {config.rotuloInscricao}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
