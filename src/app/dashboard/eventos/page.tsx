'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../actions/auth';

export default function ParticipanteEventosPage() {
  const [eventos, setEventos] = useState([]);
  const [inscritos, setInscritos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const perfilRes = await buscarPerfilUsuario();
        let minInscritos: number[] = [];
        if (perfilRes.success) {
          const minRes = await fetch(`/api/inscricoes/minhas?participanteId=${perfilRes.data.id}`, { credentials: 'include' });
          if (minRes.ok) {
            const minData = await minRes.json();
            if (minData.inscritos) minInscritos = minData.inscritos;
          }
        }
        setInscritos(minInscritos);

        let evRes;
        if (perfilRes.success && perfilRes.data.id) {
          evRes = await fetch(`/api/eventos/disponiveis/${perfilRes.data.id}`, { credentials: 'include' });
        } else {
          evRes = await fetch('/api/eventos/disponiveis', { credentials: 'include' });
        }
        
        const evData = await evRes.json();
        // Os eventos já vêm filtrados por data do backend (evitando erros de TimeZone)
        // Só garantimos que não mostra nenhum erro de estrutura
        setEventos(evData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="PARTICIPANTE" />

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-white mb-8">Eventos Disponíveis</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-white col-span-full text-center">Carregando eventos...</p>
          ) : eventos.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center">Nenhum evento disponível no momento.</p>
          ) : (
            eventos.map((ev: any) => (
              <GlassCard key={ev.id} className="p-6 bg-slate-800/80 border border-white/10 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-2">{ev.titulo}</h2>
                <p className="text-gray-400 text-sm mb-4 flex-1">{ev.descricao}</p>
                <div className="text-sm text-gray-300 mb-6 space-y-1">
                  <p><strong>Início:</strong> {ev.dataInicio ? new Date(ev.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</p>
                  <p><strong>Término:</strong> {ev.dataFim ? new Date(ev.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</p>
                </div>
                {inscritos.includes(ev.id) ? (
                  <span className="block w-full text-center px-6 py-2 rounded-full font-bold transition-all duration-300 bg-gray-500/50 text-gray-300 cursor-not-allowed border border-gray-400/20">
                    Inscrito
                  </span>
                ) : (
                  <Link href={`/dashboard/eventos/${ev.id}/inscricao`} className="block w-full text-center px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 bg-white text-slate-900 hover:bg-gray-200">
                    Inscrever-se
                  </Link>
                )}
              </GlassCard>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
