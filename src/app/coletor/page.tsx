'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/ui/Navbar';

export default function ColetorPage() {
  const router = useRouter();
  const [eventos, setEventos] = useState<any[]>([]);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<number | null>(null);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<number | null>(null);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
        if (!token) return router.push('/login');

        const res = await fetch('http://localhost:8080/api/eventos/coletor', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setEventos(data);
        } else {
          setError('Não foi possível carregar os eventos. Verifique suas permissões.');
        }
      } catch (err) {
        setError('Erro de conexão ao carregar eventos.');
      } finally {
        setLoading(false);
      }
    }
    fetchEventos();
  }, [router]);

  useEffect(() => {
    if (eventoSelecionado) {
      async function fetchAtividades() {
        try {
          const res = await fetch('http://localhost:8080/api/atividades');
          if (res.ok) {
            const data = await res.json();
            const atividadesDoEvento = data.filter((a: any) => a.evento && a.evento.id === eventoSelecionado);
            setAtividades(atividadesDoEvento);
          }
        } catch (err) {
          console.error(err);
        }
      }
      fetchAtividades();
    } else {
      setAtividades([]);
      setAtividadeSelecionada(null);
    }
  }, [eventoSelecionado]);

  const handleSelecionarAtividade = async (atividadeId: number) => {
    setError('');
    setSuccessMsg('');
    setValidating(true);
    
    try {
      const res = await fetch(`http://localhost:8080/api/atividades/${atividadeId}/selecionar`);
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
    <div className="flex flex-col min-h-screen bg-brand-dark text-white font-sans">
      <Navbar role="COLETOR" />
      <main className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col items-center justify-center">
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-full border border-white/10">
          <h2 className="text-3xl font-bold text-center text-brand-accent mb-6">
            Painel do Coletor de Presença
          </h2>

          {loading ? (
            <p className="text-center text-gray-400">Carregando eventos autorizados...</p>
          ) : (
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Selecione o Evento Ativo:</label>
                <select 
                  className="w-full p-3 bg-slate-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent text-white"
                  onChange={(e) => setEventoSelecionado(Number(e.target.value) || null)}
                  defaultValue=""
                >
                  <option value="" disabled>-- Selecione --</option>
                  {eventos.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.titulo}</option>
                  ))}
                </select>
                {eventos.length === 0 && !loading && (
                  <p className="text-sm text-red-400 mt-2">Você não possui eventos ativos para coleta no momento.</p>
                )}
              </div>

              {eventoSelecionado && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Selecione a Atividade:</label>
                  <select 
                    className="w-full p-3 bg-slate-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent text-white"
                    onChange={(e) => handleSelecionarAtividade(Number(e.target.value))}
                    defaultValue=""
                    disabled={validating}
                  >
                    <option value="" disabled>-- Selecione --</option>
                    {atividades.map((atv) => (
                      <option key={atv.id} value={atv.id}>{atv.titulo}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm mt-4">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded text-sm mt-4">
                  {successMsg}
                </div>
              )}

              {atividadeSelecionada && successMsg && (
                <div className="mt-8 p-6 border-2 border-dashed border-brand-accent/50 rounded-lg text-center bg-brand-accent/10">
                  <h3 className="text-lg font-semibold text-brand-accent mb-4">Leitor de QR Code</h3>
                  <div className="w-48 h-48 bg-slate-900 mx-auto flex items-center justify-center rounded-md mb-4 shadow-inner border border-white/10">
                    <span className="text-gray-500 text-sm">Câmera indisponível<br/>(Simulação)</span>
                  </div>
                  <p className="text-sm text-gray-400">Aponte a câmera para o QR Code do participante para registrar a presença.</p>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
