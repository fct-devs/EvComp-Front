'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import { buscarEventosDoColetor } from '../../actions/eventos';
import { ScannerComponent } from '../../../components/ui/ScannerComponent';

export default function ColetorScanPage() {
  const router = useRouter();
  
  // --- Estados de Seleção de Evento e Atividade ---
  const [atividades, setAtividades] = useState<any[]>([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<number | null>(null);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  // Estados do Scanner
  const [paused, setPaused] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [leituras, setLeituras] = useState<any[]>([]);
  
  // Entrada Manual
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualPin, setManualPin] = useState('');

  // --- MÉTODOS DA RegistrarPresencaUI (ASTAH) ---
  const exibirMensagemSucesso = () => alert("Presença registrada!");
  const exibirMensagemErro = () => alert("Falha ao registrar presença.");
  const selecionarAtividade = (atividadeId: string) => {}; 
  const exibirDadosAtividade = (dadosAtividade: any) => {};

  const handleScan = async (decodedText: string) => {
    try {
      const payload = JSON.parse(decodedText);
      if (!payload.a || !payload.p || !payload.t) throw new Error("Formato inválido");

      if (payload.a !== atividadeSelecionada) {
        setScanFeedback({ type: 'error', message: 'Ingresso inválido para esta atividade!' });
        setPaused(true);
        setTimeout(() => { setPaused(false); setScanFeedback(null); }, 3000);
        return;
      }

      setPaused(true);
      setScanFeedback(null); // Clear previous feedback while loading

      const res = await fetch('/api/presencas/registrar', { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atividadeId: atividadeSelecionada,
          codigoParticipante: decodedText,
          timestampLido: Date.now()
        })
      });

      const result = await res.json();
      
      if (res.ok) {
        setScanFeedback({ type: 'success', message: result.message || 'Presença registrada com sucesso!' });
        // Adiciona à lista de últimas leituras
        setLeituras(prev => [{
          id: Date.now(),
          texto: result.message || 'Presença Validada',
          status: 'VALIDADO'
        }, ...prev].slice(0, 5));
      } else {
        setScanFeedback({ type: 'error', message: result.error || 'Erro ao registrar presença.' });
      }
    } catch (e) {
      setScanFeedback({ type: 'error', message: 'QR Code inválido ou não reconhecido.' });
      setPaused(true);
    }

    setTimeout(() => {
      setPaused(false);
      setScanFeedback(null);
    }, 3000);
  };

  const handleManualSubmit = async () => {
    if (!manualPin || manualPin.length !== 6) {
      setScanFeedback({ type: 'error', message: 'O PIN deve conter exatamente 6 dígitos.' });
      return;
    }

    setPaused(true);
    setScanFeedback(null);
    setShowManualInput(false);

    try {
      const res = await fetch('/api/presencas/registrar', { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atividadeId: atividadeSelecionada,
          codigoParticipante: manualPin,
          timestampLido: Date.now()
        })
      });

      const result = await res.json();
      
      if (res.ok) {
        setScanFeedback({ type: 'success', message: result.message || 'Presença registrada com sucesso!' });
        setLeituras(prev => [{
          id: Date.now(),
          texto: result.message || 'Presença Validada',
          status: 'VALIDADO'
        }, ...prev].slice(0, 5));
      } else {
        setScanFeedback({ type: 'error', message: result.error || 'Erro ao registrar presença.' });
      }
    } catch (e) {
      setScanFeedback({ type: 'error', message: 'Erro de conexão.' });
    }

    setManualPin('');
    setTimeout(() => {
      setPaused(false);
      setScanFeedback(null);
    }, 3000);
  };

  useEffect(() => {
    async function fetchAtividadesAtivas() {
      try {
        const response = await fetch('/api/atividades/ativas-coletor', { credentials: 'include' });
        
        if (response.status === 401 || response.status === 403) {
          return router.push('/login');
        }

        if (response.ok) {
          const data = await response.json();
          setAtividades(data);
        } else {
          setError('Não foi possível carregar as atividades. Verifique suas permissões.');
        }
      } catch (err) {
        setError('Erro de conexão ao carregar atividades.');
      } finally {
        setLoading(false);
      }
    }
    fetchAtividadesAtivas();
  }, [router]);

  const handleSelecionarAtividade = async (atividadeId: number) => {
    setError('');
    setSuccessMsg('');
    setValidating(true);
    
    try {
      const res = await fetch(`/api/atividades/${atividadeId}/selecionar`, { credentials: 'include' });
      if (res.ok) {
        setAtividadeSelecionada(atividadeId);
        setSuccessMsg('Atividade selecionada com sucesso! Você já pode registrar as presenças.');
      } else {
        const data = await res.json();
        setError(data.error || 'Atividade fora do período válido para registro de presença.');
        setAtividadeSelecionada(null);
      }
    } catch (err) {
      setError('Erro de conexão ao validar atividade.');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="COLETOR" />
      
      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Modo Coletor de Presença</h1>
          <p className="text-gray-400">Primeiro, selecione o Evento e a Atividade que deseja registrar presenças.</p>
        </div>

        <GlassCard className="w-full bg-slate-900/90 flex flex-col items-center p-8 relative overflow-hidden mb-8">
          
          {loading ? (
            <p className="text-center text-gray-400">Carregando eventos autorizados...</p>
          ) : (
            <div className="w-full space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Atividade (de Eventos Ativos):</label>
                <select 
                  className="w-full p-3 bg-slate-800 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent text-white transition-all hover:bg-slate-700"
                  onChange={(e) => handleSelecionarAtividade(Number(e.target.value))}
                  defaultValue=""
                  disabled={validating}
                >
                  <option value="" disabled>-- Selecione a Atividade --</option>
                  {atividades.map((atv) => (
                    <option key={atv.id} value={atv.id}>{atv.titulo} ({atv.evento?.titulo})</option>
                  ))}
                </select>
                {atividades.length === 0 && !loading && (
                  <p className="text-sm text-red-400 mt-2">Você não possui atividades rolando no momento.</p>
                )}
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm mt-4 text-center">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded text-sm mt-4 text-center font-semibold tracking-wide">
                  {successMsg}
                </div>
              )}

            </div>
          )}
        </GlassCard>

        {atividadeSelecionada && successMsg && (
          <GlassCard className="w-full bg-slate-900/90 flex flex-col items-center p-12 relative overflow-hidden animate-in fade-in zoom-in duration-500">
            
            {/* Componente Real de Scanner */}
            <ScannerComponent onScan={handleScan} paused={paused} />

            {/* Feedback Visual do Scanner */}
            {scanFeedback && (
              <div className={`mt-6 w-full max-w-sm p-4 rounded-xl border ${scanFeedback.type === 'success' ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200' : 'bg-red-900/40 border-red-500 text-red-200'} text-center font-bold text-lg shadow-xl transition-all`}>
                {scanFeedback.message}
              </div>
            )}

            <div className="w-full flex flex-col items-center mt-8 space-y-4">
              {!showManualInput ? (
                <Button variant="secondary" onClick={() => setShowManualInput(true)}>
                  Digitar PIN Manualmente
                </Button>
              ) : (
                <div className="flex items-center space-x-2 bg-slate-800 p-2 rounded-lg border border-brand-accent/50 shadow-inner">
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="000000"
                    value={manualPin}
                    onChange={(e) => setManualPin(e.target.value.replace(/\D/g, ''))}
                    className="bg-transparent text-white font-mono text-center tracking-widest text-2xl w-36 focus:outline-none placeholder-gray-600"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button variant="primary" onClick={handleManualSubmit}>OK</Button>
                    <Button variant="secondary" onClick={() => setShowManualInput(false)}>X</Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Últimas Leituras */}
            <div className="w-full mt-10">
              <h2 className="text-brand-accent font-bold mb-4 uppercase tracking-wider text-sm border-b border-white/10 pb-2">Últimas Leituras</h2>
              <div className="space-y-3">
                {leituras.length === 0 && <p className="text-gray-500 text-sm text-center">Nenhuma leitura realizada ainda.</p>}
                {leituras.map(l => (
                  <div key={l.id} className="bg-emerald-900/30 border border-emerald-500/50 p-4 rounded-lg flex justify-between items-center transition-all hover:bg-emerald-900/50">
                    <div>
                      <p className="text-white font-bold">{l.texto}</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">{l.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

      </main>
    </div>
  );
}
