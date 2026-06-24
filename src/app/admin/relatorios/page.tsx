'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';

interface Evento {
  id: number;
  titulo: string;
}

export default function AdminRelatoriosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/relatorios/eventos', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setEventos(data);
        if (data.length > 0) {
          setEventoSelecionado(String(data[0].id));
        }
      })
      .catch((err) => setError('Erro ao buscar eventos finalizados'));

    fetch('/api/relatorios/tipos', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setTipos(data))
      .catch((err) => setError('Erro ao buscar tipos de relatórios'));
  }, []);

  const gerarRelatorio = async (tipo: string) => {
    setError('');
    const evObj = eventos.find(e => String(e.id) === eventoSelecionado);
    if (!evObj) {
      setError('Evento não encontrado na lista.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/relatorios/emitir', { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dadosEvento: { id: evObj.id, titulo: evObj.titulo }, tipo }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Falha ao emitir relatório');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = 'Relatorio.pdf';
      if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
        filename = contentDisposition.split('filename=')[1].replace(/['"]/g, '');
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Não precisa alertar o sucesso, o download já é a confirmação visual
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatarNomeTipo = (tipo: string) => {
    if (tipo === 'PARTICIPANTES') return 'Participantes por Atividade';
    if (tipo === 'GRAFICO') return 'Comparativo Internos/Externos';
    return tipo;
  };

  const formatarDescricaoTipo = (tipo: string) => {
    if (tipo === 'PARTICIPANTES') return 'Gera a lista em PDF dos inscritos confirmados';
    if (tipo === 'GRAFICO') return 'Gera um gráfico visual com dados da comunidade';
    return 'Relatório do sistema';
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="ADMIN" />
      
      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-extrabold text-white mb-2">Painel de Relatórios</h1>
        <p className="text-gray-400 mb-8">Audite os dados do evento e gere as listas de frequência finais.</p>

        {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-md text-sm">{error}</div>}

        <GlassCard className="bg-slate-900 border-white/5 p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selecione o Evento Finalizado:
            </label>
            <select 
              className="w-full md:w-1/2 p-2 rounded bg-slate-800 text-white border border-white/10"
              value={eventoSelecionado}
              onChange={(e) => setEventoSelecionado(e.target.value)}
            >
              <option value="" disabled>-- Selecione um Evento --</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-white font-bold text-lg border-b border-white/10 pb-2">Relatórios Disponíveis</h2>
              
              {tipos.length === 0 && (
                <p className="text-sm text-gray-400">Nenhum relatório configurado ou disponível.</p>
              )}

              {tipos.map((tipo) => (
                <div key={tipo} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-white/5 hover:border-brand-accent transition-colors">
                  <div>
                    <p className="text-white font-semibold text-sm">{formatarNomeTipo(tipo)}</p>
                    <p className="text-xs text-gray-400">{formatarDescricaoTipo(tipo)}</p>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="px-4 py-1 text-xs" 
                    onClick={() => gerarRelatorio(tipo)}
                    disabled={loading || !eventoSelecionado}
                  >
                    {loading ? 'Gerando...' : 'Gerar PDF'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center border-l border-white/10 pl-8">
              <div className="text-center">
                <svg className="w-32 h-32 text-brand-accent/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-sm text-gray-400 font-light">Selecione o evento e clique em Gerar PDF para compilar os dados direto do banco de dados.</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
