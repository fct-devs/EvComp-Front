'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Conteudo, type Atividade, type Palestrante } from '@/data/landingData';

export function Programacao({ conteudo }: { conteudo: Conteudo }) {
  const { dias, locais, atividades, palestrantes } = conteudo;
  const [diaSelecionado, setDiaSelecionado] = useState<string>(dias[0]?.id ?? 'd1');
  const [modalAtividade, setModalAtividade] = useState<Atividade | null>(null);

  const localMap = new Map(locais.map((l) => [l.id, l]));
  const palestranteMap = new Map(palestrantes.map((p) => [p.id, p]));

  const atividadesDoDia = atividades
    .filter((a) => a.diaId === diaSelecionado)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));

  const palestranteModal = modalAtividade?.palestranteId
    ? palestranteMap.get(modalAtividade.palestranteId)
    : null;

  return (
    <section id="programacao" className="py-20 md:py-28 bg-slate-950/60 border-t border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-3">
            Cronograma Oficial
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Programação dos 5 Dias de Evento
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            {conteudo.config.avisoProgramacao}
          </p>
        </div>

        {/* Seletor de Dias */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-12 overflow-x-auto pb-4 custom-scrollbar">
          {dias.map((d) => {
            const ativo = d.id === diaSelecionado;
            return (
              <button
                key={d.id}
                onClick={() => setDiaSelecionado(d.id)}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex flex-col items-center ${
                  ativo
                    ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-black shadow-lg shadow-brand-accent/20 scale-105'
                    : 'bg-slate-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span className="text-xs uppercase font-medium">{d.rotulo}</span>
                <span className="text-base sm:text-lg font-extrabold">{d.data}</span>
              </button>
            );
          })}
        </div>

        {/* Lista de Atividades do Dia Selecionado */}
        {atividadesDoDia.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-slate-900/40 rounded-2xl border border-white/5">
            Nenhuma atividade cadastrada para este dia.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atividadesDoDia.map((atv) => {
              const local = localMap.get(atv.localId);
              const palestrante = atv.palestranteId ? palestranteMap.get(atv.palestranteId) : null;
              const isPalestra = atv.trilha === 'palestra';
              const isEspecial = atv.trilha === 'especial';
              const isMinicurso = atv.trilha === 'minicurso';

              return (
                <div
                  key={atv.id}
                  onClick={() => setModalAtividade(atv)}
                  className={`cursor-pointer group p-6 rounded-2xl bg-slate-900/80 border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between ${
                    isPalestra
                      ? 'border-brand-accent/40 hover:border-brand-accent shadow-lg shadow-brand-accent/10 bg-gradient-to-b from-brand-accent/5 to-slate-900/90'
                      : isEspecial
                      ? 'border-purple-500/40 hover:border-purple-400 shadow-lg shadow-purple-500/15 bg-gradient-to-b from-purple-950/20 to-slate-900/90'
                      : 'border-white/10 hover:border-brand-primary/50'
                  }`}
                >
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          isPalestra
                            ? 'bg-brand-accent text-black font-extrabold'
                            : isEspecial
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold shadow-sm shadow-purple-500/30 border border-purple-400/30'
                            : isMinicurso
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isEspecial ? 'PATROCINADOR / ESPECIAL' : isPalestra ? 'PALESTRA MAGNA' : atv.trilha.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                        </svg>
                        <span>{atv.inicio} - {atv.fim}</span>
                      </div>
                    </div>

                    {/* Título */}
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors leading-snug line-clamp-2 mb-3">
                      {atv.titulo}
                    </h3>

                    {/* Palestrante / Ministrante Resumo */}
                    {palestrante ? (
                      <div className="flex items-center gap-3 mt-4 p-2 rounded-xl bg-white/5 border border-white/5">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-accent/40 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={palestrante.fotoSrc}
                            alt={palestrante.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{palestrante.nome}</p>
                          <p className="text-[11px] text-gray-400 truncate">{palestrante.cargo}</p>
                        </div>
                      </div>
                    ) : atv.responsavel ? (
                      <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                        <span className="text-gray-500 font-medium">Instrutor(es):</span> {atv.responsavel}
                      </p>
                    ) : null}
                  </div>

                  {/* Footer do Card */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-300 font-medium">
                        {local ? `${local.nome} (${local.detalhe})` : 'A definir'}
                      </span>
                    </div>

                    {atv.vagas ? (
                      <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-gray-300">
                        {atv.vagas} vagas
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de Detalhes da Atividade */}
        {modalAtividade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-brand-accent/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative">
              <button
                onClick={() => setModalAtividade(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fechar"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-brand-accent text-black">
                  {modalAtividade.trilha.toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-gray-400">
                  {modalAtividade.inicio} às {modalAtividade.fim}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-4 leading-snug">
                {modalAtividade.titulo}
              </h3>

              {modalAtividade.descricao && (
                <div className="mb-6 text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-white/5">
                  {modalAtividade.descricao}
                </div>
              )}

              {/* Informações do Palestrante */}
              {palestranteModal && (
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-accent flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={palestranteModal.fotoSrc}
                        alt={palestranteModal.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{palestranteModal.nome}</h4>
                      <p className="text-xs text-gray-400">{palestranteModal.cargo}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-light mb-3">
                    {palestranteModal.bio}
                  </p>
                  {palestranteModal.linkedin && (
                    <a
                      href={palestranteModal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-accent hover:underline font-semibold"
                    >
                      <span>Ver perfil no LinkedIn</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {/* Ministrantes com LinkedIn */}
              {modalAtividade.ministrantes && modalAtividade.ministrantes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Ministrante(s)
                  </h4>
                  <div className="space-y-2">
                    {modalAtividade.ministrantes.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5">
                        <span className="text-white font-medium">{m.nome}</span>
                        {m.linkedin ? (
                          <a
                            href={m.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-accent hover:underline flex items-center gap-1"
                          >
                            LinkedIn
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-400">
                  <span className="font-semibold text-white">Local: </span>
                  {localMap.get(modalAtividade.localId)?.nome || 'A definir'} ({localMap.get(modalAtividade.localId)?.detalhe || ''})
                </div>

                <Link
                  href="/cadastro"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-accent text-black font-extrabold text-sm text-center shadow-lg hover:brightness-110 transition-all"
                >
                  Inscrever-se Nesta Atividade
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
