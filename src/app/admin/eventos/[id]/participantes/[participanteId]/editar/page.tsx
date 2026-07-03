'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../../../../../components/ui/Navbar';
import { GlassCard, Button, InputField } from '../../../../../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../../../../../actions/auth';
import { validarRa } from '../../../../../../../utils/validation';

export default function EditarParticipantePage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params.id;
  const participanteId = params.participanteId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [nome, setNome] = useState('');
  const [ra, setRa] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function carregarDados() {
      const resAuth = await buscarPerfilUsuario();
      if (!resAuth.success || resAuth.data.role !== 'ADMIN') {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`/api/participantes/${participanteId}`, { credentials: 'include' });
        if (!res.ok) {
          throw new Error('Falha ao carregar dados do participante');
        }
        const data = await res.json();
        setNome(data.nomeCompleto || data.nome || '');
        setRa(data.ra || '');
        setEmail(data.email || '');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Erro de conexão ao buscar participante.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [participanteId, router]);

  const validarNovosDadosParticipante = (novoNome: string, novoRa: string): boolean => {
    setError('');
    setSuccess('');
    
    if (!novoNome.trim()) {
      setError('O campo Nome é obrigatório.');
      return false;
    }

    if (email.endsWith('@unesp.br')) {
      if (!novoRa.trim()) {
        setError('O campo RA é obrigatório para contas vinculadas a e-mail institucional (@unesp.br).');
        return false;
      }
      if (!validarRa(novoRa)) {
        setError('RA Institucional inválido. O RA deve ter exatamente 9 caracteres.');
        return false;
      }
    } else {
      if (novoRa.trim() && !validarRa(novoRa)) {
        setError('O RA deve ter exatamente 9 caracteres.');
        return false;
      }
    }

    return true;
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();

    const dadosValidos = validarNovosDadosParticipante(nome, ra);
    if (!dadosValidos) return;

    setSubmitting(true);
    try {
      const payload = { nome, ra };
      const res = await fetch(`/api/participantes/${participanteId}`, { credentials: 'include', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Falha ao atualizar dados.');
      }

      setSuccess(resData.message || 'Informações do participante atualizadas com sucesso!');
      
      // Limpa mensagem de sucesso após 3 segundos e retorna
      setTimeout(() => {
        router.push(`/admin/eventos/${eventoId}/participantes`);
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao realizar atualização.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
        <span className="text-white">Carregando dados do participante...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-3xl mx-auto py-12 px-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Editar Participante</h1>
          <Button variant="secondary" onClick={() => router.push(`/admin/eventos/${eventoId}/participantes`)}>Voltar</Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-md mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {error}
          </div>
        )}

        {success && (
          <div className="fixed bottom-10 right-10 z-50 bg-green-600 border border-green-400 text-white px-6 py-4 rounded-md shadow-2xl shadow-green-900/50 animate-in fade-in slide-in-from-bottom-8 duration-300 font-medium">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              {success}
            </div>
          </div>
        )}

        <GlassCard className="p-8 bg-slate-800/80 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Informações do Participante</h3>
          
          <form onSubmit={handleEditar} className="space-y-6">
            <InputField 
              label="E-mail" 
              id="email" 
              type="email" 
              value={email} 
              readOnly 
              placeholder="E-mail do usuário"
            />
            <div className="text-xs text-gray-500 -mt-4 mb-4 ml-1">O e-mail não pode ser alterado por motivos de segurança e login.</div>

            <InputField 
              label="Nome Completo *" 
              id="nome" 
              type="text" 
              value={nome} 
              onChange={(e: any) => setNome(e.target.value)} 
              placeholder="Digite o nome completo"
            />

            <InputField 
              label={email.endsWith('@unesp.br') ? 'RA *' : 'RA (Opcional)'} 
              id="ra" 
              type="text" 
              value={ra} 
              onChange={(e: any) => setRa(e.target.value)} 
              placeholder="Digite o RA do aluno"
            />

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}
