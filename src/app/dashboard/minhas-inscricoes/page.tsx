'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import dynamic from 'next/dynamic';
const QRCodeModal = dynamic(() => import('../../../components/ui/QRCodeModal').then(mod => mod.QRCodeModal), { ssr: false });
import { buscarPerfilUsuario } from '../../actions/auth';

export default function MinhasInscricoesPage() {
  const router = useRouter();
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAtividade, setSelectedAtividade] = useState<{ id: number, participanteId: number } | null>(null);
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

        const res = await fetch(`http://localhost:8080/api/inscricoes/detalhes?participanteId=${perfilRes.data.id}`, { credentials: 'include' });
        if (!res.ok) {
          throw new Error('Falha ao carregar suas inscrições');
        }
        
        const data = await res.json();
        setInscricoes(data);
        
        if (data && data.length > 0 && data[0].participante?.secretSeed) {
          setSecretSeed(data[0].participante.secretSeed);
        }

        // Busca presenças do participante
        const resPresencas = await fetch(`http://localhost:8080/api/presencas/participante/${perfilRes.data.id}`, { credentials: 'include' });
        if (resPresencas.ok) {
          const presencasData = await resPresencas.json();
          setPresencas(presencasData);
        }
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white font-bold text-xl">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="PARTICIPANTE" />

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">Minhas Inscrições</h1>
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>Voltar</Button>
        </div>

        {error && <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">{error}</div>}

        {inscricoes.length === 0 && !error ? (
          <GlassCard className="p-8 text-center bg-slate-800/80 border border-white/10">
            <h2 className="text-xl font-bold text-gray-300 mb-4">Você ainda não se inscreveu em nenhum evento.</h2>
            <Button onClick={() => router.push('/dashboard/eventos')}>Explorar Eventos</Button>
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {inscricoes.map((inscricao) => (
              <GlassCard key={inscricao.id} className="p-6 bg-slate-800/80 border border-white/10 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-accent">{inscricao.evento.titulo}</h2>
                    <p className="text-sm text-gray-400 mt-1">Inscrito em: {new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR')} às {new Date(inscricao.dataInscricao).toLocaleTimeString('pt-BR')}</p>
                  </div>
                  <div className="mt-4 md:mt-0 px-4 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full font-bold text-sm">
                    Inscrição Ativa
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-bold text-white mb-3">Atividades Selecionadas</h3>
                  {inscricao.atividade && inscricao.atividade.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inscricao.atividade.map((atv: any) => {
                        const isPresente = presencas.includes(atv.id);
                        
                        let inicio = null;
                        let fim = null;
                        if (atv.dataInicio) {
                          const [ano, mes, dia] = atv.dataInicio.split('-');
                          inicio = new Date(Number(ano), Number(mes) - 1, Number(dia));
                          if (atv.horarioInicio) {
                            const [h, m] = atv.horarioInicio.split(':');
                            inicio.setHours(Number(h), Number(m), 0, 0);
                          } else {
                            inicio.setHours(0,0,0,0);
                          }
                          
                          if (atv.dataFim) {
                            const [fAno, fMes, fDia] = atv.dataFim.split('-');
                            fim = new Date(Number(fAno), Number(fMes) - 1, Number(fDia));
                          } else {
                            fim = new Date(Number(ano), Number(mes) - 1, Number(dia));
                          }
                          
                          if (atv.horarioFim) {
                            const [hf, mf] = atv.horarioFim.split(':');
                            fim.setHours(Number(hf), Number(mf), 0, 0);
                          } else {
                            fim.setHours(23,59,59,999);
                          }
                        }
                        
                        const agora = new Date();
                        const isExpirado = fim && agora > fim;
                        
                        let showIngresso = false;
                        if (!isPresente && inicio && fim) {
                          const inicioColeta = new Date(inicio);
                          inicioColeta.setMinutes(inicioColeta.getMinutes() - 30);
                          showIngresso = agora >= inicioColeta && agora <= fim;
                        }
                        
                        const isNaoColetada = !isPresente && isExpirado;
                        const borderColor = isPresente ? 'border-emerald-500/50' : (isNaoColetada ? 'border-red-500/50' : 'border-white/5');

                        return (
                        <div key={atv.id} className={`bg-slate-900/50 p-4 rounded-lg border relative ${borderColor}`}>
                          {isPresente && (
                            <div className="absolute top-4 right-4 flex items-center space-x-1 text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30 text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              <span>PRESENÇA COLETADA</span>
                            </div>
                          )}
                          {isNaoColetada && (
                            <div className="absolute top-4 right-4 flex items-center space-x-1 text-red-400 bg-red-950/80 px-2 py-1 rounded border border-red-500/30 text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                              <span>PRESENÇA NÃO COLETADA</span>
                            </div>
                          )}
                          
                          <h4 className={`font-bold text-white text-md ${isPresente || isNaoColetada ? 'pr-56' : ''}`}>{atv.titulo}</h4>
                          <div className="mt-2 space-y-1 text-sm text-gray-400 mb-4">
                            <p><strong>Data:</strong> {atv.dataInicio ? new Date(atv.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'} {atv.dataFim && atv.dataFim !== atv.dataInicio ? ` até ${new Date(atv.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}` : ''}</p>
                            <p><strong>Horário:</strong> {atv.horarioInicio?.slice(0,5)} às {atv.horarioFim?.slice(0,5)}</p>
                            <p><strong>Carga Horária:</strong> {atv.cargaHorariaTotal}h</p>
                          </div>
                          
                          {showIngresso && (
                            <button 
                              onClick={() => setSelectedAtividade({ id: atv.id, participanteId: inscricao.participante?.id || 0 })}
                              className="w-full mt-auto bg-brand-accent/20 hover:bg-brand-accent/40 text-brand-accent border border-brand-accent/50 rounded-lg py-2 text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                              Exibir Ingresso (QR Code)
                            </button>
                          )}
                        </div>
                      )})}
                    </div>
                  ) : (
                    <p className="text-red-400 text-sm italic">Nenhuma atividade selecionada (Inconsistência de dados).</p>
                  )}
                </div>
              </GlassCard>
            ))}
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
    </div>
  );
}
