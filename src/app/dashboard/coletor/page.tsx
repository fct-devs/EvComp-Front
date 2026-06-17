'use client';

import React, { useState } from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';

export default function ColetorPage() {
  const [atividadeId, setAtividadeId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const timestampLido = Date.now();
      const payload = {
        atividadeId,
        codigoAuth: pin,
        timestampLido
      };

      const res = await fetch('http://localhost:8080/api/presencas/registrar', { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar presença');
      }

      setMessage(data.message);
      setPin(''); // Limpa o pin para o próximo
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] font-sans">
      <Navbar />

      <main className="max-w-md mx-auto pt-24 px-6 relative z-10">
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Coleta de Presença</h1>
            <p className="text-gray-400 mt-2 text-sm">Digite o ID da Atividade e o PIN gerado no app do Participante.</p>
          </div>

          <form onSubmit={handleRegistrar} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ID da Atividade</label>
              <input
                type="text"
                value={atividadeId}
                onChange={(e) => setAtividadeId(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
                placeholder="Ex: 1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">PIN do Participante (6 dígitos)</label>
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
                placeholder="000000"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-sm text-green-400 font-medium">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || pin.length !== 6 || !atividadeId}
              className="w-full h-12 mt-4 text-base tracking-wide flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Registrar Presença'
              )}
            </Button>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}
