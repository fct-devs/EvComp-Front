'use client';

import React from 'react';
import Link from 'next/link';
import { type Lote, type Config } from '@/data/landingData';

export function Informacoes({ lotes, config }: { lotes: Lote[]; config: Config }) {
  return (
    <section id="ingressos" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-3">
            Inscrições e Passes
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Garanta Sua Participação na 23ª SECOMPP
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            Minicursos com vagas estritamente limitadas para garantir excelência de aprendizado prático nos laboratórios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {lotes.map((lote) => (
            <div
              key={lote.id}
              className={`rounded-3xl p-8 transition-all duration-300 relative flex flex-col justify-between ${
                lote.destaque
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-brand-accent shadow-2xl shadow-brand-accent/15 scale-105'
                  : 'bg-slate-900/60 border border-white/10'
              }`}
            >
              {lote.destaque && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-accent text-black font-extrabold text-xs tracking-wider uppercase shadow-md">
                  Mais Recomendado
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{lote.titulo}</h3>
                <p className="text-sm text-gray-400 mb-6">{lote.detalhe}</p>

                <div className="mb-8">
                  <span className="text-4xl sm:text-5xl font-black text-white">{lote.preco}</span>
                  {lote.preco !== 'Gratuito' && (
                    <span className="text-sm text-gray-400 font-medium ml-2">/ evento completo</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {lote.inclui.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/cadastro"
                className={`w-full py-3.5 rounded-xl font-extrabold text-center text-sm transition-all ${
                  lote.destaque
                    ? 'bg-gradient-to-r from-brand-primary via-brand-accent to-yellow-400 text-black hover:brightness-110 shadow-lg shadow-brand-accent/20'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                {config.rotuloInscricao}
              </Link>
            </div>
          ))}
        </div>

        {/* Informações Bancárias / FUNDACTE */}
        <div className="mt-16 max-w-3xl mx-auto p-6 rounded-2xl bg-slate-900/40 border border-white/5 text-center">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Gestão Financeira Oficial
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            As inscrições pagas são administradas diretamente pela{' '}
            <strong className="text-gray-200">{config.pagamentoRazaoSocial}</strong> via chave PIX oficial ({config.pagamentoPix}), com envio seguro do comprovante pelo sistema EvComp.
          </p>
        </div>
      </div>
    </section>
  );
}
