'use client';

import React, { useState } from 'react';
import { type Duvida, type Config } from '@/data/landingData';

export function Duvidas({ duvidas, config }: { duvidas: Duvida[]; config: Config }) {
  const [abertoId, setAbertoId] = useState<string | null>(duvidas[0]?.id ?? null);

  const toggle = (id: string) => {
    setAbertoId(abertoId === id ? null : id);
  };

  return (
    <section id="duvidas" className="py-20 md:py-28 bg-slate-950/40 border-t border-white/10 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-3">
            F.A.Q.
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Perguntas Frequentes
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            Tire suas dúvidas sobre inscrições, pagamentos, minicursos e certificados.
          </p>
        </div>

        <div className="space-y-4">
          {duvidas.map((d) => {
            const isAberto = abertoId === d.id;
            return (
              <div
                key={d.id}
                className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(d.id)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white">{d.pergunta}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-brand-accent transition-transform duration-200 ${
                      isAberto ? 'rotate-180 bg-brand-accent/20' : ''
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isAberto && (
                  <div className="px-6 pb-6 pt-2 text-sm text-gray-300 leading-relaxed border-t border-white/5 font-light animate-in fade-in">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: d.resposta
                          .replace(/{razaoSocial}/g, config.pagamentoRazaoSocial)
                          .replace(/{pix}/g, config.pagamentoPix)
                          .replace(/{banco}/g, config.pagamentoBanco)
                          .replace(/{agencia}/g, config.pagamentoAgencia)
                          .replace(/{conta}/g, config.pagamentoConta)
                          .replace(/{inscricao}/g, '/cadastro'),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
