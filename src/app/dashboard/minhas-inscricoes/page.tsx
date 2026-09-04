'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import dynamic from 'next/dynamic';
import { buscarPerfilUsuario } from '../../actions/auth';
import { formatarBRL } from '../../../utils/formatadores';
import { periodoInscricaoAtivo } from '../../../utils/validation';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, QrCode, Info, X, Pencil } from 'lucide-react';


const QRCodeModal = dynamic(() => import('../../../components/ui/QRCodeModal').then(mod => mod.QRCodeModal), { ssr: false });

interface Atividade {
  id: number;
  titulo: string;
  descricao?: string; 
  preRequisitos?: string; 
  dataInicio: string;
  dataFim?: string;
  horarioInicio: string;
  horarioFim: string;
  cargaHorariaTotal: number;
  local?: string; 
  ministrantes?: any;
}

interface Inscricao {
  id: number;
  dataInscricao: string;
  status: boolean;
  statusPagamento?: string;
  motivoRecusaPagamento?: string;
  evento?: { 
    id: number; 
    titulo: string; 
    dataInicio?: string; 
    dataTermino?: string;
    dataInicioInscricao?: string; 
    dataFimInscricao?: string; 
  };
  participante?: { id: number; secretSeed?: string };
  atividade?: Atividade[];
  modalidade?: { id: number; nome: string; descricao: string | null; valor: number; ativo: boolean } | null;
  valorAplicado?: number;
}

function CardAtividade({
  atv,
  presencas,
  participanteId,
  inscricaoStatus,
  onOpenQR,
  onOpenInfo
}: {
  atv: Atividade;
  presencas: number[];
  participanteId: number;
  inscricaoStatus: boolean;
  onOpenQR: (id: number, partId: number) => void;
  onOpenInfo: (atv: Atividade) => void;
}) {
  const isPresente = presencas.includes(atv.id);

  let inicio: Date | null = null;
  let fim: Date | null = null;

  if (atv.dataInicio) {
    const [ano, mes, dia] = atv.dataInicio.split('T')[0].split('-');
    inicio = new Date(Number(ano), Number(mes) - 1, Number(dia));
    
    if (atv.horarioInicio) {
      const [h, m] = atv.horarioInicio.split(':');
      inicio.setHours(Number(h), Number(m), 0, 0);
    } else {
      inicio.setHours(0, 0, 0, 0);
    }

    if (atv.dataFim) {
      const [fAno, fMes, fDia] = atv.dataFim.split('T')[0].split('-');
      fim = new Date(Number(fAno), Number(fMes) - 1, Number(fDia));
    } else {
      fim = new Date(Number(ano), Number(mes) - 1, Number(dia));
    }

    if (atv.horarioFim) {
      const [hf, mf] = atv.horarioFim.split(':');
      fim.setHours(Number(hf), Number(mf), 0, 0);
    } else {
      fim.setHours(23, 59, 59, 999);
    }
  }

  const agora = new Date();
  const isExpirado = fim !== null && agora > fim;

  let showIngresso = false;
  if (!isPresente && inicio && fim) {
    const inicioColeta = new Date(inicio);
    inicioColeta.setMinutes(inicioColeta.getMinutes() - 30);
    showIngresso = agora >= inicioColeta && agora <= fim;
  }

  const isNaoColetada = !isPresente && isExpirado;
  
  const borderColor = isPresente 
    ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
    : isNaoColetada 
      ? 'border-red-500/50 opacity-75' 
      : 'border-white/10 hover:border-brand-accent/50';

  return (
    <div className={`glass p-5 rounded-xl transition-all duration-300 relative flex flex-col h-full ${borderColor}`}>
      {isPresente && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
          <CheckCircle size={14} />
          <span>Coletada</span>
        </div>
      )}
      
      {isNaoColetada && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-red-400 bg-red-950/80 px-2.5 py-1 rounded border border-red-500/30 text-[10px] font-bold uppercase tracking-wider">
          <XCircle size={14} />
          <span>Faltou</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-4 mt-2">
        <h4 className={`font-bold text-white text-lg leading-tight ${isPresente || isNaoColetada ? 'pr-20' : ''}`}>
          {atv.titulo}
        </h4>
        {(atv.descricao || atv.preRequisitos) && (
          <button 
            onClick={() => onOpenInfo(atv)} 
            className="p-1.5 shrink-0 rounded-full bg-white/5 hover:bg-brand-accent/20 text-gray-400 hover:text-brand-accent transition-colors border border-white/5 hover:border-brand-accent/30"
            title="Informações da Atividade"
          >
            <Info size={18} />
          </button>
        )}
      </div>

      <div className="space-y-2 mt-auto mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock size={16} className="text-brand-accent" />
          <span>{atv.horarioInicio?.slice(0, 5)} às {atv.horarioFim?.slice(0, 5)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin size={16} />
          <span>{atv.local || 'Local a definir'}</span>
        </div>
        <div className="text-xs text-gray-500 pt-2 border-t border-white/5">
          Carga Horária: {atv.cargaHorariaTotal}h
        </div>
      </div>

      {!inscricaoStatus ? (
        <div className="w-full mt-auto bg-yellow-950 text-yellow-500 border border-yellow-900 rounded-lg py-2.5 text-sm font-bold text-center flex items-center justify-center gap-2">
          Ingresso bloqueado: aguardando confirmação do pagamento
        </div>
      ) : showIngresso ? (
        <button
          onClick={() => onOpenQR(atv.id, participanteId)}
          className="w-full mt-auto bg-brand-accent hover:bg-blue-600 text-white rounded-lg py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <QrCode size={18} />
          Exibir Ingresso
        </button>
      ) : null}
    </div>
  );
}

export default function MinhasInscricoesPage() {
  const router = useRouter();
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedAtividade, setSelectedAtividade] = useState<{ id: number, participanteId: number } | null>(null);
  const [infoAtividade, setInfoAtividade] = useState<Atividade | null>(null); 
  
  const [secretSeed, setSecretSeed] = useState<string>('');
  const [presencas, setPresencas] = useState<number[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const perfilRes = await buscarPerfilUsuario();
        if (!perfilRes.success) {
          router.push('/login');
          return;
        }

        const res = await fetch(`/api/inscricoes/detalhes?participanteId=${perfilRes.data.id}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Falha ao carregar suas inscrições');
        
        const data: Inscricao[] = await res.json();
        setInscricoes(data);
        
        if (data.length > 0 && data[0].participante?.secretSeed) {
          setSecretSeed(data[0].participante.secretSeed);
        }

        const resPresencas = await fetch(`/api/presencas/participante/${perfilRes.data.id}`, { credentials: 'include' });
        if (resPresencas.ok) {
          const presencasData = await resPresencas.json();
          setPresencas(presencasData);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados do servidor');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-accent font-bold text-xl animate-pulse">Carregando painel...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="PARTICIPANTE" />

      <main className="flex-1 w-full max-w-6xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Minhas Inscrições</h1>
            <p className="text-gray-400 mt-2">Acompanhe sua grade e acesse seus ingressos</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>Voltar</Button>
        </div>

        {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/50 text-red-300 rounded-lg">{error}</div>}

        {inscricoes.length === 0 && !error ? (
          <GlassCard className="p-12 text-center bg-slate-800/40 border border-white/5">
            <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-300 mb-6">Você ainda não se inscreveu em nenhum evento.</h2>
            <Button onClick={() => router.push('/dashboard/eventos')}>Explorar Eventos</Button>
          </GlassCard>
        ) : (
          <div className="space-y-12">
            {inscricoes.map((inscricao) => {
              
              const listaAtividadesSegura = inscricao.atividade || [];
              
              const parseDataPtBR = (dataStr: string) => {
                const parts = dataStr.split('/');
                if (parts.length === 3) {
                  const [dia, mes, ano] = parts.map(Number);
                  return new Date(ano, mes - 1, dia).getTime();
                }
                return 0;
              };

              const atividadesAgrupadas = listaAtividadesSegura.reduce((acc, atv) => {
                const dataFormatada = atv.dataInicio 
                  ? new Date(atv.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                  : 'Data a definir';
                
                if (!acc[dataFormatada]) acc[dataFormatada] = [];
                acc[dataFormatada].push(atv);
                return acc;
              }, {} as Record<string, Atividade[]>);

              // Ordena as atividades dentro de cada dia por horário de início e depois por título
              Object.keys(atividadesAgrupadas).forEach((dia) => {
                atividadesAgrupadas[dia].sort((a, b) => {
                  const horaA = a.horarioInicio || '00:00';
                  const horaB = b.horarioInicio || '00:00';
                  const compHora = horaA.localeCompare(horaB);
                  if (compHora !== 0) return compHora;
                  return (a.titulo || '').localeCompare(b.titulo || '');
                });
              });

              const diasOrdenados = Object.keys(atividadesAgrupadas).sort((a, b) => {
                if (a === 'Data a definir') return 1;
                if (b === 'Data a definir') return -1;
                return parseDataPtBR(a) - parseDataPtBR(b);
              });

              return (
                <div key={inscricao.id} className="relative">
                  <div className="glass-panel p-6 rounded-t-2xl border-b-0 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-brand-accent">{inscricao.evento?.titulo || 'Evento'}</h2>
                      {inscricao.modalidade && (
                        <p className="text-xs text-brand-accent mt-1">
                          {inscricao.modalidade.nome} — {formatarBRL(inscricao.valorAplicado)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                        Inscrito em: {new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
                      {(() => {
                        const eventoIniciado = (() => {
                          if (!inscricao.evento?.dataInicio) return false;
                          const dInicio = new Date(inscricao.evento.dataInicio.split('T')[0] + 'T23:59:59');
                          return new Date() > dInicio;
                        })();

                        const periodoNormalAberto = periodoInscricaoAtivo(inscricao.evento?.dataInicioInscricao, inscricao.evento?.dataFimInscricao);
                        const isRecusado = inscricao.statusPagamento === 'RECUSADO';
                        const podeRegularizar = isRecusado && !eventoIniciado;
                        const podeEditar = (periodoNormalAberto && !eventoIniciado) || podeRegularizar;

                        return (
                          <>
                            {inscricao.status ? (
                              <div className="px-4 py-1.5 rounded-full font-semibold text-xs tracking-wider border bg-brand-accent/10 text-brand-accent border-brand-accent/30">
                                INSCRIÇÃO ATIVA
                              </div>
                            ) : eventoIniciado ? (
                              <div className="px-4 py-1.5 rounded-full font-semibold text-xs tracking-wider border bg-red-500/20 text-red-400 border-red-500/50">
                                INSCRIÇÃO NÃO CONFIRMADA
                              </div>
                            ) : isRecusado ? (
                              <div className="px-4 py-1.5 rounded-full font-semibold text-xs tracking-wider border bg-amber-500/20 text-amber-300 border-amber-500/50">
                                REGULARIZAÇÃO PENDENTE
                              </div>
                            ) : (
                              <div className="px-4 py-1.5 rounded-full font-semibold text-xs tracking-wider border bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                                AGUARDANDO PAGAMENTO
                              </div>
                            )}

                            {inscricao.evento?.id && podeEditar && (
                              <Button
                                variant={podeRegularizar ? "primary" : "secondary"}
                                className="py-1.5 px-4 text-xs flex items-center gap-2"
                                onClick={() => router.push(`/dashboard/eventos/${inscricao.evento?.id}/inscricao`)}
                              >
                                <Pencil size={14} />
                                {podeRegularizar ? 'Regularizar Inscrição' : 'Editar Inscrição'}
                              </Button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="glass p-6 md:p-8 rounded-b-2xl shadow-2xl">
                    {listaAtividadesSegura.length > 0 ? (
                      <div className="space-y-10">
                        {diasOrdenados.map((dia) => (
                          <div key={dia}>
                            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/10">
                              <Calendar className="text-brand-accent" size={20} />
                              <h3 className="text-xl font-bold text-white tracking-wide">{dia}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {atividadesAgrupadas[dia]
                                .sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio))
                                .map((atv) => (
                                  <CardAtividade
                                    key={atv.id}
                                    atv={atv}
                                    presencas={presencas}
                                    participanteId={inscricao.participante?.id || 0}
                                    inscricaoStatus={inscricao.status}
                                    onOpenQR={(id, partId) => setSelectedAtividade({ id, participanteId: partId })}
                                    onOpenInfo={(atividade) => setInfoAtividade(atividade)}
                                  />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-red-400 text-sm italic">Nenhuma atividade selecionada para este evento.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <QRCodeModal 
        isOpen={selectedAtividade !== null}
        onClose={() => setSelectedAtividade(null)}
        atividadeId={selectedAtividade?.id || 0}
        participanteId={selectedAtividade?.participanteId || 0}
        secretSeed={secretSeed}
      />

      {infoAtividade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 md:p-8 rounded-2xl w-full max-w-lg relative border border-brand-accent/20 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setInfoAtividade(null)} className="absolute top-4 right-4 p-2 text-gray-400 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all">
              <X size={20} />
            </button>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 pr-8">{infoAtividade.titulo}</h3>
            
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {infoAtividade.descricao && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-brand-accent uppercase tracking-wider mb-2">
                    <Info size={16} /> Detalhes
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {infoAtividade.descricao}
                  </p>
                </div>
              )}
              
              {infoAtividade.preRequisitos && (
                <div>
                  <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">
                    ⚠️ Pré-requisitos
                  </h4>
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 text-orange-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {infoAtividade.preRequisitos}
                  </div>
                </div>
              )}

              {infoAtividade.ministrantes && (
                <div className="text-xs text-gray-400 pt-4 border-t border-white/5">
                  <span className="font-semibold text-gray-300">Ministrante(s): </span>
                  {Array.isArray(infoAtividade.ministrantes) && (infoAtividade.ministrantes as any[]).length > 0
                    ? (infoAtividade.ministrantes as any[]).map((m: any) => m.nomeCompleto || m.nome || m).join(', ')
                    : typeof infoAtividade.ministrantes === 'string'
                    ? infoAtividade.ministrantes
                    : 'Não informado'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}