'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { Button, GlassCard } from '../../../components/ui/Core';
import { exibirParticipantes, tornarColetor, removerColetor } from '../../actions/admin';

export default function GestaoColetoresPage() {
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [selectedEventoId, setSelectedEventoId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [expandedParticipantId, setExpandedParticipantId] = useState<string | null>(null);

  const toggleParticipant = (id: string) => {
    setExpandedParticipantId(prev => prev === id ? null : id);
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const solicitarAtribuicaoColetor = async (participanteId: string) => {
    if (!selectedEventoId) return showMessage("Selecione um evento primeiro!", 'error');
    const res = await tornarColetor(selectedEventoId, participanteId);
    if (res.success) {
      showMessage(res.message || "Coletor atribuído com sucesso!", 'success');
      fetchData();
    } else {
      showMessage(res.error || "Erro ao atribuir coletor.", 'error');
    }
  };

  const solicitarRemocaoColetor = async (coletorId: string) => {
    if (!selectedEventoId) return showMessage("Selecione um evento primeiro!", 'error');
    const res = await removerColetor(selectedEventoId, coletorId);
    if (res.success) {
      showMessage(res.message || 'Coletor removido com sucesso!', 'success');
      fetchData();
    } else {
      showMessage(res.error || "Erro ao remover coletor.", 'error');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const resPart = await exibirParticipantes();
      if (resPart.success && Array.isArray(resPart.data)) {
        setParticipantes(resPart.data);
      } else if (resPart.error) {
        showMessage(resPart.error, 'error');
      }
    } catch (err: any) {
      showMessage('Erro ao buscar participantes: ' + (err.message || 'Falha de rede'), 'error');
    }
    
    // Buscar eventos
    try {
      const resEv = await fetch('/api/eventos', { credentials: 'include' });
      const dataEv = await resEv.json();
      if (Array.isArray(dataEv)) {
        setEventos(dataEv);
        if (dataEv.length > 0 && !selectedEventoId) {
          setSelectedEventoId(String(dataEv[0].id));
        }
      }
    } catch(e) {}
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 relative z-10">
        <GlassCard className="w-full bg-slate-900/80 p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6">Gestão de Coletores de Presença</h1>
          
          {message.text && (
            <div className={`p-4 rounded-md mb-6 font-bold ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex flex-col space-y-2 mb-6">
              <label className="text-sm font-bold text-gray-300">Selecione o Evento para Gerenciar:</label>
              <select 
                value={selectedEventoId} 
                onChange={e => setSelectedEventoId(e.target.value)}
                className="w-full bg-slate-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                {eventos.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.titulo}</option>
                ))}
              </select>
            </div>

            <h2 className="text-xl font-bold text-brand-accent">Participantes</h2>
            {loading ? (
              <p className="text-gray-400">Carregando...</p>
            ) : (
              <div className="space-y-4">
                {participantes.length === 0 && <p className="text-gray-400">Nenhum participante encontrado.</p>}
                
                {participantes.map(p => {
                  const isColetorDesteEvento = p.role === 'COLETOR' && p.eventosColetados && p.eventosColetados.some((ev: any) => String(ev.id) === String(selectedEventoId));
                  const isExpanded = expandedParticipantId === String(p.id);
                  return (
                  <div key={p.id} className={`bg-slate-800 rounded-lg overflow-hidden transition-all duration-300 ${isColetorDesteEvento ? 'border border-brand-accent/30 border-l-4 border-l-brand-accent shadow-[0_0_15px_rgba(34,197,94,0.05)]' : 'border border-white/5'}`}>
                    <div 
                      className={`flex justify-between items-center p-4 cursor-pointer hover:bg-slate-700/50 ${isColetorDesteEvento ? 'bg-brand-accent/5' : ''}`}
                      onClick={() => toggleParticipant(String(p.id))}
                    >
                      <div className="flex items-center gap-3">
                        <p className="text-white font-bold text-lg">{p.nomeCompleto || p.nome}</p>
                        {isColetorDesteEvento && (
                          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent border border-brand-accent/30">
                            COLETOR
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400 font-bold text-sm flex items-center gap-2">
                        <span>Detalhes</span>
                        {isExpanded ? '▲' : '▼'}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 bg-slate-900/50 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="text-sm text-gray-300 bg-slate-800/80 px-4 py-2 rounded-md border border-white/5">
                          <p><span className="font-semibold text-gray-500">RA do Aluno:</span> <span className="text-white">{p.ra || 'Não informado'}</span></p>
                        </div>
                        <div>
                          {isColetorDesteEvento ? (
                            <Button variant="danger" onClick={() => solicitarRemocaoColetor(p.id)}>Remover Cargo de Coletor</Button>
                          ) : (
                            <Button variant="primary" onClick={() => solicitarAtribuicaoColetor(String(p.id))}>Atribuir Papel de Coletor</Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )})}
              </div>
            )}
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
