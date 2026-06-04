'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../actions/auth';

export default function MinhasInscricoesPage() {
  const router = useRouter();
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function carregarDados() {
      try {
        const perfilRes = await buscarPerfilUsuario();
        if (!perfilRes.success) {
          router.push('/login');
          return;
        }

        const res = await fetch(`http://localhost:8080/api/inscricoes/detalhes?participanteId=${perfilRes.data.id}`);
        if (!res.ok) {
          throw new Error('Falha ao carregar suas inscrições');
        }
        
        const data = await res.json();
        setInscricoes(data);
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
                      {inscricao.atividade.map((atv: any) => (
                        <div key={atv.id} className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                          <h4 className="font-bold text-white text-md">{atv.titulo}</h4>
                          <div className="mt-2 space-y-1 text-sm text-gray-400">
                            <p><strong>Data:</strong> {atv.dataInicio ? new Date(atv.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'} {atv.dataFim && atv.dataFim !== atv.dataInicio ? ` até ${new Date(atv.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}` : ''}</p>
                            <p><strong>Horário:</strong> {atv.horarioInicio?.slice(0,5)} às {atv.horarioFim?.slice(0,5)}</p>
                            <p><strong>Carga Horária:</strong> {atv.cargaHorariaTotal}h</p>
                          </div>
                        </div>
                      ))}
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
    </div>
  );
}
