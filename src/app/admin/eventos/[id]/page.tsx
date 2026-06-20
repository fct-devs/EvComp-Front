'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEventoStore } from '../../../../store/useEventoStore';
import { Navbar } from '../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../components/ui/Core';

export default function ConsultarEventoPage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;

  const { evento, setEvento } = useEventoStore();
  const [atividades, setAtividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch(`http://localhost:8080/api/eventos/${eventoId}/detalhes`, { credentials: 'include' });
        
        if (!res.ok) {
          setError('Evento não encontrado.');
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        setEvento(data.dadosEvento);
        setAtividades(data.atividades);
        setLoading(false);
      } catch (err: any) {
        setError('Erro ao carregar dados do evento.');
        setLoading(false);
      }
    }
    
    if (eventoId) fetchDados();
  }, [eventoId]);

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Carregando...</div>;
  if (error) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">Consultar Evento</h1>
          <div className="space-x-4">
            <Button variant="secondary" onClick={() => router.push('/admin/eventos')}>Voltar</Button>
            <Link href={`/admin/eventos/editar?id=${eventoId}`}>
              <Button>Editar Evento</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <GlassCard className="p-8 bg-slate-800/80 border border-white/10 h-full">
              <h2 className="text-2xl font-bold text-brand-accent mb-6">{evento.titulo}</h2>
              
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Descrição</h3>
                  <p className="bg-slate-900/50 p-4 rounded-lg">{evento.descricao}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Início</h3>
                    <p className="bg-slate-900/50 p-3 rounded-lg">
                      {evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não definido'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Término</h3>
                    <p className="bg-slate-900/50 p-3 rounded-lg">
                      {evento.dataFim ? new Date(evento.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não definido'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Tipo de Contabilização</h3>
                    <p className="bg-slate-900/50 p-3 rounded-lg">
                      {evento.tipoContabilizacao === 'POR_ATIVIDADE' ? 'Por Atividade' : 
                       evento.tipoContabilizacao === 'POR_CARGA_TOTAL' ? 'Por Carga Total' : 
                       evento.tipoContabilizacao}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Link</h3>
                    <p className="bg-slate-900/50 p-3 rounded-lg overflow-hidden text-ellipsis">
                      {evento.link ? <a href={evento.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{evento.link}</a> : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-1">
            <GlassCard className="p-6 bg-slate-800/80 border border-white/10 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Atividades</h2>
                <span className="bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full text-sm font-bold">
                  {atividades.length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 mb-6">
                {atividades.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">Nenhuma atividade vinculada.</p>
                ) : (
                  atividades.map(atv => (
                    <div key={atv.id} className="bg-slate-900/60 p-3 rounded-lg border border-white/5">
                      <h4 className="font-semibold text-white text-sm">{atv.titulo}</h4>
                      <p className="text-xs text-gray-400 mt-1">Vagas: {atv.maxParticipantes}</p>
                    </div>
                  ))
                )}
              </div>

              <Link href={`/admin/eventos/${evento.id}/atividades`}>
                <Button variant="secondary" className="w-full text-sm">Gerenciar Atividades</Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
