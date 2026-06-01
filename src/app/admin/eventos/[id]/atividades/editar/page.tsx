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

    const formData = new FormData(e.currentTarget);
    const data = {
      titulo: formData.get('titulo'),
      max_participantes: formData.get('vagas'),
      ministrante_id: formData.get('ministranteId'),
      carga_horaria_ministrantes: formData.get('cargaHoraria'),
      // As datas e horários já são imutáveis após criação, ou podem ser adicionados se o backend suportar.
      // Atualmente o backend suporta edição parcial de max_participantes e titulo, ministrante e carga.
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

      router.push('/admin/eventos');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-white p-12">Carregando dados da atividade...</div>;
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="text-sm font-medium text-gray-300">Título da Atividade</label>
            <input id="titulo" name="titulo" type="text" defaultValue={atividade.titulo} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="vagas" className="text-sm font-medium text-gray-300">Máx. Participantes (Vagas)</label>
              <input id="vagas" name="vagas" type="number" min="1" defaultValue={atividade.maxParticipantes} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label htmlFor="cargaHoraria" className="text-sm font-medium text-gray-300">Carga Horária (h)</label>
              <input id="cargaHoraria" name="cargaHoraria" type="number" min="1" defaultValue={atividade.cargaHorariaTotal} required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
          </div>

          <div>
            <label htmlFor="ministranteId" className="text-sm font-medium text-gray-300">Ministrante</label>
            <select id="ministranteId" name="ministranteId" defaultValue={atividade.ministrantes && atividade.ministrantes.length > 0 ? atividade.ministrantes[0].id : ""} className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent">
              <option value="">Nenhum ministrante vinculado...</option>
              {participantes.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
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
