'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEventoStore } from '../../../../../../store/useEventoStore';
import { Navbar } from '../../../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../../../components/ui/Core';

export default function CriarAtividadePage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;

  const [participantes, setParticipantes] = useState<any[]>([]);
  const { evento, setEvento } = useEventoStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/participantes', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setParticipantes(data))
      .catch(err => console.error('Erro ao buscar participantes', err));

    if (!evento) {
      fetch(`http://localhost:8080/api/eventos/${eventoId}/detalhes`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            if(data.dadosEvento) {
                setEvento(data.dadosEvento);
            }
        })
        .catch(err => console.error('Erro ao buscar evento', err));
    }
  }, [eventoId]);

  const validarDadosAtividade = (titulo: string, data_inicio: string, data_termino: string, horario_inicio: string, horario_termino: string, evInicio?: string, evFim?: string) => {
    if (!titulo || !data_inicio || !data_termino || !horario_inicio || !horario_termino) {
        return 'Campos obrigatórios ausentes.';
    }
    
    const dtIn = new Date(`${data_inicio}T${horario_inicio}`);
    const dtFi = new Date(`${data_termino}T${horario_termino}`);
    if (dtIn > dtFi) {
        return 'A data e hora de início não podem ser posteriores ao término.';
    }

    if (evInicio && evFim) {
        const parseDateFallback = (dt: any) => {
            try {
                if (!dt) return null;
                if (Array.isArray(dt)) {
                    return new Date(dt[0], dt[1] - 1, dt[2]);
                }
                
                // Tratamento especial para formato YYYY-MM-DD
                if (typeof dt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dt.trim())) {
                    const parts = dt.trim().split('-');
                    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                }
                
                const d = new Date(dt);
                if (isNaN(d.getTime())) return null;
                return new Date(d.getFullYear(), d.getMonth(), d.getDate());
            } catch { return null; }
        };

        const eventoIn = parseDateFallback(evInicio);
        const eventoFi = parseDateFallback(evFim);

        if (eventoIn && eventoFi) {
            const partsIn = data_inicio.split('-');
            const partsFi = data_termino.split('-');
            const dtIn = new Date(parseInt(partsIn[0]), parseInt(partsIn[1]) - 1, parseInt(partsIn[2]));
            const dtFi = new Date(parseInt(partsFi[0]), parseInt(partsFi[1]) - 1, parseInt(partsFi[2]));

            if (dtIn.getTime() < eventoIn.getTime()) {
                return 'A data de início da atividade não pode ser anterior ao evento.';
            }
            if (dtFi.getTime() > eventoFi.getTime()) {
                return 'A data de término da atividade não pode ser posterior ao evento.';
            }
        }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = {
      evento_id: parseInt(eventoId as string),
      titulo: formData.get('titulo') as string,
      data_inicio: formData.get('dataInicio') as string,
      data_termino: formData.get('dataTermino') as string,
      horario_inicio: formData.get('horaInicio')?.toString().substring(0, 5) as string,
      horario_termino: formData.get('horaTermino')?.toString().substring(0, 5) as string,
      max_participantes: parseInt(formData.get('vagas') as string),
      ministrantes_ids: formData.getAll('ministranteId').map(id => parseInt(id.toString())),
      carga_horaria_total: parseInt(formData.get('cargaHorariaTotal') as string),
      carga_horaria_ministrantes: parseInt(formData.get('cargaHorariaMinistrante') as string),
    };

    const erroValidacao = validarDadosAtividade(
      data.titulo, data.data_inicio, data.data_termino, data.horario_inicio, data.horario_termino,
      evento?.dataInicio, evento?.dataFim
    );

    if (erroValidacao) {
      setError(erroValidacao);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/atividades`, { credentials: 'include', 
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

      setSuccess('Atividade criada com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/admin/eventos');
      }, 1500);
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
                <input id="titulo" name="titulo" type="text" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dataInicio" className="text-sm font-medium text-gray-300">Data de Início</label>
                  <input id="dataInicio" name="dataInicio" type="date" required style={{ colorScheme: 'dark' }} className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
                <div>
                  <label htmlFor="dataTermino" className="text-sm font-medium text-gray-300">Data de Término</label>
                  <input id="dataTermino" name="dataTermino" type="date" required style={{ colorScheme: 'dark' }} className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="horaInicio" className="text-sm font-medium text-gray-300">Horário de Início</label>
                  <input id="horaInicio" name="horaInicio" type="time" required style={{ colorScheme: 'dark' }} className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
                <div>
                  <label htmlFor="horaTermino" className="text-sm font-medium text-gray-300">Horário de Término</label>
                  <input id="horaTermino" name="horaTermino" type="time" required style={{ colorScheme: 'dark' }} className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
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
                      <span className="text-sm">{p.nomeCompleto}</span>
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
