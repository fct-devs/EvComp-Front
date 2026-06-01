'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../../../components/ui/Core';

export default function CriarAtividadePage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;

  const [participantes, setParticipantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all users to select as Ministrante
    fetch('http://localhost:8080/api/participantes')
      .then(res => res.json())
      .then(data => setParticipantes(data))
      .catch(err => console.error('Erro ao buscar participantes', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      const res = await fetch(`http://localhost:8080/api/atividades/evento/${eventoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao criar atividade');
      }

      router.push('/admin/eventos');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 flex items-center justify-center py-12 px-6 relative z-10">
        <div className="w-full max-w-2xl">
          <GlassCard className="p-8">
            <h2 className="text-3xl font-extrabold text-white text-center mb-8">Nova Atividade</h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-md mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="titulo" className="text-sm font-medium text-gray-300">Título da Atividade</label>
                <input id="titulo" name="titulo" type="text" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dataInicio" className="text-sm font-medium text-gray-300">Data de Início</label>
                  <input id="dataInicio" name="dataInicio" type="date" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
                <div>
                  <label htmlFor="dataTermino" className="text-sm font-medium text-gray-300">Data de Término</label>
                  <input id="dataTermino" name="dataTermino" type="date" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="horaInicio" className="text-sm font-medium text-gray-300">Horário de Início</label>
                  <input id="horaInicio" name="horaInicio" type="time" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
                <div>
                  <label htmlFor="horaTermino" className="text-sm font-medium text-gray-300">Horário de Término</label>
                  <input id="horaTermino" name="horaTermino" type="time" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vagas" className="text-sm font-medium text-gray-300">Máx. Participantes (Vagas)</label>
                  <input id="vagas" name="vagas" type="number" min="1" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
                <div>
                  <label htmlFor="cargaHorariaTotal" className="text-sm font-medium text-gray-300">Carga Horária do Participante (h)</label>
                  <input id="cargaHorariaTotal" name="cargaHorariaTotal" type="number" min="1" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
                <div>
                  <label htmlFor="cargaHorariaMinistrante" className="text-sm font-medium text-gray-300">Carga Horária do Ministrante (h)</label>
                  <input id="cargaHorariaMinistrante" name="cargaHorariaMinistrante" type="number" min="1" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Ministrante(s)</label>
                <div className="mt-1 max-h-48 overflow-y-auto bg-slate-900/50 border border-gray-600 rounded-md p-3 space-y-2">
                  {participantes.map(p => (
                    <label key={p.id} className="flex items-center space-x-3 text-white cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                      <input type="checkbox" name="ministranteId" value={p.id} className="w-4 h-4 text-brand-accent bg-slate-800 border-gray-600 rounded focus:ring-brand-accent focus:ring-2" />
                      <span className="text-sm">{p.nome}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="secondary" type="button" onClick={() => router.push('/admin/eventos')}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Adicionar Atividade'}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
