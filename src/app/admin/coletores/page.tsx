'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { Button, GlassCard } from '../../../components/ui/Core';
import { exibirParticipantes, tornarColetor, removerColetor } from '../../actions/admin';

export default function GestaoColetoresPage() {
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- MÉTODOS DA AtribuirColetorUI / RemoverColetorUI (ASTAH) ---
  const exibirEventos = () => [{ id: '1', titulo: 'Evento Principal' }];
  const exibirColetores = () => participantes.filter(p => p.role === 'COLETOR');
  
  const solicitarAtribuicaoColetor = async (participanteRa: string) => {
    // Hardcoded eventoId = '1' para fins do protótipo
    const res = await tornarColetor('1', participanteRa);
    if (res.success) {
      alert(res.message);
      fetchData();
    } else {
      alert(res.error);
    }
  };

  const solicitarRemocaoColetor = async (coletorId: string) => {
    const res = await removerColetor('1', coletorId);
    if (res.success) {
      alert('Coletor removido com sucesso!');
      fetchData();
    } else {
      alert(res.error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await exibirParticipantes();
    if (res.success) setParticipantes(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 relative z-10">
        <GlassCard className="w-full bg-slate-900/80 p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6">Gestão de Coletores de Presença</h1>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-accent">Todos os Participantes</h2>
            {loading ? (
              <p className="text-gray-400">Carregando...</p>
            ) : (
              <div className="space-y-4">
                {participantes.length === 0 && <p className="text-gray-400">Nenhum participante encontrado.</p>}
                
                {participantes.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 bg-slate-800 rounded-lg border border-white/5">
                    <div>
                      <p className="text-white font-bold">{p.nome}</p>
                      <p className="text-sm text-gray-400">RA: {p.ra || 'N/A'}</p>
                    </div>
                    <div>
                      {p.role === 'COLETOR' ? (
                        <Button variant="danger" onClick={() => solicitarRemocaoColetor(p.id)}>Remover Cargo</Button>
                      ) : (
                        <Button variant="primary" onClick={() => solicitarAtribuicaoColetor(p.ra)}>Tornar Coletor</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
