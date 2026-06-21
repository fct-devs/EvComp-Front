'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../../../actions/auth';

export default function ParticipantesDoEventoPage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;

  const [participantes, setParticipantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedParticipante, setExpandedParticipante] = useState<number | null>(null);

  const toggleParticipante = (id: number) => {
    setExpandedParticipante(expandedParticipante === id ? null : id);
  };

  useEffect(() => {
    async function carregarParticipantes() {
      const resAuth = await buscarPerfilUsuario();
      if (!resAuth.success || resAuth.data.role !== 'ADMIN') {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/eventos/${eventoId}/participantes`, { credentials: 'include' });
        if (!res.ok) {
          throw new Error('Falha ao carregar participantes');
        }
        const data = await res.json();
        setParticipantes(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Erro de conexão.');
      } finally {
        setLoading(false);
      }
    }
    carregarParticipantes();
  }, [eventoId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
        <span className="text-white">Carregando participantes...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Participantes Inscritos</h1>
          <Button variant="secondary" onClick={() => router.push('/admin/eventos')}>Voltar</Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-md mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {error}
          </div>
        )}

        <GlassCard className="p-8 bg-slate-800/80 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Listagem de Participantes</h3>
            <span className="bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full text-sm font-bold">
              Total: {participantes.length}
            </span>
          </div>

          {participantes.length === 0 ? (
             <p className="text-gray-400 text-center py-8">Nenhum participante inscrito neste evento.</p>
          ) : (
            <div className="space-y-3">
              {participantes.map((p) => {
                const isExpanded = expandedParticipante === p.id;
                return (
                  <div key={p.id} className="bg-slate-900/50 border border-white/5 rounded-lg overflow-hidden transition-all duration-300">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
                      onClick={() => toggleParticipante(p.id)}
                    >
                      <h4 className="font-bold text-white text-lg">{p.nomeCompleto || p.nome}</h4>
                      {isExpanded ? (
                        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="p-4 border-t border-white/5 bg-slate-900/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-300"><strong className="text-gray-400">E-mail:</strong> {p.email}</p>
                          <p className="text-sm text-gray-300"><strong className="text-gray-400">RA:</strong> {p.ra || '-'}</p>
                        </div>
                        <Link href={`/admin/eventos/${eventoId}/participantes/${p.id}/editar`}>
                          <Button variant="secondary" className="py-2 px-4 border-brand-accent/50 text-brand-accent hover:bg-brand-accent/20">
                            Editar
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
