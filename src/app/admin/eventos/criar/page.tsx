'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../../components/ui/Navbar';
import { GlassCard, Button, InputField } from '../../../../components/ui/Core';

export default function CriarEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCriar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      titulo: formData.get('titulo'),
      dataInicio: formData.get('dataInicio'),
      dataTermino: formData.get('dataTermino'),
      descricao: formData.get('descricao'),
      link: formData.get('link'),
      tipoContabilizacao: formData.get('tipoContabilizacao') || 'POR_ATIVIDADE'
    };

    try {
      const res = await fetch('http://localhost:8080/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar evento');
      }

      setSuccess('Evento criado com sucesso! Redirecionando...');
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

      <main className="flex-1 w-full max-w-2xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">Novo Evento</h1>
          <Button variant="secondary" onClick={() => router.back()}>Voltar</Button>
        </div>

        <GlassCard className="p-8 bg-slate-800/80 border border-white/10">
          <form onSubmit={handleCriar} className="space-y-4">
            {error && <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-md text-sm">{error}</div>}
            {success && (
              <div className="fixed bottom-10 right-10 z-50 bg-green-600 border border-green-400 text-white px-6 py-4 rounded-md shadow-2xl shadow-green-900/50 animate-in fade-in slide-in-from-bottom-8 duration-300 font-medium">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {success}
                </div>
              </div>
            )}
            
            <InputField label="Título do Evento" id="titulo" type="text" required />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Data de Início" id="dataInicio" type="date" required />
              <InputField label="Data de Término" id="dataTermino" type="date" required />
            </div>

            <InputField label="Link (opcional)" id="link" type="url" />

            <div className="flex flex-col space-y-1 mb-4">
              <label htmlFor="tipoContabilizacao" className="text-sm font-medium text-gray-300">Tipo de Contabilização</label>
              <select id="tipoContabilizacao" name="tipoContabilizacao" className="w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent">
                <option value="POR_ATIVIDADE">Por Atividade</option>
                <option value="POR_CARGA_TOTAL">Por Carga Total</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1 mb-4">
              <label htmlFor="descricao" className="text-sm font-medium text-gray-300">Descrição</label>
              <textarea id="descricao" name="descricao" rows={4} required className="w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"></textarea>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando...' : 'Confirmar Criação'}
            </Button>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}
