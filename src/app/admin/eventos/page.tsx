'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import { formatarBRL } from '../../../utils/formatadores';


export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvento, setExpandedEvento] = useState<number | null>(null);
  const [expandedAtividade, setExpandedAtividade] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'PRIMARY' | 'SECONDARY'>('PRIMARY');
  const [atividadeToExcluir, setAtividadeToExcluir] = useState<number | null>(null);
  const [success, setSuccess] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchTodosEventosEAtividades = async () => {
    setLoading(true);
    try {
      const [resEventos, resAtividades] = await Promise.all([
        fetch('/api/eventos', { credentials: 'include' }),
        fetch('/api/atividades', { credentials: 'include' })
      ]);
      const dataEventos = await resEventos.json();
      const dataAtividades = await resAtividades.json();
      
      if (Array.isArray(dataEventos)) setEventos(dataEventos);
      else setEventos([]);
      
      if (Array.isArray(dataAtividades)) setAtividades(dataAtividades);
      else setAtividades([]);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodosEventosEAtividades();
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

  const handleExcluirAtividadeBtnClick = (atividadeId: number) => {
    setAtividadeToExcluir(atividadeId);
    setModalMode('PRIMARY');
    setModalOpen(true);
  };

  const handleConfirmExcluir = async () => {
    if (atividadeToExcluir === null) return;
    const isSecondary = modalMode === 'SECONDARY';

    try {
      let url = `/api/atividades/${atividadeToExcluir}`;
      if (isSecondary) url += '?confirmar=true';

      const res = await fetch(url, { credentials: 'include',  method: 'DELETE' });

      if (res.status === 409 && !isSecondary) {
        setModalMode('SECONDARY');
        return;
      }

      if (res.ok) {
        setAtividades(prev => prev.filter(a => a.id !== atividadeToExcluir));
        setModalOpen(false);
        setAtividadeToExcluir(null);
        setSuccess('Atividade excluída com sucesso!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await res.json();
        alert(`Erro ao excluir: ${errorData.error}`);
        setModalOpen(false);
      }
    } catch (err) {
      alert("Erro de conexão ao tentar excluir a atividade.");
      setModalOpen(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    try {
      const res = await fetch(`/api/eventos/buscar?tituloEvento=${encodeURIComponent(searchQuery)}`, { credentials: 'include' });
      if (!res.ok) {
        const errData = await res.json();
        setSearchError(errData.error || 'Nenhum evento encontrado.');
        setEventos([]);
      } else {
        const data = await res.json();
        setEventos(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      setSearchError('Erro de conexão ao buscar evento.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchError('');
    fetchTodosEventosEAtividades();
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

        <form onSubmit={handleSearch} className="mb-8 flex gap-4">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar evento por título..." 
            className="flex-1 bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
          />
          <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? 'Buscando...' : 'Pesquisar'}
          </Button>
          {(searchQuery || searchError) && (
            <Button type="button" variant="secondary" onClick={handleClearSearch}>
              Limpar
            </Button>
          )}
        </form>

        {searchError && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-md mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {searchError}
          </div>
        )}

        {success && (
          <div className="fixed bottom-10 right-10 z-50 bg-green-600 border border-green-400 text-white px-6 py-4 rounded-md shadow-2xl shadow-green-900/50 animate-in fade-in slide-in-from-bottom-8 duration-300 font-medium">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              {success}
            </div>
          </div>
        )}

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
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{ev.titulo}</h3>
                        {atvs.length === 0 && (
                          <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded border border-orange-500/50 font-bold whitespace-nowrap">
                            Inscrições Bloqueadas
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {(() => {
                          const dIn = ev.dataInicio ? new Date(ev.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;
                          const dFi = ev.dataFim ? new Date(ev.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;
                          if (dIn && dFi) return dIn === dFi ? dIn : `${dIn} a ${dFi}`;
                          return dIn || dFi || '-';
                        })()}
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
                            <li>
                              <strong>Inscrição:</strong>{' '}
                              {ev.valorInscricao != null && Number(ev.valorInscricao) > 0 ? (
                                <span className="text-yellow-400 font-semibold">{formatarBRL(ev.valorInscricao)}</span>
                              ) : (
                                <span className="text-green-400 font-semibold">Gratuita</span>
                              )}
                            </li>
                            {ev.chavePix && (
                              <li><strong>Chave PIX:</strong> <code className="bg-slate-900/60 px-1.5 py-0.5 rounded text-xs">{ev.chavePix}</code></li>
                            )}
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
                          <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-4 flex items-start gap-3">
                            <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <div>
                              <p className="text-sm font-bold text-orange-300">Nenhuma atividade cadastrada.</p>
                              <p className="text-sm text-orange-200/80 mt-1">As inscrições para este evento estarão bloqueadas até que ao menos uma atividade seja cadastrada.</p>
                            </div>
                          </div>
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
                                          {(() => {
                                            const dIn = atv.dataInicio ? new Date(atv.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;
                                            const dFi = atv.dataFim ? new Date(atv.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;
                                            if (dIn && dFi) return dIn === dFi ? dIn : `${dIn} até ${dFi}`;
                                            return dIn || dFi || '-';
                                          })()}
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 uppercase">Horário</span>
                                          {atv.horarioInicio ? atv.horarioInicio.substring(0, 5) : '--:--'} às {atv.horarioFim ? atv.horarioFim.substring(0, 5) : '--:--'}
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 uppercase">Vagas</span>
                                          {atv.maxParticipantes}
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 uppercase">Carga Hor. (Participantes)</span>
                                          {atv.cargaHorariaTotal}h
                                          <span className="block text-xs text-gray-500 uppercase mt-2">Carga Hor. (Ministrantes)</span>
                                          {atv.cargaHorariaMinistrante}h
                                        </div>
                                        {atv.ministrantes && atv.ministrantes.length > 0 && (
                                          <div className="col-span-2">
                                            <span className="block text-xs text-gray-500 uppercase">Ministrante(s)</span>
                                            {atv.ministrantes.map((m: any) => m.nomeCompleto).join(', ')}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button 
                                          className="text-xs py-1 px-3 hover:!bg-red-600 hover:!text-white hover:!border-red-600 transition-colors"
                                          onClick={() => handleExcluirAtividadeBtnClick(atv.id)}
                                        >
                                          Excluir
                                        </Button>
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

                      <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 border-t border-white/10">
                        <Link href={`/admin/eventos/editar?id=${ev.id}`} className="w-full sm:w-auto flex-1">
                          <Button variant="secondary" className="w-full">Editar Evento</Button>
                        </Link>
                        <Link href={`/admin/eventos/${ev.id}/atividades/criar`} className="w-full sm:w-auto flex-1">
                          <Button className="w-full">Adicionar Atividade</Button>
                        </Link>
                        <Link href={`/admin/eventos/${ev.id}/participantes`} className="w-full sm:w-auto flex-1">
                          <Button variant="secondary" className="w-full border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20">Participantes Inscritos</Button>
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-4">
              {modalMode === 'PRIMARY' ? 'Excluir Atividade' : 'Atenção: Participantes Inscritos!'}
            </h3>
            <p className="text-gray-300 mb-8">
              {modalMode === 'PRIMARY' 
                ? 'Tem certeza que deseja excluir esta atividade permanentemente? Esta ação não pode ser desfeita.'
                : 'Esta atividade já possui participantes inscritos. Excluí-la apagará também os registros de inscrição e presença. Deseja forçar a exclusão?'}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button className="hover:!bg-red-600 hover:!text-white hover:!border-red-600 transition-colors" onClick={handleConfirmExcluir}>
                {modalMode === 'PRIMARY' ? 'Sim, Excluir' : 'Forçar Exclusão'}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
