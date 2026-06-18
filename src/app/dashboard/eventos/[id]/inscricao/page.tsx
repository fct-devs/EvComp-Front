'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../../../actions/auth';

export default function InscricaoEventoPage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;

  const [evento, setEvento] = useState<any>(null);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [participanteId, setParticipanteId] = useState<number | null>(null);
  const [jaInscrito, setJaInscrito] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const perfilRes = await buscarPerfilUsuario();
        if (perfilRes.success) {
          setParticipanteId(perfilRes.data.id);
        } else {
          router.push('/login');
          return;
        }

        const [evRes, atvRes] = await Promise.all([
          fetch('http://localhost:8080/api/eventos', { credentials: 'include' }),
          fetch('http://localhost:8080/api/atividades', { credentials: 'include' })
        ]);

        const evData = await evRes.json();
        const ev = evData.find((e: any) => String(e.id) === String(eventoId));
        if (ev) setEvento(ev);

        const atvData = await atvRes.json();
        const filtradas = atvData.filter((a: any) => a.evento && String(a.evento.id) === String(eventoId));
        setAtividades(filtradas);
        
        // Verifica se o participante já está inscrito
        const minRes = await fetch(`http://localhost:8080/api/inscricoes/minhas?participanteId=${perfilRes.data.id}`, { credentials: 'include' });
        if (minRes.ok) {
          const minData = await minRes.json();
          if (minData.inscritos && minData.inscritos.includes(parseInt(String(eventoId)))) {
            setJaInscrito(true);
          }
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error("Erro no fetch:", err);
        setError('Erro ao carregar dados do evento: ' + (err.message || 'Erro desconhecido'));
        setLoading(false);
      }
    }

    if (eventoId) carregarDados();
  }, [eventoId, router]);

  const toggleAtividade = (id: number) => {
    const novas = new Set(selecionadas);
    if (novas.has(id)) novas.delete(id);
    else novas.add(id);
    setSelecionadas(novas);
  };

  const handleInscrever = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      const atividadesArray = Array.from(selecionadas);

      // Validação de Vagas via API
      for (const atvId of atividadesArray) {
        const vagasRes = await fetch(`http://localhost:8080/api/atividades/${atvId}/vagas`, { credentials: 'include' });
        if (vagasRes.ok) {
          const vagasData = await vagasRes.json();
          if (vagasData.vagasDisponiveis <= 0) {
            const atvObj = atividades.find(a => a.id === atvId);
            throw new Error(`A atividade '${atvObj?.titulo || atvId}' não possui mais vagas disponíveis.`);
          }
        }
      }

      // Validação de Conflitos via API
      for (const atvId of atividadesArray) {
        const confRes = await fetch('http://localhost:8080/api/atividades/verificar-conflitos', { 
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ atividades: atividadesArray, atividadeId: atvId })
        });
        
        if (confRes.ok) {
          const confData = await confRes.json();
          if (confData.conflitoDetectado) {
            throw new Error(confData.mensagem);
          }
        } else if (confRes.status === 400) {
          const errData = await confRes.json();
          throw new Error(errData.error || 'Erro ao verificar conflitos de horário.');
        }
      }

      const payload = {
        participanteId: participanteId,
        eventoId: parseInt(String(eventoId)),
        atividadeIds: atividadesArray
      };

      const res = await fetch('http://localhost:8080/api/inscricoes', { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar inscrição.');
      }

      setSucesso(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const temConflitoHorario = (atv: any) => {
    if (!atv.dataInicio || !atv.horarioInicio || !atv.horarioFim) return false;
    
    const dtInicioAtv = new Date(`${atv.dataInicio}T${atv.horarioInicio}`);
    const dtFimAtv = new Date(`${atv.dataFim || atv.dataInicio}T${atv.horarioFim}`);

    for (const selId of selecionadas) {
      if (selId === atv.id) continue;
      const selAtv = atividades.find(a => a.id === selId);
      if (!selAtv || !selAtv.dataInicio || !selAtv.horarioInicio || !selAtv.horarioFim) continue;
      
      const dtInicioSel = new Date(`${selAtv.dataInicio}T${selAtv.horarioInicio}`);
      const dtFimSel = new Date(`${selAtv.dataFim || selAtv.dataInicio}T${selAtv.horarioFim}`);

      if (dtInicioAtv < dtFimSel && dtFimAtv > dtInicioSel) {
        return true;
      }
    }
    return false;
  };

  const isAtividadeIniciadaOuEncerrada = (atv: any) => {
    if (!atv.dataInicio) return false;
    
    const [ano, mes, dia] = atv.dataInicio.split('-');
    const dtInicio = new Date(Number(ano), Number(mes) - 1, Number(dia));
    
    if (atv.horarioInicio) {
      const [h, m] = atv.horarioInicio.split(':');
      dtInicio.setHours(Number(h), Number(m), 0, 0);
    } else {
      dtInicio.setHours(23, 59, 59, 999);
    }
    
    return new Date() > dtInicio;
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white font-bold text-xl">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="PARTICIPANTE" />

      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">Inscrição no Evento</h1>
          <Button variant="secondary" onClick={() => router.push('/dashboard/eventos')}>Voltar aos Eventos</Button>
        </div>

        {evento && (
          <GlassCard className="p-8 bg-slate-800/80 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-brand-accent mb-4">{evento.titulo}</h2>
            <p className="text-gray-300 mb-4">{evento.descricao}</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <p><strong>Início:</strong> {evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</p>
              <p><strong>Término:</strong> {evento.dataFim ? new Date(evento.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</p>
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-8 bg-slate-800/80 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Selecione as Atividades</h3>
          
          {error && <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">{error}</div>}
          
          {sucesso ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Inscrição Realizada com Sucesso!</h3>
              <p className="text-gray-400">Sua inscrição no evento e nas atividades foi confirmada.</p>
              <div className="pt-4">
                <Button onClick={() => router.push('/dashboard')}>Ir para o Início</Button>
              </div>
            </div>
          ) : jaInscrito ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Você já está inscrito!</h3>
              <p className="text-gray-400">Identificamos que você já possui uma inscrição ativa para este evento.</p>
              <div className="pt-4">
                <Button onClick={() => router.push('/dashboard/eventos')}>Voltar aos Eventos</Button>
              </div>
            </div>
          ) : atividades.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Não há atividades disponíveis para este evento no momento.</p>
          ) : (
            <div className="space-y-4 mb-8">
              {atividades.map((atv) => {
                const isIniciada = isAtividadeIniciadaOuEncerrada(atv);
                const isSelecionada = selecionadas.has(atv.id);
                const isConflitante = !isSelecionada && temConflitoHorario(atv);
                const isDisabled = isConflitante || isIniciada;

                return (
                  <label key={atv.id} className={`flex items-start space-x-4 p-4 rounded-lg border ${isDisabled ? 'border-red-500/20 bg-slate-900/30 opacity-60 cursor-not-allowed' : 'border-white/5 bg-slate-900/50 hover:bg-slate-900 cursor-pointer'} transition-colors`}>
                    <input
                      type="checkbox"
                      className="w-5 h-5 mt-1 bg-transparent border-gray-500 rounded focus:ring-brand-accent text-brand-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      checked={isSelecionada}
                      disabled={isDisabled}
                      onChange={() => {
                        if (!isDisabled) toggleAtividade(atv.id);
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className={`font-bold ${isDisabled ? 'text-gray-400 line-through' : 'text-white'}`}>{atv.titulo}</h4>
                        <div className="space-x-2">
                          {isIniciada && (
                            <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">
                              Encerrada/Iniciada
                            </span>
                          )}
                          {isConflitante && (
                            <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
                              Conflito de Horário
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">
                        Horário: {atv.horarioInicio?.slice(0,5)} - {atv.horarioFim?.slice(0,5)} | Data: {atv.dataInicio ? new Date(atv.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''}{atv.dataFim && atv.dataFim !== atv.dataInicio ? ` até ${new Date(atv.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}` : ''}
                      </p>
                      <p className="text-xs text-brand-accent mt-1">Vagas totais: {atv.maxParticipantes}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {!sucesso && (
            <div className="pt-4 border-t border-white/10">
              <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-start space-x-3">
                <svg className="w-6 h-6 text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-sm text-orange-200">
                  <strong className="block text-orange-300 mb-1">Atenção:</strong>
                  As atividades selecionadas não poderão ser alteradas após a confirmação.
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleInscrever} disabled={submitting}>
                  {submitting ? 'Processando...' : 'Confirmar Inscrição'}
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
