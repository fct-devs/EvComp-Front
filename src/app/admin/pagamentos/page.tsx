'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import { Pagamento, PagamentoPendente, ESTILO_STATUS } from '../../../utils/pagamento';
import { formatarBRL, formatarDataHora } from '../../../utils/formatadores';
import { Eye } from 'lucide-react';

interface Evento {
  id: number;
  titulo: string;
  valorInscricao: number | null;
}

export default function AdminPagamentosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<string>('');
  const [pagamentos, setPagamentos] = useState<PagamentoPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  const [avaliandoId, setAvaliandoId] = useState<number | null>(null);

  const [modalComprovante, setModalComprovante] = useState<{ objectUrl: string; tipoArquivo: string } | null>(null);
  const [carregandoComprovante, setCarregandoComprovante] = useState<number | null>(null);
  const [modalRecusa, setModalRecusa] = useState<PagamentoPendente | null>(null);
  const [motivoRecusa, setMotivoRecusa] = useState('');

  useEffect(() => {
    fetch('/api/eventos', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch(() => setError('Erro ao buscar a lista de eventos.'));
  }, []);

  useEffect(() => {
    carregarPagamentos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventoSelecionado]);

  const exibirMensagem = (texto: string, tipo: 'success' | 'error') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 5000);
  };

  async function carregarPagamentos() {
    setLoading(true);
    setError('');
    try {
      const url = eventoSelecionado
        ? `/api/pagamentos/evento/${eventoSelecionado}`
        : '/api/pagamentos/pendentes';
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Falha ao carregar os pagamentos.');
      const data = await res.json();
      setPagamentos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  const abrirComprovante = async (pagamento: Pagamento) => {
    if (!pagamento.urlComprovante) return;
    setCarregandoComprovante(pagamento.id);
    try {
      const res = await fetch(pagamento.urlComprovante, { credentials: 'include' });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Não foi possível carregar o comprovante.');
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setModalComprovante({ objectUrl, tipoArquivo: pagamento.tipoArquivo || blob.type });
    } catch (err: unknown) {
      exibirMensagem(err instanceof Error ? err.message : 'Erro ao carregar o comprovante.', 'error');
    } finally {
      setCarregandoComprovante(null);
    }
  };

  const fecharComprovante = () => {
    if (modalComprovante) URL.revokeObjectURL(modalComprovante.objectUrl);
    setModalComprovante(null);
  };

  const avaliar = async (pagamento: PagamentoPendente, novoStatus: 'APROVADO' | 'RECUSADO', motivo?: string) => {
    setAvaliandoId(pagamento.id);
    try {
      const res = await fetch(`/api/pagamentos/${pagamento.id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novoStatus, motivoRecusa: motivo || null }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        exibirMensagem(errData?.error || 'Erro ao avaliar o pagamento.', 'error');
        carregarPagamentos();
        return;
      }

      const atualizado: PagamentoPendente = await res.json();

      if (!eventoSelecionado) {
        setPagamentos((atual) => atual.filter((p) => p.id !== atualizado.id));
      } else {
        setPagamentos((atual) => atual.map((p) => (p.id === atualizado.id ? atualizado : p)));
      }

      exibirMensagem(novoStatus === 'APROVADO' ? 'Pagamento aprovado.' : 'Pagamento recusado.', 'success');
    } catch {
      exibirMensagem('Erro de conexão ao avaliar o pagamento.', 'error');
    } finally {
      setAvaliandoId(null);
    }
  };

  const confirmarRecusa = () => {
    if (!modalRecusa) return;
    avaliar(modalRecusa, 'RECUSADO', motivoRecusa.trim() || undefined);
    setModalRecusa(null);
    setMotivoRecusa('');
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-extrabold text-white mb-2">Pagamentos</h1>
        <p className="text-gray-400 mb-8">Confira os comprovantes enviados e aprove ou recuse cada pagamento.</p>

        {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-md text-sm">{error}</div>}

        {mensagem && (
          <div className={`mb-6 p-4 rounded-md text-sm font-semibold ${mensagem.tipo === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
            {mensagem.texto}
          </div>
        )}

        <GlassCard className="bg-slate-900 border-white/5 p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Filtrar por evento:</label>
            <select
              className="w-full md:w-1/2 p-2 rounded bg-slate-800 text-white border border-white/10"
              value={eventoSelecionado}
              onChange={(e) => setEventoSelecionado(e.target.value)}
            >
              <option value="">-- Fila de conferência (pendentes) --</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.titulo} — {ev.valorInscricao != null && Number(ev.valorInscricao) > 0 ? formatarBRL(ev.valorInscricao) : 'Gratuito'}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Carregando pagamentos...</div>
          ) : pagamentos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {eventoSelecionado ? 'Nenhum pagamento encontrado para este evento.' : 'Nenhum comprovante pendente de conferência.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white">
                <thead>
                  <tr className="border-b border-white/20 text-sm">
                    <th className="py-3 px-4">Participante</th>
                    <th className="py-3 px-4">Evento</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4">Enviado em</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Comprovante</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.map((pagamento) => {
                    const estilo = ESTILO_STATUS[pagamento.status];
                    const avaliando = avaliandoId === pagamento.id;
                    const podeAvaliar = pagamento.temComprovante && pagamento.status === 'PENDENTE';

                    return (
                      <tr key={pagamento.id} className="border-b border-white/10 hover:bg-white/5 transition-colors text-sm">
                        <td className="py-3 px-4">
                          <p className="font-semibold">{pagamento.nomeParticipante}</p>
                          <p className="text-xs text-gray-400">{pagamento.emailParticipante}</p>
                        </td>
                        <td className="py-3 px-4">{pagamento.tituloEvento}</td>
                        <td className="py-3 px-4">{formatarBRL(pagamento.valorInscricao)}</td>
                        <td className="py-3 px-4">{formatarDataHora(pagamento.dataEnvio)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${estilo.classe}`}>
                            {estilo.rotulo}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {pagamento.temComprovante ? (
                            <button
                              type="button"
                              onClick={() => abrirComprovante(pagamento)}
                              disabled={carregandoComprovante === pagamento.id}
                              className="flex items-center gap-1 text-brand-accent hover:underline disabled:opacity-50"
                            >
                              <Eye size={14} />
                              {carregandoComprovante === pagamento.id ? 'Carregando...' : 'Ver'}
                            </button>
                          ) : (
                            <span className="text-gray-500 text-xs">Sem comprovante</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                          <Button
                            variant="secondary"
                            className="px-3 py-1 text-xs"
                            disabled={!podeAvaliar || avaliando}
                            onClick={() => avaliar(pagamento, 'APROVADO')}
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="danger"
                            className="px-3 py-1 text-xs"
                            disabled={!podeAvaliar || avaliando}
                            onClick={() => { setModalRecusa(pagamento); setMotivoRecusa(''); }}
                          >
                            Recusar
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </main>

      {modalComprovante && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={fecharComprovante}>
          <div className="max-w-3xl w-full max-h-[85vh] bg-slate-900 rounded-2xl p-4 border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Comprovante</h3>
              <Button variant="secondary" className="px-3 py-1 text-xs" onClick={fecharComprovante}>Fechar</Button>
            </div>
            {modalComprovante.tipoArquivo.startsWith('image/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={modalComprovante.objectUrl} alt="Comprovante de pagamento" className="max-w-full max-h-[70vh] mx-auto rounded-lg" />
            ) : (
              <iframe src={modalComprovante.objectUrl} title="Comprovante de pagamento" className="w-full h-[70vh] rounded-lg bg-white" />
            )}
          </div>
        </div>
      )}

      {modalRecusa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-4">Recusar comprovante</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Informe o motivo da recusa para {modalRecusa.nomeParticipante} poder reenviar o comprovante corretamente.
            </p>
            <textarea
              className="w-full p-3 rounded bg-slate-800 text-white border border-white/10 mb-2 resize-none"
              rows={3}
              maxLength={255}
              value={motivoRecusa}
              onChange={(e) => setMotivoRecusa(e.target.value)}
              placeholder="Ex.: comprovante ilegível, valor divergente..."
            />
            <p className="text-xs text-gray-500 mb-6">{motivoRecusa.length}/255</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModalRecusa(null)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmarRecusa} disabled={!motivoRecusa.trim()}>
                Confirmar Recusa
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
