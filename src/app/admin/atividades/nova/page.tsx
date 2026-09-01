'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../../components/ui/Navbar';
import { Button, InputField, GlassCard } from '../../../../components/ui/Core';
import { solicitarCriacaoAtividade } from '../../../actions/admin';

export default function CriacaoAtividadePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    titulo: '',
    local: '',
    ministrantes: '',
    descricao: '',
    preRequisitos: '',
    maxParticipantes: '',
    dataInicio: '',
    dataTermino: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const informarDadosInvalidos = () => setError('Dados inválidos. Verifique os campos.');
  const informarAtividadeDuplicada = () => setError('Atividade já existe neste evento.');
  const informarSucessoCriacao = () => {
    alert('Atividade criada com sucesso!');
    router.push('/admin');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validarDados = (titulo: string, dataInicio: string, dataTermino: string, ministrantes: string) => {
    if (!titulo || !dataInicio || !dataTermino || !ministrantes) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validarDados(formData.titulo, formData.dataInicio, formData.dataTermino, formData.ministrantes)) {
      informarDadosInvalidos();
      return;
    }

    setLoading(true);
    
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => payload.append(key, val));
    
    payload.append('eventoId', '1');

    const res = await solicitarCriacaoAtividade(payload);
    
    if (res.success) {
      informarSucessoCriacao();
    } else {
      if (res.error?.includes('duplicada')) {
        informarAtividadeDuplicada();
      } else {
        setError(res.error || 'Erro de conexão.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-3xl mx-auto py-12 px-6 relative z-10">
        <GlassCard className="w-full bg-slate-900/80 p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6">Criar Nova Atividade</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 p-4 rounded text-red-200 font-medium">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Título da Atividade" id="titulo" type="text" value={formData.titulo} onChange={handleChange} required />
              <InputField label="Local / Sala" id="local" type="text" placeholder="Ex: Sala 5B (Central), Lab. 06" value={formData.local} onChange={handleChange} />
            </div>
            <InputField label="Ministrante(s)" id="ministrantes" type="text" value={formData.ministrantes} onChange={handleChange} required />
            
            <div className="space-y-4 pt-2 pb-2">
              <div>
                <label htmlFor="descricao" className="text-sm font-medium text-gray-300">
                  Descrição da Atividade <span className="text-gray-500 font-normal text-xs">(Opcional)</span>
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  rows={3}
                  placeholder="Resumo sobre o que será abordado na atividade..."
                  className="mt-1 w-full bg-slate-900/50 border border-gray-600 rounded-md p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-y text-sm"
                  value={formData.descricao}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="preRequisitos" className="text-sm font-medium text-gray-300">
                  Pré-requisitos <span className="text-gray-500 font-normal text-xs">(Opcional)</span>
                </label>
                <textarea
                  id="preRequisitos"
                  name="preRequisitos"
                  rows={2}
                  placeholder="Ex: Instalar VS Code, trazer notebook..."
                  className="mt-1 w-full bg-orange-900/10 border border-orange-500/30 rounded-md p-3 text-orange-100 placeholder:text-orange-900/50 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y text-sm"
                  value={formData.preRequisitos}
                  onChange={handleChange}
                />
              </div>
            </div>

            <InputField label="Vagas Máximas" id="maxParticipantes" type="number" value={formData.maxParticipantes} onChange={handleChange} required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Data Início" id="dataInicio" type="datetime-local" value={formData.dataInicio} onChange={handleChange} required />
              <InputField label="Data Término" id="dataTermino" type="datetime-local" value={formData.dataTermino} onChange={handleChange} required />
            </div>

            <div className="pt-6 flex justify-end space-x-4">
              <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Criar Atividade'}
              </Button>
            </div>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}