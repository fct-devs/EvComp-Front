'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Navbar } from '../../../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../../../components/ui/Core';

function EditarAtividadeContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventoId = params.id;
  const atividadeId = searchParams.get('atividadeId');

  const [participantes, setParticipantes] = useState<any[]>([]);
  const [atividade, setAtividade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [resPart, resAtv] = await Promise.all([
          fetch('http://localhost:8080/api/participantes'),
          fetch(`http://localhost:8080/api/atividades/${atividadeId}`)
        ]);

        if (!resAtv.ok) throw new Error('Atividade não encontrada.');

        const dataPart = await resPart.json();
        const dataAtv = await resAtv.json();

        setParticipantes(dataPart);
        setAtividade(dataAtv);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (atividadeId) loadData();
  }, [atividadeId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = {
      titulo: formData.get('titulo'),
      data_inicio: formData.get('dataInicio'),
      data_termino: formData.get('dataTermino'),
      horario_inicio: formData.get('horaInicio')?.toString().substring(0, 5).replace(':', ''),
      horario_termino: formData.get('horaTermino')?.toString().substring(0, 5).replace(':', ''),
      max_participantes: formData.get('vagas'),
      ministrantes_ids: formData.getAll('ministranteId'),
      carga_horaria_total: formData.get('cargaHorariaTotal'),
      carga_horaria_ministrantes: formData.get('cargaHorariaMinistrante'),
    };

    try {
      const res = await fetch(`http://localhost:8080/api/atividades/${atividadeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao editar atividade');
      }

      const resData = await res.json();
      const successMsg = resData.message || 'Atividade editada com sucesso! Redirecionando...';
      setSuccess(successMsg);
      const readTime = Math.max(2500, successMsg.length * 50);
      
      setTimeout(() => {
        router.push('/admin/eventos');
      }, readTime);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading && !atividade) return <div className="text-center text-white p-12">Carregando dados da atividade...</div>;
  if (!atividade) return <div className="text-center text-red-400 p-12">{error}</div>;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <GlassCard className="p-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8">Editar Atividade</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-md mb-6">
            {error}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="text-sm font-medium text-gray-300">Título da Atividade</label>
            <input id="titulo" name="titulo" type="text" defaultValue={atividade.titulo} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dataInicio" className="text-sm font-medium text-gray-300">Data de Início</label>
              <input id="dataInicio" name="dataInicio" type="date" defaultValue={atividade.dataInicio} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label htmlFor="dataTermino" className="text-sm font-medium text-gray-300">Data de Término</label>
              <input id="dataTermino" name="dataTermino" type="date" defaultValue={atividade.dataFim} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="horaInicio" className="text-sm font-medium text-gray-300">Horário de Início</label>
              <input id="horaInicio" name="horaInicio" type="time" defaultValue={atividade.horarioInicio} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label htmlFor="horaTermino" className="text-sm font-medium text-gray-300">Horário de Término</label>
              <input id="horaTermino" name="horaTermino" type="time" defaultValue={atividade.horarioFim} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="vagas" className="text-sm font-medium text-gray-300">Máx. Participantes (Vagas)</label>
              <input id="vagas" name="vagas" type="number" min="1" defaultValue={atividade.maxParticipantes} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label htmlFor="cargaHorariaTotal" className="text-sm font-medium text-gray-300">Carga Horária do Participante (h)</label>
              <input id="cargaHorariaTotal" name="cargaHorariaTotal" type="number" min="1" defaultValue={atividade.cargaHorariaTotal} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label htmlFor="cargaHorariaMinistrante" className="text-sm font-medium text-gray-300">Carga Horária do Ministrante (h)</label>
              <input id="cargaHorariaMinistrante" name="cargaHorariaMinistrante" type="number" min="1" defaultValue={atividade.cargaHorariaMinistrante || atividade.cargaHorariaTotal} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Ministrante(s)</label>
            <div className="mt-1 max-h-48 overflow-y-auto bg-slate-900/50 border border-gray-600 rounded-md p-3 space-y-2">
              {participantes.map(p => {
                const isChecked = atividade.ministrantes?.some((m: any) => String(m.id) === String(p.id));
                return (
                  <label key={p.id} className="flex items-center space-x-3 text-white cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                    <input type="checkbox" name="ministranteId" value={p.id} defaultChecked={isChecked} className="w-4 h-4 text-brand-accent bg-slate-800 border-gray-600 rounded focus:ring-brand-accent focus:ring-2" />
                    <span className="text-sm">{p.nome}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="secondary" type="button" onClick={() => router.push('/admin/eventos')}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

export default function EditarAtividadePage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 flex items-center justify-center py-12 px-6 relative z-10">
        <Suspense fallback={<div className="text-white">Carregando...</div>}>
          <EditarAtividadeContent />
        </Suspense>
      </main>
    </div>
  );
}
