'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';

export default function ParticipanteEventosPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/eventos')
      .then(res => res.json())
      .then(data => {
        // Filtrar apenas eventos válidos se necessário.
        setEventos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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
                  <p><strong>Início:</strong> {ev.dataInicio ? new Date(ev.dataInicio).toLocaleDateString('pt-BR') : '-'}</p>
                  <p><strong>Término:</strong> {ev.dataFim ? new Date(ev.dataFim).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
                <Link href={`/dashboard/eventos/${ev.id}/inscricao`}>
                  <Button className="w-full">Inscrever-se</Button>
                </Link>
              </GlassCard>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
