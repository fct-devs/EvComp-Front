'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';


export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvento, setExpandedEvento] = useState<number | null>(null);
  const [expandedAtividade, setExpandedAtividade] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resEventos, resAtividades] = await Promise.all([
          fetch('http://localhost:8080/api/eventos'),
          fetch('http://localhost:8080/api/atividades')
        ]);
        const dataEventos = await resEventos.json();
        const dataAtividades = await resAtividades.json();
        
        if (Array.isArray(dataEventos)) {
          setEventos(dataEventos);
        } else {
          console.error("API /eventos retornou erro:", dataEventos);
          setEventos([]);
        }
        
        if (Array.isArray(dataAtividades)) {
          setAtividades(dataAtividades);
        } else {
          console.error("API /atividades retornou erro:", dataAtividades);
          setAtividades([]);
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleEvento = (id: number) => {
    if (expandedEvento === id) {
      setExpandedEvento(null);
      setExpandedAtividade(null);
    } else {
      setExpandedEvento(id);
      setExpandedAtividade(null);
    }
  };

  const toggleAtividade = (id: number) => {
    if (expandedAtividade === id) {
      setExpandedAtividade(null);
    } else {
      setExpandedAtividade(id);
    }
  };

  const getAtividadesDoEvento = (eventoId: number) => {
    return atividades.filter(a => a.evento && String(a.evento.id) === String(eventoId));
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Gerenciar Eventos</h1>
          <Link href="/admin/eventos/criar">
            <Button>Novo Evento</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-white text-center py-8">Carregando eventos...</p>
          ) : eventos.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum evento cadastrado.</p>
          ) : (
            eventos.map((ev: any) => {
              const isExpanded = expandedEvento === ev.id;
              const atvs = getAtividadesDoEvento(ev.id);

              return (
                <GlassCard key={ev.id} className="p-0 bg-slate-800/80 border border-white/10 overflow-hidden transition-all duration-300">
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleEvento(ev.id)}
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white">{ev.titulo}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {ev.dataInicio ? new Date(ev.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'} a {ev.dataFim ? new Date(ev.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
                      </p>
                    </div>
                    <div>
                      {isExpanded ? (
                        <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-6 border-t border-white/10 pt-4 bg-slate-900/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Descrição</h4>
                          <p className="text-gray-200 text-sm">{ev.descricao}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Detalhes</h4>
                          <ul className="text-sm text-gray-200 space-y-1">
                            <li><strong>Contabilização:</strong> {ev.tipoContabilizacao === 'POR_ATIVIDADE' ? 'Por Atividade' : 'Por Carga Total'}</li>
                            {ev.link && (
                              <li><strong>Link:</strong> <a href={ev.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{ev.link}</a></li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-md font-bold text-brand-accent">Atividades do Evento</h4>
                          <span className="bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full text-xs font-bold">
                            {atvs.length}
                          </span>
                        </div>
                        
                        {atvs.length === 0 ? (
                          <p className="text-gray-400 text-sm italic bg-black/20 p-3 rounded-md">Nenhuma atividade cadastrada.</p>
                        ) : (
                          <div className="space-y-2">
                            {atvs.map((atv: any) => {
                              const isAtvExpanded = expandedAtividade === atv.id;
                              return (
                                <div key={atv.id} className="bg-slate-800/50 border border-white/5 rounded-lg overflow-hidden">
                                  <div 
                                    className="p-3 flex justify-between items-center cursor-pointer hover:bg-white/5"
                                    onClick={() => toggleAtividade(atv.id)}
                                  >
                                    <span className="font-medium text-white text-sm">{atv.titulo}</span>
                                    {isAtvExpanded ? (
                                      <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    ) : (
                                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    )}
                                  </div>
                                  
                                  {isAtvExpanded && (
                                    <div className="p-4 bg-black/20 border-t border-white/5 text-sm text-gray-300">
                                      <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                          <span className="block text-xs text-gray-500 uppercase">Data</span>
                                          {atv.dataInicio ? new Date(atv.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 uppercase">Horário</span>
                                          {atv.dataHoraInicio ? new Date(atv.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : '-'} às {atv.dataHoraFim ? new Date(atv.dataHoraFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : '-'}
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 uppercase">Vagas</span>
                                          {atv.maxParticipantes}
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 uppercase">Carga Horária</span>
                                          {atv.cargaHorariaTotal}h
                                        </div>
                                        {atv.ministrantes && atv.ministrantes.length > 0 && (
                                          <div className="col-span-2">
                                            <span className="block text-xs text-gray-500 uppercase">Ministrante(s)</span>
                                            {atv.ministrantes.map((m: any) => m.nome).join(', ')}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex justify-end">
                                        <Link href={`/admin/eventos/${ev.id}/atividades/editar?atividadeId=${atv.id}`}>
                                          <Button variant="secondary" className="text-xs py-1 px-3">Editar Atividade</Button>
                                        </Link>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-white/10">
                        <Link href={`/admin/eventos/editar?id=${ev.id}`}>
                          <Button variant="secondary">Editar Evento</Button>
                        </Link>
                        <Link href={`/admin/eventos/${ev.id}/atividades/criar`}>
                          <Button>Adicionar Atividade</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
