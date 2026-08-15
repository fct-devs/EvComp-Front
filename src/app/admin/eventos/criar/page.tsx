'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../../components/ui/Navbar';
import { GlassCard, Button, InputField } from '../../../../components/ui/Core';
import { Info } from 'lucide-react';

export default function CriarEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validarDadosEvento = (titulo: string, dataInicio: string, dataTermino: string, dataInicioInscricao: string, dataFimInscricao: string, descricao: string, link: string, tipo: string) => {
    if (!titulo || !dataInicio || !dataTermino || !dataInicioInscricao || !dataFimInscricao || !descricao || !tipo) {
      return 'Campos obrigatórios ausentes.';
    }
    if (new Date(dataTermino) < new Date(dataInicio)) {
      return 'Data de término do evento não pode ser anterior à data de início.';
    }
    if (new Date(dataFimInscricao) < new Date(dataInicioInscricao)) {
      return 'Data de término das inscrições não pode ser anterior à data de início das inscrições.';
    }
    return null;
  };

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
      dataInicioInscricao: formData.get('dataInicioInscricao'),
      dataFimInscricao: formData.get('dataFimInscricao'),
      descricao: formData.get('descricao'),
      link: formData.get('link'),
      tipoContabilizacao: formData.get('tipoContabilizacao') || 'POR_ATIVIDADE'
    };

    const erroValidacao = validarDadosEvento(
      payload.titulo as string,
      payload.dataInicio as string,
      payload.dataTermino as string,
      payload.dataInicioInscricao as string,
      payload.dataFimInscricao as string,
      payload.descricao as string,
      payload.link as string,
      payload.tipoContabilizacao as string
    );

    if (erroValidacao) {
      setError(erroValidacao);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/eventos', { credentials: 'include', 
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
              <InputField label="Data de Início do Evento" id="dataInicio" type="date" required />
              <InputField label="Data de Término do Evento" id="dataTermino" type="date" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Início das Inscrições" id="dataInicioInscricao" type="date" required />
              <InputField label="Término das Inscrições" id="dataFimInscricao" type="date" required />
            </div>

            <InputField label="Link (opcional)" id="link" type="url" />

            <div className="flex flex-col space-y-1 mb-4">
              <div className="flex items-center gap-2">
                <label htmlFor="tipoContabilizacao" className="text-sm font-medium text-gray-300">
                  Tipo de Contabilização
                </label>
                <div className="relative group flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-brand-accent transition-colors focus:outline-none"
                    aria-label="Informações sobre tipos de contabilização"
                  >
                    <Info size={16} />
                  </button>
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block group-focus-within:block z-50 w-80 p-4 bg-slate-900/95 border border-brand-accent/30 rounded-xl shadow-2xl backdrop-blur-md text-xs text-gray-300 pointer-events-none">
                    <div className="font-bold text-white mb-2 text-xs flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                      <Info size={14} className="text-brand-accent" />
                      Como funciona a emissão de certificados?
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <span className="font-bold text-brand-accent">🔹 Por Atividade (Padrão):</span>
                        <p className="text-gray-300 mt-0.5 leading-relaxed text-[11px]">
                          Emite <strong>certificados individuais para cada atividade</strong> realizada com sua respectiva carga horária, permitindo também o certificado geral.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <span className="font-bold text-emerald-400">🔹 Por Carga Total:</span>
                        <p className="text-gray-300 mt-0.5 leading-relaxed text-[11px]">
                          Emite <strong>apenas um certificado geral</strong> somando as horas de todas as atividades com presença confirmada, sem gerar certificados avulsos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
