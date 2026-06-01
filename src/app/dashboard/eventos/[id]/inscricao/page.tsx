'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../../../actions/auth';

export default function InscricaoEventoPage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;

  const [evento, setEvento] = useState<any>(null);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [participanteId, setParticipanteId] = useState<number | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const perfilRes = await buscarPerfilUsuario();
        if (perfilRes.success) {
          setParticipanteId(perfilRes.data.id);
        } else {
          router.push('/login');
          return;
        }

        const [evRes, atvRes] = await Promise.all([
          fetch('http://localhost:8080/api/eventos'),
          fetch('http://localhost:8080/api/atividades')
        ]);

        const evData = await evRes.json();
        const ev = evData.find((e: any) => String(e.id) === String(eventoId));
        if (ev) setEvento(ev);

        const atvData = await atvRes.json();
        const filtradas = atvData.filter((a: any) => a.evento && String(a.evento.id) === String(eventoId));
        setAtividades(filtradas);
        setLoading(false);
      } catch (err: any) {
        setError('Erro ao carregar dados do evento.');
        setLoading(false);
      }
    }

    if (eventoId) carregarDados();
  }, [eventoId, router]);

  const toggleAtividade = (id: number) => {
    const novas = new Set(selecionadas);
    if (novas.has(id)) novas.delete(id);
    else novas.add(id);
    setSelecionadas(novas);
  };

  const handleInscrever = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      const payload = {
        participanteId: participanteId,
        eventoId: parseInt(String(eventoId)),
        atividadeIds: Array.from(selecionadas)
      };

      const res = await fetch('http://localhost:8080/api/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar inscrição.');
      }

      setSucesso(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white font-bold text-xl">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="PARTICIPANTE" />

      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">Inscrição no Evento</h1>
          <Button variant="secondary" onClick={() => router.push('/dashboard/eventos')}>Voltar aos Eventos</Button>
        </div>

        {evento && (
          <GlassCard className="p-8 bg-slate-800/80 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-brand-accent mb-4">{evento.titulo}</h2>
            <p className="text-gray-300 mb-4">{evento.descricao}</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <p><strong>Início:</strong> {evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString('pt-BR') : '-'}</p>
              <p><strong>Término:</strong> {evento.dataFim ? new Date(evento.dataFim).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-8 bg-slate-800/80 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Selecione as Atividades</h3>
          
          {error && <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">{error}</div>}
          
          {sucesso ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Inscrição Realizada com Sucesso!</h3>
              <p className="text-gray-400">Sua inscrição no evento e nas atividades foi confirmada.</p>
              <div className="pt-4">
                <Button onClick={() => router.push('/dashboard')}>Ir para o Início</Button>
              </div>
            </div>
          ) : atividades.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Não há atividades disponíveis para este evento no momento.</p>
          ) : (
            <div className="space-y-4 mb-8">
              {atividades.map((atv) => (
                <label key={atv.id} className="flex items-start space-x-4 p-4 rounded-lg border border-white/5 bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-1 bg-transparent border-gray-500 rounded focus:ring-brand-accent text-brand-accent"
                    checked={selecionadas.has(atv.id)}
                    onChange={() => toggleAtividade(atv.id)}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{atv.titulo}</h4>
                    <p className="text-sm text-gray-400">
                      Horário: {atv.horarioInicio?.slice(0,5)} - {atv.horarioFim?.slice(0,5)} | Data: {atv.dataInicio ? new Date(atv.dataInicio).toLocaleDateString('pt-BR') : ''}
                    </p>
                    <p className="text-xs text-brand-accent mt-1">Vagas totais: {atv.maxParticipantes}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {!sucesso && (
            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button onClick={handleInscrever} disabled={submitting}>
                {submitting ? 'Processando...' : 'Confirmar Inscrição'}
              </Button>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
