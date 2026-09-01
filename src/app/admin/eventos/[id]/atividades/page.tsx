'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../../../components/ui/Navbar';
import { GlassCard, Button, InputField } from '../../../../../components/ui/Core';

export default function GerenciarAtividadesPage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;

  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evento, setEvento] = useState<any>(null);

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchAtividades = () => {
    fetch('/api/atividades', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const filtradas = data.filter((a: any) => a.evento && String(a.evento.id) === String(eventoId));
        setAtividades(filtradas);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!eventoId) return;
    fetch(`/api/eventos/buscar?tituloEvento=`, { credentials: 'include' }) // We can just fetch all to find the event title
      .then(res => res.json())
      .then(data => {
        // If API doesn't support findById easily, we can just leave evento null or use a specific endpoint
        // Actually EventoController has /buscar?titulo, but we know the ID, let's just fetch all
      });
    
    fetch('/api/eventos', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const ev = data.find((e: any) => String(e.id) === String(eventoId));
        if (ev) setEvento(ev);
      });

    fetchAtividades();
  }, [eventoId]);

  const handleCriar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      titulo: formData.get('titulo'),
      local: formData.get('local'),
      data_inicio: formData.get('dataInicio'),
      horario_inicio: parseInt(String(formData.get('horarioInicio'))?.replace(':', '') || '0'),
      data_termino: formData.get('dataTermino'),
      horario_termino: parseInt(String(formData.get('horarioTermino'))?.replace(':', '') || '0'),
      max_participantes: parseInt(String(formData.get('maxParticipantes')) || '0'),
      carga_horaria_ministrantes: parseInt(String(formData.get('cargaHoraria')) || '0'),
      eventoId: parseInt(String(eventoId))
    };

    try {
      const res = await fetch(`/api/atividades/evento/${eventoId}`, { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao criar atividade');

      setShowForm(false);
      fetchAtividades();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Deseja excluir esta atividade?')) return;
    try {
      let res = await fetch(`/api/atividades/${id}`, { credentials: 'include',  method: 'DELETE' });
      
      if (res.status === 409) {
        const data = await res.json();
        const confirmacaoAdicional = confirm(data.error || 'Atividade com participantes inscritos. Confirmar exclusão?');
        if (!confirmacaoAdicional) return;
        
        res = await fetch(`/api/atividades/${id}?confirmar=true`, { credentials: 'include',  method: 'DELETE' });
      }

      if (res.ok) {
        alert('Atividade excluída com sucesso!');
        fetchAtividades();
      } else if (res.status !== 409) {
         const data = await res.json();
         alert(data.error || 'Erro ao excluir atividade');
      }
    } catch (err) {
      alert('Erro na requisição de exclusão');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Atividades</h1>
            {evento && <p className="text-gray-400 mt-2">Evento: {evento.titulo}</p>}
          </div>
          <div className="space-x-4">
            <Button variant="secondary" onClick={() => router.back()}>Voltar</Button>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancelar' : 'Nova Atividade'}
            </Button>
          </div>
        </div>

        {showForm && (
          <GlassCard className="p-6 bg-slate-800/80 border border-brand-accent/30 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Adicionar Nova Atividade</h2>
            <form onSubmit={handleCriar} className="space-y-4">
              {formError && <div className="p-3 bg-red-500/20 text-red-200 rounded-md text-sm">{formError}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Título da Atividade" id="titulo" type="text" required />
                <InputField label="Local / Sala" id="local" type="text" placeholder="Ex: Sala 5B (Central), Lab. 06" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputField label="Data Início" id="dataInicio" type="date" required />
                <InputField label="Horário Início (HH:MM)" id="horarioInicio" type="time" required />
                <InputField label="Data Término" id="dataTermino" type="date" required />
                <InputField label="Horário Término (HH:MM)" id="horarioTermino" type="time" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Vagas Máximas" id="maxParticipantes" type="number" min="1" required />
                <InputField label="Carga Horária (horas)" id="cargaHoraria" type="number" min="1" required />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Salvando...' : 'Salvar Atividade'}
                </Button>
              </div>
            </form>
          </GlassCard>
        )}

        <GlassCard className="p-6 bg-slate-800/80 border border-white/10">
          {loading ? (
            <p className="text-white text-center">Carregando atividades...</p>
          ) : atividades.length === 0 ? (
            <p className="text-gray-400 text-center">Nenhuma atividade cadastrada para este evento.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-3 px-4">Título</th>
                    <th className="py-3 px-4">Local</th>
                    <th className="py-3 px-4">Horário</th>
                    <th className="py-3 px-4">Vagas</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {atividades.map((atv: any) => (
                    <tr key={atv.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-semibold">{atv.titulo}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{atv.local || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">
                        {atv.dataInicio ? new Date(atv.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''} <br/>
                        {atv.horarioInicio?.slice(0,5)} até {atv.horarioFim?.slice(0,5)}
                      </td>
                      <td className="py-3 px-4 text-gray-300">{atv.maxParticipantes}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <Button variant="danger" className="px-4 py-1 text-xs" onClick={() => handleExcluir(atv.id)}>
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
