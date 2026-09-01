'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../actions/auth';
import { Pagamento, ESTILO_STATUS } from '../../../utils/pagamento';
import { formatarBRL, formatarDataHora } from '../../../utils/formatadores';
import { comprimirParaWebP, TAMANHO_MAXIMO_BYTES, TIPOS_IMAGEM_ACEITOS, TIPOS_ACEITOS } from '../../../utils/comprimirImagem';
import { Copy, Upload, CheckCircle2, XCircle, Clock } from 'lucide-react';

const TAMANHO_MAXIMO_PDF_BYTES = 1024 * 1024; // 1 MB

export default function PagamentosPage() {
  const router = useRouter();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  const [enviandoId, setEnviandoId] = useState<number | null>(null);
  const [statusEnvio, setStatusEnvio] = useState<string>('');
  const [pixCopiado, setPixCopiado] = useState<number | null>(null);
  const inputsRef = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    async function carregarDados() {
      try {
        const perfilRes = await buscarPerfilUsuario();
        if (!perfilRes.success) {
          router.push('/login');
          return;
        }

        const res = await fetch(`/api/pagamentos/minhas?participanteId=${perfilRes.data.id}`, { credentials: 'include' });
        if (!res.ok) {
          throw new Error('Falha ao carregar seus pagamentos.');
        }

        const data = await res.json();
        setPagamentos(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [router]);

  const exibirMensagem = (texto: string, tipo: 'success' | 'error') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 5000);
  };

  const copiarPix = async (pagamento: Pagamento) => {
    if (!pagamento.chavePix) return;
    try {
      await navigator.clipboard.writeText(pagamento.chavePix);
      setPixCopiado(pagamento.id);
      setTimeout(() => setPixCopiado(null), 2000);
    } catch {
      exibirMensagem('Não foi possível copiar a chave PIX.', 'error');
    }
  };

  const escolherArquivo = (pagamento: Pagamento) => {
    inputsRef.current[pagamento.id]?.click();
  };

  const enviarArquivo = async (pagamento: Pagamento, arquivo: File | undefined) => {
    if (!arquivo) return;

    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      exibirMensagem('Formato inválido. Envie uma imagem (JPEG, PNG ou WebP) ou um PDF.', 'error');
      return;
    }

    setEnviandoId(pagamento.id);
    setError('');

    try {
      let arquivoFinal = arquivo;

      if (arquivo.type === 'application/pdf') {
        if (arquivo.size > TAMANHO_MAXIMO_PDF_BYTES) {
          exibirMensagem('O PDF excede o tamanho máximo de 1 MB.', 'error');
          return;
        }
      } else if (TIPOS_IMAGEM_ACEITOS.includes(arquivo.type)) {
        setStatusEnvio('Comprimindo imagem...');
        arquivoFinal = await comprimirParaWebP(arquivo);
      }

      setStatusEnvio('Enviando comprovante...');

      const dados = new FormData();
      dados.append('arquivo', arquivoFinal, arquivoFinal.name);

      const res = await fetch(`/api/pagamentos/${pagamento.inscricaoId}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: dados,
      });

      if (!res.ok) {
        let mensagemErro = 'Erro ao enviar o comprovante.';
        try {
          const errData = await res.json();
          mensagemErro = errData.error || mensagemErro;
        } catch {
          if (res.status === 413) mensagemErro = 'O arquivo enviado excede o tamanho máximo de 1 MB.';
        }
        exibirMensagem(mensagemErro, 'error');
        return;
      }

      const atualizado: Pagamento = await res.json();
      setPagamentos((atual) => atual.map((p) => (p.id === atualizado.id ? atualizado : p)));
      exibirMensagem('Comprovante enviado com sucesso! Aguarde a análise do administrador.', 'success');
    } catch (err: unknown) {
      exibirMensagem(err instanceof Error ? err.message : 'Erro ao processar o arquivo.', 'error');
    } finally {
      setEnviandoId(null);
      setStatusEnvio('');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white font-bold text-xl">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="PARTICIPANTE" />

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">Pagamentos</h1>
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>Voltar</Button>
        </div>

        {error && <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">{error}</div>}

        {mensagem && (
          <div className={`p-4 mb-6 rounded-lg font-semibold ${mensagem.tipo === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
            {mensagem.texto}
          </div>
        )}

        {pagamentos.length === 0 && !error ? (
          <GlassCard className="p-8 text-center bg-slate-800/80 border border-white/10">
            <h2 className="text-xl font-bold text-gray-300 mb-4">Você ainda não possui inscrições com pagamento a acompanhar.</h2>
            <Button onClick={() => router.push('/dashboard/eventos')}>Explorar Eventos</Button>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {pagamentos.map((pagamento) => {
              const estilo = ESTILO_STATUS[pagamento.status];
              const enviando = enviandoId === pagamento.id;

              // Verifica se o evento já iniciou usando a flag enviada pelo backend
              const eventoIniciado = (() => {
                if ((pagamento as any).eventoIniciado === true) return true;
                if (!pagamento.dataInicioEvento) return false;
                try {
                  const p = String(pagamento.dataInicioEvento).split('T')[0].split('-');
                  if (p.length < 3) return false;
                  const dInicio = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]), 0, 0, 0);
                  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
                  return hoje >= dInicio;
                } catch { return false; }
              })();

              const podeEnviar = (pagamento.status === 'PENDENTE' || pagamento.status === 'RECUSADO') && !eventoIniciado;

              return (
                <GlassCard key={pagamento.id} className="p-6 bg-slate-800/80 border border-white/10 shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-4">
                    <h2 className="text-xl font-bold text-brand-accent">{pagamento.tituloEvento}</h2>
                    <span className={`mt-3 md:mt-0 px-3 py-1 rounded-full text-xs font-bold border ${
                      eventoIniciado && pagamento.status !== 'APROVADO' && pagamento.status !== 'ISENTO'
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : estilo.classe
                    }`}>
                      {eventoIniciado && pagamento.status !== 'APROVADO' && pagamento.status !== 'ISENTO'
                        ? 'PAGAMENTO EXPIRADO'
                        : estilo.rotulo}
                    </span>
                  </div>

                  {pagamento.status === 'ISENTO' && (
                    <p className="text-gray-300">Este evento não possui cobrança de inscrição.</p>
                  )}

                  {pagamento.status !== 'ISENTO' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {pagamento.modalidadeNome && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Modalidade</p>
                            <p className="text-white font-semibold text-lg">{pagamento.modalidadeNome}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Valor da inscrição</p>
                          <p className="text-white font-semibold text-lg">{formatarBRL(pagamento.valorInscricao)}</p>
                        </div>
                        {pagamento.chavePix && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Chave PIX</p>
                            <div className="flex items-center gap-2">
                              <code className="text-white bg-slate-900/60 px-2 py-1 rounded text-sm break-all">{pagamento.chavePix}</code>
                              <button
                                type="button"
                                onClick={() => copiarPix(pagamento)}
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="Copiar chave PIX"
                              >
                                <Copy size={16} />
                              </button>
                              {pixCopiado === pagamento.id && <span className="text-xs text-green-400">Copiado!</span>}
                            </div>
                          </div>
                        )}
                      </div>

                      {pagamento.status === 'PENDENTE' && pagamento.temComprovante && (
                        <div className="flex items-center gap-2 text-yellow-400 text-sm mb-4">
                          <Clock size={16} />
                          <span>Comprovante em análise — enviado {formatarDataHora(pagamento.dataEnvio)} ({pagamento.nomeArquivoOriginal})</span>
                        </div>
                      )}

                      {pagamento.status === 'APROVADO' && (
                        <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                          <CheckCircle2 size={16} />
                          <span>Pagamento aprovado em {formatarDataHora(pagamento.dataAvaliacao)}</span>
                        </div>
                      )}

                      {pagamento.status === 'RECUSADO' && (
                        <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
                            <XCircle size={16} />
                            <span>Comprovante recusado</span>
                          </div>
                          {pagamento.motivoRecusa && <p className="text-gray-300 text-sm">Motivo: {pagamento.motivoRecusa}</p>}
                        </div>
                      )}

                      {eventoIniciado && pagamento.status !== 'APROVADO' && (
                        <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center gap-2">
                          <XCircle size={16} className="shrink-0" />
                          <span>O evento já foi iniciado. O prazo para envio de comprovantes ou regularização de pagamento está encerrado.</span>
                        </div>
                      )}

                      {podeEnviar && (
                        <div>
                          <input
                            ref={(el) => { inputsRef.current[pagamento.id] = el; }}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            className="hidden"
                            onChange={(e) => enviarArquivo(pagamento, e.target.files?.[0])}
                          />
                          <Button
                            variant="secondary"
                            onClick={() => escolherArquivo(pagamento)}
                            disabled={enviando}
                            className="flex items-center gap-2"
                          >
                            <Upload size={16} />
                            {enviando ? statusEnvio || 'Enviando...' : pagamento.temComprovante ? 'Enviar outro comprovante' : 'Enviar comprovante'}
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            Imagens (JPEG, PNG, WebP) até {Math.round(TAMANHO_MAXIMO_BYTES / 1024)} KB após compressão automática, ou PDF até 1 MB.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
