'use client';

import React from 'react';
import Image from 'next/image';
import { type CartaoSobre } from '@/data/landingData';

export function Sobre({ cartoes }: { cartoes: CartaoSobre[] }) {
  return (
    <section id="sobre" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-3">
            Conheça o Evento
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tradição, Tecnologia e Inovação na FCT/UNESP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cartoes.map((cartao) => (
            <div
              key={cartao.id}
              className="p-8 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-brand-accent/40 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center mb-6 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cartao.logoSrc}
                    alt={cartao.titulo}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{cartao.titulo}</h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base font-light whitespace-pre-line">
                  {cartao.texto}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-brand-accent text-sm font-semibold">
                <span>FCT-UNESP · Pres. Prudente</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Pilares do Evento */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-black text-brand-accent mb-2">33+</div>
            <div className="text-sm font-semibold text-white">Atividades Oficiais</div>
            <div className="text-xs text-gray-400 mt-1">Minicursos práticos e sessões</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-black text-brand-accent mb-2">5</div>
            <div className="text-sm font-semibold text-white">Dias Imersivos</div>
            <div className="text-xs text-gray-400 mt-1">De 28/09 a 02/10 de 2026</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-black text-brand-accent mb-2">4+</div>
            <div className="text-sm font-semibold text-white">Palestrantes Magnos</div>
            <div className="text-xs text-gray-400 mt-1">Líderes de IA, Engenharia e Tech</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-black text-brand-accent mb-2">100%</div>
            <div className="text-sm font-semibold text-white">Certificado UNESP</div>
            <div className="text-xs text-gray-400 mt-1">Horas complementares oficiais</div>
          </div>
        </div>
      </div>
    </section>
  );
}
