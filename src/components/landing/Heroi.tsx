'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Config, type Marca } from '@/data/landingData';

export function Heroi({ config, marcas }: { config: Config; marcas: Marca[] }) {
  const patrocinios = marcas.filter((m) => m.categoria === 'patrocinio');

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Luz ambiente dourada de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-accent/20 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge da Edição */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs md:text-sm font-semibold mb-8 backdrop-blur-sm animate-pulse">
          <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
          23ª Edição Oficial · FCT/UNESP Presidente Prudente
        </div>

        {/* Logo Principal e Título */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-[320px] md:max-w-[460px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/secompp26-logo.png"
              alt="SECOMPP 2026"
              className="w-full h-auto object-contain drop-shadow-2xl mx-auto"
            />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          {config.heroiTitulo}{' '}
          <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-yellow-200 bg-clip-text text-transparent">
            {config.heroiSubtitulo}
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
          {config.heroiTexto}
        </p>

        {/* Informações Rápidas */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white font-medium">28 de Setembro a 02 de Outubro de 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white font-medium">FCT/UNESP · Pres. Prudente - SP</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="text-white font-medium">Certificado Oficial UNESP</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cadastro"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-primary via-brand-accent to-yellow-400 text-black font-extrabold text-base sm:text-lg hover:brightness-110 transition-all shadow-xl shadow-brand-accent/25 hover:scale-105"
          >
            {config.rotuloInscricao}
          </Link>
          <a
            href="#programacao"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-base sm:text-lg hover:bg-white/10 transition-all"
          >
            Ver Programação Completa
          </a>
        </div>

        {/* Faixa de Patrocínio */}
        {patrocinios.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-8">
              Patrocínio Oficial
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-14 max-w-6xl mx-auto">
              {patrocinios.map((marca) => (
                <a
                  key={marca.id}
                  href={marca.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-85 hover:opacity-100 transition-all transform hover:scale-105 flex items-center justify-center shrink-0"
                  title={marca.nome}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={marca.logoSrc}
                    alt={marca.nome}
                    loading="lazy"
                    className={`object-contain transition-all ${
                      marca.tamanho === 'lg' ? 'h-10 sm:h-12 max-w-[150px]' : marca.tamanho === 'md' ? 'h-9 sm:h-11 max-w-[120px]' : 'h-8 sm:h-9 max-w-[90px]'
                    }`}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
