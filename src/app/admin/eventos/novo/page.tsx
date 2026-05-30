'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../../components/ui/Navbar';
import { Button, InputField, GlassCard } from '../../../../components/ui/Core';
import { solicitarCriacaoEvento } from '../../../actions/admin';
import { validarDadosEvento } from '../../../../utils/validation';

export default function CriacaoEventoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    link: '',
    dataInicio: '',
    dataFim: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- MÉTODOS DA CriacaoEventoUI (ASTAH) ---
  const informarDadosInvalidos = () => setError('Dados inválidos. Verifique datas e título.');
  const informarEventoDuplicado = () => setError('Já existe um evento com este título.');
  const informarErroCriacao = () => setError('Erro de conexão ao tentar criar o evento.');
  const informarSucessoCriacao = () => {
    alert('Evento criado com sucesso!');
    router.push('/admin');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validação mapeada do Astah
    const isValido = validarDadosEvento(
      formData.titulo, 
      new Date(formData.dataInicio), 
      new Date(formData.dataFim), 
      formData.descricao, 
      formData.link
    );

    if (!isValido) {
      informarDadosInvalidos();
      return;
    }

    setLoading(true);
    
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => payload.append(key, val));

    const res = await solicitarCriacaoEvento(payload);
    
    if (res.success) {
      informarSucessoCriacao();
    } else {
      if (res.error === 'Evento Duplicado') {
        informarEventoDuplicado();
      } else {
        informarErroCriacao();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at top, #1e293b 0%, #0A192F 100%)'
      }}></div>

      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-3xl mx-auto py-12 px-6 relative z-10">
        <GlassCard className="w-full bg-slate-900/80 p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6">Criar Novo Evento</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 p-4 rounded text-red-200 font-medium">
                {error}
              </div>
            )}
            
            <InputField 
              label="Título do Evento" 
              id="titulo" 
              type="text" 
              placeholder="Ex: V Semana da Computação" 
              value={formData.titulo} 
              onChange={handleChange} 
              required 
            />

            <div className="space-y-1">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-300">Descrição</label>
              <textarea 
                id="descricao" 
                rows={4}
                className="w-full bg-slate-800 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                placeholder="Descrição completa do evento..."
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Data de Início" 
                id="dataInicio" 
                type="date" 
                value={formData.dataInicio} 
                onChange={handleChange} 
                required 
              />
              <InputField 
                label="Data de Término" 
                id="dataFim" 
                type="date" 
                value={formData.dataFim} 
                onChange={handleChange} 
                required 
              />
            </div>

            <InputField 
              label="Link Útil (Opcional)" 
              id="link" 
              type="url" 
              placeholder="https://..." 
              value={formData.link} 
              onChange={handleChange} 
            />

            <div className="pt-6 flex justify-end space-x-4">
              <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Evento'}
              </Button>
            </div>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}
