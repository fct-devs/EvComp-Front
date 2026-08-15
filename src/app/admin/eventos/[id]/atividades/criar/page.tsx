'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEventoStore } from '../../../../../../store/useEventoStore';
import { validarDadosAtividade } from '../../../../../../utils/validation';
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
    fetch('/api/participantes', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setParticipantes(data))
      .catch(err => console.error('Erro ao buscar participantes', err));

    if (!evento) {
      fetch(`/api/eventos/${eventoId}/detalhes`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            if(data.dadosEvento) {
                setEvento(data.dadosEvento);
            }
        })
        .catch(err => console.error('Erro ao buscar evento', err));
    }
  }, [eventoId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = {
      evento_id: parseInt(eventoId as string),
      titulo: formData.get('titulo') as string,
      descricao: formData.get('descricao') as string,
      pre_requisitos: formData.get('preRequisitos') as string,
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
      const res = await fetch(`/api/atividades`, { credentials: 'include', 
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

              <div className="space-y-4 pt-2 pb-2">
                <div>
                  <label htmlFor="descricao" className="text-sm font-medium text-gray-300">
                    Descrição da Atividade <span className="text-gray-500 font-normal text-xs">(Opcional)</span>
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={3}
                    placeholder="Resumo sobre o que será abordado na atividade..."
                    className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-y"
                  />
                </div>

                <div>
                  <label htmlFor="preRequisitos" className="text-sm font-medium text-gray-300">
                    Pré-requisitos <span className="text-gray-500 font-normal text-xs">(Opcional)</span>
                  </label>
                  <textarea
                    id="preRequisitos"
                    name="preRequisitos"
                    rows={2}
                    placeholder="Ex: Instalar VS Code, trazer notebook..."
                    className="mt-1 w-full bg-orange-900/10 border border-orange-500/30 rounded-md p-3 text-orange-100 placeholder:text-orange-900/50 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                  />
                </div>
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
                <div className="col-span-2">
                  <label htmlFor="cargaHorariaMinistrante" className="text-sm font-medium text-gray-300">Carga Horária do Ministrante (h)</label>
                  <input id="cargaHorariaMinistrante" name="cargaHorariaMinistrante" type="number" min="1" required className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Ministrante(s)</label>
                <div className="mt-1 max-h-48 overflow-y-auto bg-slate-900/50 border border-gray-600 rounded-md p-3 space-y-2 custom-scrollbar">
                  {participantes.map(p => (
                    <label key={p.id} className="flex items-center space-x-3 text-white cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                      <input type="checkbox" name="ministranteId" value={p.id} className="w-4 h-4 text-brand-accent bg-slate-800 border-gray-600 rounded focus:ring-brand-accent focus:ring-2" />
                      <span className="text-sm">{p.nomeCompleto}</span>
                    </label>
                  ))}
                  {participantes.length === 0 && (
                    <div className="text-gray-500 text-sm italic py-2">Nenhum ministrante cadastrado.</div>
                  )}
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