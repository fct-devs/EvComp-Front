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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs uppercase bg-slate-900/50 text-gray-400 border-b border-white/5">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 font-semibold tracking-wider">E-mail</th>
                    <th scope="col" className="px-6 py-3 font-semibold tracking-wider">RA</th>
                    <th scope="col" className="px-6 py-3 font-semibold tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {participantes.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{p.nome}</td>
                      <td className="px-6 py-4">{p.email}</td>
                      <td className="px-6 py-4">{p.ra || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/eventos/${eventoId}/participantes/${p.id}/editar`}>
                          <Button variant="secondary" className="py-1 px-3 text-xs border-brand-accent/50 text-brand-accent hover:bg-brand-accent/20">Editar</Button>
                        </Link>
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
