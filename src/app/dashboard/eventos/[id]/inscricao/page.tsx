'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../../../actions/auth';
import { verificarConflitos } from '../../../../../utils/validation';
import { formatarBRL } from '../../../../../utils/formatadores';
import { ModalidadeInscricao } from '../../../../../utils/modalidade';
import { Calendar, Clock, MapPin, Check, Plus, AlertTriangle, Info, XCircle } from 'lucide-react';

export default function InscricaoEventoPage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;

  const [evento, setEvento] = useState<any>(null);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [modalidades, setModalidades] = useState<ModalidadeInscricao[]>([]);
  const [modalidadeId, setModalidadeId] = useState<number | null>(null);
  const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());
  const [idsOriginais, setIdsOriginais] = useState<number[]>([]);
  const [pagamentoAprovado, setPagamentoAprovado] = useState(false);
  const [pagamentoInfo, setPagamentoInfo] = useState<{ status: string; temComprovante: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [participanteId, setParticipanteId] = useState<number | null>(null);
  const [inscricaoId, setInscricaoId] = useState<number | null>(null);
  const [modalAtividade, setModalAtividade] = useState<any>(null);
  const [modalResumo, setModalResumo] = useState(false);

  const modoEdicao = inscricaoId !== null;

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
          setModalidades(data.modalidades || []);
          if ((data.modalidades || []).length === 1) setModalidadeId(data.modalidades[0].id);

          const atividadesComVagas = await Promise.all(
            (data.atividades || []).map(async (atv: any) => {
              try {
                const vagasRes = await fetch(`/api/atividades/${atv.id}/vagas`, { credentials: 'include' });
                if (vagasRes.ok) {
                  const vagasData = await vagasRes.json();
                  return { ...atv, vagasDisponiveis: vagasData.vagasDisponiveis };
                }
              } catch (e) { }
              return { ...atv, vagasDisponiveis: 0 };
            })
          );
          setAtividades(atividadesComVagas);
        } else {
          setError('Evento não encontrado');
        }

        const detalhesRes = await fetch(`/api/inscricoes/detalhes?participanteId=${perfilRes.data.id}`, { credentials: 'include' });
        if (detalhesRes.ok) {
          const detalhesData = await detalhesRes.json();
          const inscricaoDoEvento = (detalhesData || []).find(
            (insc: any) => insc.evento?.id === parseInt(String(eventoId))
          );
          if (inscricaoDoEvento) {
            setInscricaoId(inscricaoDoEvento.id);
            const idsAtuais = (inscricaoDoEvento.atividade || []).map((atv: any) => atv.id);
            setSelecionadas(new Set(idsAtuais));
            setIdsOriginais(idsAtuais);
            if (inscricaoDoEvento.modalidade?.id) {
              setModalidadeId(inscricaoDoEvento.modalidade.id);
            }
            setPagamentoAprovado(Boolean(inscricaoDoEvento.status));

            try {
              const pagRes = await fetch(`/api/pagamentos/minha/${inscricaoDoEvento.id}`, { credentials: 'include' });
              if (pagRes.ok) {
                const pagData = await pagRes.json();
                setPagamentoInfo({
                  status: pagData.status,
                  temComprovante: Boolean(pagData.temComprovante)
                });
              }
            } catch (e) { }
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
        if (modoEdicao && idsOriginais.includes(atvId)) {
          continue;
        }

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

      const res = modoEdicao
        ? await fetch(`/api/inscricoes/${inscricaoId}`, {
          credentials: 'include',
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            atividadeIds: atividadesArray,
            modalidadeId: modalidadeId
          })
        })
        : await fetch('/api/inscricoes', {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participanteId: participanteId,
            eventoId: parseInt(String(eventoId)),
            atividadeIds: atividadesArray,
            modalidadeId: modalidadeId
          })
        });

      const data = await res.json();

      if (!res.ok) {
        const fallbackErrorMessage = modoEdicao ? 'Erro ao atualizar inscrição.' : 'Erro ao realizar inscrição.';
        throw new Error(data.error || fallbackErrorMessage);
      }

      setSucesso(true);
      setModalResumo(false);
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

  const parseDataPtBR = (dataStr: string) => {
    const parts = dataStr.split('/');
    if (parts.length === 3) {
      const [dia, mes, ano] = parts.map(Number);
      return new Date(ano, mes - 1, dia).getTime();
    }
    return 0;
  };

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

  // Ordena as atividades dentro de cada dia por horário de início e depois por título
  Object.keys(atividadesAgrupadas).forEach((dia) => {
    atividadesAgrupadas[dia].sort((a: any, b: any) => {
      const horaA = a.horarioInicio || '00:00';
      const horaB = b.horarioInicio || '00:00';
      const compHora = horaA.localeCompare(horaB);
      if (compHora !== 0) return compHora;
      return (a.titulo || '').localeCompare(b.titulo || '');
    });
  });

  const diasOrdenados = Object.keys(atividadesAgrupadas).sort((a: string, b: string) => {
    if (a === 'Data a definir') return 1;
    if (b === 'Data a definir') return -1;
    return parseDataPtBR(a) - parseDataPtBR(b);
  });

  const isAprovado = pagamentoAprovado || pagamentoInfo?.status === 'APROVADO';
  const isSobAnalise = pagamentoInfo?.status === 'PENDENTE' && Boolean(pagamentoInfo?.temComprovante);
  const isRecusado = pagamentoInfo?.status === 'RECUSADO';
  const modalidadeBloqueada = modoEdicao && (isAprovado || isSobAnalise);

  if (sucesso) {
    const modalidadeSelecionada = modalidades.find((m) => m.id === modalidadeId) || null;
    const ehPago = modalidadeSelecionada && Number(modalidadeSelecionada.valor) > 0;

    return (
      <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
        <Navbar role="PARTICIPANTE" />

        <main className="flex-1 w-full max-w-2xl mx-auto py-16 px-6 relative z-10 flex items-center justify-center">
          <GlassCard className="w-full p-8 md:p-12 text-center space-y-6 animate-in fade-in zoom-in duration-300 bg-slate-800/90 border-white/10 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Check size={44} strokeWidth={3} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">
                {modoEdicao ? 'Grade Atualizada com Sucesso!' : 'Inscrição Confirmada!'}
              </h2>
              <p className="text-gray-300 text-base max-w-md mx-auto">
                {modoEdicao
                  ? 'As alterações na sua grade foram salvas com sucesso no sistema.'
                  : 'Sua inscrição foi registrada com sucesso no evento.'}
              </p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 text-left space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-gray-400 font-medium">Evento:</span>
                <span className="text-white font-bold text-right">{evento?.titulo || 'Evento'}</span>
              </div>
              {modalidadeSelecionada && (
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-gray-400 font-medium">Modalidade / Kit:</span>
                  <span className="text-brand-accent font-bold">
                    {modalidadeSelecionada.nome} ({Number(modalidadeSelecionada.valor) > 0 ? formatarBRL(modalidadeSelecionada.valor) : 'Gratuito'})
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Atividades Selecionadas:</span>
                <span className="text-emerald-400 font-bold">{selecionadas.size} atividade(s)</span>
              </div>
            </div>

            {ehPago && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm text-yellow-200 text-left flex items-start gap-3">
                <Info size={20} className="text-yellow-400 shrink-0 mt-0.5" />
                <p>
                  Como este evento é pago, acesse a aba <strong>Pagamentos</strong> para efetuar o PIX e enviar o seu comprovante para validação.
                </p>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              {ehPago && (
                <Button
                  onClick={() => router.push('/dashboard/pagamentos')}
                  className="w-full sm:w-auto bg-brand-accent hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-brand-accent/20"
                >
                  Ir para Pagamentos
                </Button>
              )}
              <Button
                variant={ehPago ? 'secondary' : 'primary'}
                onClick={() => router.push('/dashboard/minhas-inscricoes')}
                className="w-full sm:w-auto font-bold py-3 px-8 rounded-full"
              >
                Ver Minhas Inscrições
              </Button>
            </div>
          </GlassCard>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="PARTICIPANTE" />

      <main className="flex-1 w-full max-w-6xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">{modoEdicao ? 'Editar sua Grade' : 'Monte sua Grade'}</h1>
          <Button variant="secondary" onClick={() => router.push('/dashboard/eventos')}>Voltar aos Eventos</Button>
        </div>

        {evento && (() => {
          const modalidadeSelecionada = modalidades.find((m) => m.id === modalidadeId) || null;
          const rotuloBadge = modalidades.length === 0
            ? 'Sem modalidade configurada'
            : modalidadeSelecionada
              ? (Number(modalidadeSelecionada.valor) > 0 ? formatarBRL(modalidadeSelecionada.valor) : 'Gratuito')
              : 'Selecione uma modalidade';
          const ehPago = !!modalidadeSelecionada && Number(modalidadeSelecionada.valor) > 0;
          const badgeClasse = modalidades.length === 0
            ? 'bg-gray-500/20 text-gray-400 border-gray-500/50'
            : ehPago
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
              : 'bg-green-500/20 text-green-400 border-green-500/50';

          return (
            <GlassCard className="p-8 bg-slate-800/80 border border-white/10 mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-brand-accent">{evento.titulo}</h2>
                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${badgeClasse}`}>
                  {rotuloBadge}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{evento.descricao}</p>

              <div className="flex flex-wrap sm:flex-nowrap gap-4 text-sm bg-slate-900/60 p-4 rounded-xl border border-white/10 mb-4">
                <div className="flex flex-col">
                  <span className="uppercase text-[10px] font-bold text-gray-500 tracking-wider">Período do Evento</span>
                  <span className="font-semibold text-white">
                    {evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'} a {evento.dataFim ? new Date(evento.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
                  </span>
                </div>
                <div className="hidden sm:block w-px bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="uppercase text-[10px] font-bold text-brand-accent tracking-wider">Período de Inscrição</span>
                  <span className="font-semibold text-brand-accent">
                    {(() => {
                      const dIn = evento.dataInicioInscricao ? new Date(evento.dataInicioInscricao).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;
                      const dFi = evento.dataFimInscricao ? new Date(evento.dataFimInscricao).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;
                      if (dIn && dFi) return dIn === dFi ? dIn : `${dIn} a ${dFi}`;
                      return dIn || dFi || 'Não informado';
                    })()}
                  </span>
                </div>
              </div>

              {modoEdicao && isAprovado && (
                <div className="p-3.5 mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-emerald-300 flex items-start gap-2.5">
                  <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-200">Modalidade confirmada:</strong> O pagamento desta inscrição já foi aprovado e seu kit está garantido. Não é possível alterar a modalidade.
                  </div>
                </div>
              )}

              {modoEdicao && isSobAnalise && (
                <div className="p-3.5 mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-200 flex items-start gap-2.5">
                  <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-100">Comprovante em análise:</strong> Você já enviou um comprovante de pagamento que está sendo avaliado pela organização. A modalidade de inscrição está bloqueada até a conclusão da conferência.
                  </div>
                </div>
              )}

              {modoEdicao && isRecusado && (
                <div className="p-3.5 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-200 flex items-start gap-2.5">
                  <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-100">Comprovante anterior recusado:</strong> Você pode alterar a sua modalidade de inscrição agora. Ao salvar, envie o novo comprovante correspondente na aba <strong>Pagamentos</strong>.
                  </div>
                </div>
              )}

              {modoEdicao && !isAprovado && !isSobAnalise && !isRecusado && modalidades.length > 1 && (
                <div className="p-3.5 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-200 flex items-start gap-2.5">
                  <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-100">Edição de modalidade permitida:</strong> Como você ainda não enviou um comprovante, pode alterar sua modalidade livremente antes de realizar o pagamento.
                  </div>
                </div>
              )}

              {modalidades.length === 1 && (
                <div className="p-3 mb-4 bg-slate-900/60 border border-white/10 rounded-lg text-sm text-gray-200">
                  <strong className="text-white">Modalidade de inscrição:</strong> {modalidades[0].nome} — {Number(modalidades[0].valor) > 0 ? formatarBRL(modalidades[0].valor) : 'Gratuito'}
                </div>
              )}

              {modalidades.length > 1 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white mb-2">
                    {modoEdicao ? 'Modalidade de inscrição' : 'Escolha sua modalidade de inscrição'}
                  </h4>
                  <div className="space-y-2">
                    {modalidades.filter((m) => m.ativo).map((m) => {
                      return (
                        <label
                          key={m.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${modalidadeBloqueada ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                            } ${modalidadeId === m.id ? 'border-brand-accent bg-brand-accent/10' : 'border-white/10 bg-slate-900/40 hover:border-white/30'}`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="modalidade"
                              checked={modalidadeId === m.id}
                              disabled={modalidadeBloqueada}
                              onChange={() => setModalidadeId(m.id)}
                              className="w-4 h-4"
                            />
                            <div>
                              <span className="text-white font-medium text-sm">{m.nome}</span>
                              {m.descricao && <p className="text-xs text-gray-400">{m.descricao}</p>}
                            </div>
                          </div>
                          <span className="text-sm font-bold text-brand-accent whitespace-nowrap">
                            {Number(m.valor) > 0 ? formatarBRL(m.valor) : 'Gratuito'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {ehPago && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-200">
                  Este evento é pago. Após confirmar a inscrição, acesse a aba <strong>Pagamentos</strong> para ver a chave PIX e enviar o comprovante.
                </div>
              )}
            </GlassCard>
          );
        })()}

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

          {modalidades.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/50">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white">Modalidades ainda não configuradas</h3>
              <p className="text-gray-400">Este evento ainda não possui modalidades de inscrição configuradas. Fale com a organização.</p>
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
                    {modoEdicao ? (
                      <><strong className="text-white">Atualize sua grade:</strong> Revise as atividades selecionadas e salve para aplicar as alterações na sua inscrição (permitido apenas enquanto o período de inscrições estiver aberto).</>
                    ) : (
                      <><strong className="text-white">Confirme sua grade:</strong> Revise as atividades selecionadas e confirme sua inscrição (você poderá alterar sua grade e modalidade enquanto o período de inscrições estiver aberto).</>
                    )}
                  </p>
                </div>
                <Button
                  onClick={modoEdicao ? handleInscrever : () => setModalResumo(true)}
                  disabled={
                    submitting ||
                    selecionadas.size === 0 ||
                    (!modoEdicao && (modalidades.length === 0 || (modalidades.length > 1 && modalidadeId === null)))
                  }
                  className="w-full md:w-auto shrink-0 shadow-lg shadow-brand-accent/20"
                >
                  {submitting
                    ? 'Processando...'
                    : modoEdicao
                      ? `Salvar Alterações (${selecionadas.size})`
                      : `Confirmar ${selecionadas.size} Atividade(s)`}
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

              <div className="text-xs text-gray-400 pt-4 border-t border-white/5">
                <span className="font-semibold text-gray-300">Ministrante(s): </span>
                {Array.isArray(modalAtividade.ministrantes) && modalAtividade.ministrantes.length > 0
                  ? modalAtividade.ministrantes.map((m: any) => m.nomeCompleto || m.nome || m).join(', ')
                  : typeof modalAtividade.ministrantes === 'string' && modalAtividade.ministrantes
                  ? modalAtividade.ministrantes
                  : 'Não informado'}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {modalResumo && evento && (() => {
        const modalidadeSelecionada = modalidades.find((m) => m.id === modalidadeId) || null;
        const atividadesSelecionadas = Array.from(selecionadas).map((id) => atividades.find((a: any) => a.id === id)).filter(Boolean);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <GlassCard className="max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold text-white mb-4">Resumo da Inscrição</h3>

              {error && <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm">{error}</div>}

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Evento</span>
                  <span className="text-white font-semibold">{evento.titulo}</span>
                </div>
                {modalidadeSelecionada && (
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Modalidade</span>
                    <span className="text-white font-semibold">
                      {modalidadeSelecionada.nome} — {Number(modalidadeSelecionada.valor) > 0 ? formatarBRL(modalidadeSelecionada.valor) : 'Gratuito'}
                    </span>
                  </div>
                )}
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Atividades Selecionadas ({atividadesSelecionadas.length})</span>
                  <ul className="space-y-1">
                    {atividadesSelecionadas.map((atv: any) => (
                      <li key={atv.id} className="text-sm text-gray-200 bg-slate-900/50 rounded p-2 border border-white/5">
                        {atv.titulo} <span className="text-gray-500">— {atv.horarioInicio?.slice(0, 5)} às {atv.horarioFim?.slice(0, 5)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <Button variant="secondary" onClick={() => setModalResumo(false)} disabled={submitting}>Voltar</Button>
                <Button onClick={handleInscrever} disabled={submitting}>
                  {submitting ? 'Processando...' : 'Confirmar Inscrição'}
                </Button>
              </div>
            </GlassCard>
          </div>
        );
      })()}
    </div>
  );
}