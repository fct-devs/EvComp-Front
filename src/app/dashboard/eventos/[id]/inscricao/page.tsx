'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../../../actions/auth';
import { verificarConflitos } from '../../../../../utils/validation';
import { Calendar, Clock, MapPin, Check, Plus, AlertTriangle, Info, XCircle } from 'lucide-react';

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
  const [modalAtividade, setModalAtividade] = useState<any>(null);

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

        const res = await fetch(`/api/eventos/${eventoId}/detalhes`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setEvento(data.dadosEvento);
          
          const atividadesComVagas = await Promise.all(
            (data.atividades || []).map(async (atv: any) => {
              try {
                const vagasRes = await fetch(`/api/atividades/${atv.id}/vagas`, { credentials: 'include' });
                if (vagasRes.ok) {
                  const vagasData = await vagasRes.json();
                  return { ...atv, vagasDisponiveis: vagasData.vagasDisponiveis };
                }
              } catch (e) {}
              return { ...atv, vagasDisponiveis: 0 };
            })
          );
          setAtividades(atividadesComVagas);
        } else {
          setError('Evento não encontrado');
        }
        
        const minRes = await fetch(`/api/inscricoes/minhas?participanteId=${perfilRes.data.id}`, { credentials: 'include' });
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

      if (atividadesArray.length === 0) {
        throw new Error('Ao menos uma atividade deve ser escolhida.');
      }

      for (const atvId of atividadesArray) {
        const vagasRes = await fetch(`/api/atividades/${atvId}/vagas`, { credentials: 'include' });
        if (vagasRes.ok) {
          const vagasData = await vagasRes.json();
          if (vagasData.vagasDisponiveis <= 0) {
            const atvObj = atividades.find((a: any) => a.id === atvId);
            throw new Error(`A atividade '${atvObj?.titulo || atvId}' não possui mais vagas disponíveis.`);
          }
        }
      }

      const atividadesSelecionadas = atividadesArray.map((id: number) => atividades.find((a: any) => a.id === id)).filter(Boolean);
      for (const atvId of atividadesArray) {
        const atv = atividades.find((a: any) => a.id === atvId);
        if (atv && verificarConflitos(atv, atividadesSelecionadas)) {
          throw new Error(`Conflito de horários detectado com a atividade: ${atv.titulo}`);
        }
      }

      const payload = {
        participanteId: participanteId,
        eventoId: parseInt(String(eventoId)),
        atividadeIds: atividadesArray
      };

      const res = await fetch('/api/inscricoes', { credentials: 'include', 
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

  const isAtividadeIniciadaOuEncerrada = (atv: any) => {
    if (!atv.dataInicio) return false;
    
    const [ano, mes, dia] = atv.dataInicio.split('T')[0].split('-');
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
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-accent font-bold text-xl animate-pulse">Carregando painel de inscrição...</div>;
  }

  const atividadesAgrupadas = atividades.reduce((acc: any, atv: any) => {
    let dataFormatada = 'Data a definir';
    if (atv.dataInicio) {
      const dataLimpa = atv.dataInicio.split('T')[0];
      dataFormatada = new Date(dataLimpa + 'T12:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }
    
    if (!acc[dataFormatada]) acc[dataFormatada] = [];
    acc[dataFormatada].push(atv);
    return acc;
  }, {} as Record<string, any[]>);

  const diasOrdenados = Object.keys(atividadesAgrupadas).sort((a: string, b: string) => {
    if (a === 'Data a definir') return 1;
    if (b === 'Data a definir') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="PARTICIPANTE" />

      <main className="flex-1 w-full max-w-6xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">Monte sua Grade</h1>
          <Button variant="secondary" onClick={() => router.push('/dashboard/eventos')}>Voltar aos Eventos</Button>
        </div>

        {evento && (
          <div className="glass-panel p-8 rounded-2xl border-white/10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-accent mb-2">{evento.titulo}</h2>
              <p className="text-gray-300 max-w-2xl">{evento.descricao}</p>
            </div>
            <div className="flex gap-4 text-sm text-gray-400 bg-slate-900/50 p-4 rounded-xl border border-white/5 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold text-gray-500 tracking-wider">Início</span>
                <span className="font-semibold text-white">{evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</span>
              </div>
              <div className="w-px bg-white/10"></div>
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold text-gray-500 tracking-wider">Término</span>
                <span className="font-semibold text-white">{evento.dataFim ? new Date(evento.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</span>
              </div>
            </div>
          </div>
        )}

        <GlassCard className="p-8 bg-slate-800/80 border border-white/10">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="text-brand-accent" size={24} />
              Atividades Disponíveis
            </h3>
            <div className="bg-brand-accent/20 text-brand-accent px-4 py-1.5 rounded-full text-sm font-bold border border-brand-accent/30">
              {selecionadas.size} selecionada(s)
            </div>
          </div>
          
          {error && <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">{error}</div>}
          
          {sucesso ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-bold text-white">Grade Confirmada!</h3>
              <p className="text-gray-400 text-lg">Sua inscrição nas atividades foi realizada com sucesso.</p>
              <div className="pt-6">
                <Button onClick={() => router.push('/dashboard/minhas-inscricoes')}>Ver Meus Ingressos</Button>
              </div>
            </div>
          ) : jaInscrito ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50">
                <Info size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white">Você já está inscrito!</h3>
              <p className="text-gray-400">Identificamos que você já possui uma grade montada para este evento.</p>
              <div className="pt-6">
                <Button onClick={() => router.push('/dashboard/minhas-inscricoes')}>Ir para Minhas Inscrições</Button>
              </div>
            </div>
          ) : atividades.length === 0 ? (
            <p className="text-gray-400 text-center py-12 text-lg">Nenhuma atividade programada para este evento no momento.</p>
          ) : (
            <div className="space-y-12">
              {diasOrdenados.map((dia: string) => (
                <div key={dia}>
                  <div className="flex items-center gap-3 mb-6 pb-2">
                    <div className="w-2 h-8 bg-brand-accent rounded-full"></div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{dia}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {atividadesAgrupadas[dia]
                      .sort((a: any, b: any) => a.horarioInicio.localeCompare(b.horarioInicio))
                      .map((atv: any) => {
                        const atividadesSelecionadas = Array.from(selecionadas).map((id: number) => atividades.find((a: any) => a.id === id)).filter(Boolean);
                        
                        const isIniciada = isAtividadeIniciadaOuEncerrada(atv);
                        const isSemVagas = atv.vagasDisponiveis <= 0;
                        const isSelecionada = selecionadas.has(atv.id);
                        const isConflitante = !isSelecionada && verificarConflitos(atv, atividadesSelecionadas);
                        
                        let cardStyle = "border-white/5 bg-slate-900/50 hover:border-brand-accent/30";
                        if (isSelecionada) cardStyle = "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                        else if (isConflitante) cardStyle = "border-orange-500/40 bg-slate-900/40 opacity-75";
                        else if (isSemVagas || isIniciada) cardStyle = "border-red-500/20 bg-slate-900/30 opacity-60";

                        return (
                          <div key={atv.id} className={`glass p-5 rounded-xl transition-all duration-300 flex flex-col h-full ${cardStyle}`}>
                            
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-white text-lg leading-tight pr-2 flex items-start gap-2">
                                {atv.titulo}
                                <button 
                                  onClick={() => setModalAtividade(atv)}
                                  className="mt-1 text-gray-500 hover:text-brand-accent transition-colors shrink-0 focus:outline-none"
                                  title="Ver Detalhes e Pré-requisitos"
                                >
                                  <Info size={16} />
                                </button>
                              </h4>
                              {isSelecionada && (
                                <div className="shrink-0 bg-emerald-500 text-white rounded-full p-1">
                                  <Check size={14} strokeWidth={3} />
                                </div>
                              )}
                            </div>

                            <div className="space-y-2 mt-auto mb-5">
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Clock size={16} className={isConflitante ? "text-orange-400" : "text-brand-accent"} />
                                <span>{atv.horarioInicio?.slice(0, 5)} às {atv.horarioFim?.slice(0, 5)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <MapPin size={16} />
                                <span>{atv.local || 'Local a definir'}</span>
                              </div>
                              <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3">
                                <span className="text-xs text-gray-500">CH: {atv.cargaHorariaTotal || 0}h</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${isSemVagas && !isSelecionada ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-brand-accent'}`}>
                                  {isSemVagas && !isSelecionada ? 'Esgotada' : `${atv.vagasDisponiveis} vagas`}
                                </span>
                              </div>
                            </div>

                            {isSelecionada ? (
                              <button
                                onClick={() => toggleAtividade(atv.id)}
                                className="w-full mt-auto bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-2"
                              >
                                <XCircle size={18} /> Remover da Grade
                              </button>
                            ) : isIniciada ? (
                              <button disabled className="w-full mt-auto bg-gray-800 text-gray-500 rounded-lg py-2.5 text-sm font-bold cursor-not-allowed">
                                Atividade Encerrada
                              </button>
                            ) : isSemVagas ? (
                              <button disabled className="w-full mt-auto bg-red-950 text-red-500 border border-red-900 rounded-lg py-2.5 text-sm font-bold cursor-not-allowed">
                                Sem Vagas
                              </button>
                            ) : isConflitante ? (
                              <button disabled className="w-full mt-auto bg-orange-950 text-orange-400 border border-orange-900 rounded-lg py-2.5 text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2">
                                <AlertTriangle size={18} /> Conflito de Horário
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleAtividade(atv.id)}
                                className="w-full mt-auto bg-white/5 hover:bg-brand-accent text-white border border-white/10 hover:border-brand-accent rounded-lg py-2.5 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                <Plus size={18} /> Adicionar
                              </button>
                            )}
                          </div>
                        );
                    })}
                  </div>
                </div>
              ))}

              <div className="sticky bottom-6 mt-12 p-6 glass-panel rounded-2xl border-brand-accent/30 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-start space-x-3 max-w-2xl">
                  <Info className="w-6 h-6 text-brand-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <strong className="text-white">Confirme sua grade:</strong> Revise os horários selecionados. Após confirmar a inscrição, as atividades não poderão ser alteradas pelo painel.
                  </p>
                </div>
                <Button onClick={handleInscrever} disabled={submitting || selecionadas.size === 0} className="w-full md:w-auto shrink-0 shadow-lg shadow-brand-accent/20">
                  {submitting ? 'Processando...' : `Confirmar ${selecionadas.size} Atividade(s)`}
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </main>

      {modalAtividade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setModalAtividade(null)}
          ></div>
          <GlassCard className="w-full max-w-lg p-8 bg-slate-900/95 border-white/10 relative z-10 shadow-2xl transform transition-all">
            <button 
              onClick={() => setModalAtividade(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <XCircle size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-white mb-6 pr-8 border-b border-white/10 pb-4">
              {modalAtividade.titulo}
            </h3>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <h4 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Info size={14} /> Descrição da Atividade
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {modalAtividade.descricao || 'Nenhuma descrição informada para esta atividade.'}
                </p>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} /> Pré-requisitos
                </h4>
                <p className="text-orange-100/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {modalAtividade.preRequisitos || 'Não há pré-requisitos obrigatórios para participar.'}
                </p>
              </div>
              
              <div className="text-xs text-gray-500 pt-4 border-t border-white/5">
                Ministrante(s): {modalAtividade.ministrantes || 'Não informado'}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}