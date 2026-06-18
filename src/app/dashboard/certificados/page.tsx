'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';
import { buscarPerfilUsuario } from '../../actions/auth';
import { Download, AlertCircle } from 'lucide-react';

interface CertificadoInfo {
  tipo: 'EVENTO' | 'ATIVIDADE';
  id: number;
  titulo: string;
  cargaHoraria?: number;
  eventoId?: number;
  eventoTitulo?: string;
  liberado?: boolean;
  motivo?: string;
  loadingStatus?: boolean;
}

export default function CertificadosPage() {
  const [eventos, setEventos] = useState<CertificadoInfo[]>([]);
  const [atividades, setAtividades] = useState<CertificadoInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'EVENTOS' | 'ATIVIDADES'>('EVENTOS');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [participanteId, setParticipanteId] = useState<number | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const perfil = await buscarPerfilUsuario();
        if (perfil && perfil.success && perfil.data) {
          setParticipanteId(perfil.data.id);
          const response = await fetch(`http://localhost:8080/api/certificados/disponiveis/${perfil.data.id}`, { credentials: 'include' });
          if (response.ok) {
            const data = await response.json();
            setEventos(data.eventos || []);
            setAtividades(data.atividades || []);
          } else {
            setError('Não foi possível carregar os certificados disponíveis.');
          }
        }
      } catch (err) {
        setError('Erro ao se conectar ao servidor.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const selecionarCertificado = async (certId: number, tipo: string, titulo: string) => {
    if (!participanteId) return;

    const setList = tipo === 'EVENTO' ? setEventos : setAtividades;

    setList(prev => prev.map(c => 
      (c.id === certId && c.titulo === titulo) ? { ...c, loadingStatus: true } : c
    ));

    try {
      const response = await fetch('http://localhost:8080/api/certificados/selecionar', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participanteId, tipo, alvoId: certId })
      });

      if (response.ok) {
        const data = await response.json();
        setList(prev => prev.map(c => 
          (c.id === certId && c.titulo === titulo) ? { ...c, liberado: data.liberado, motivo: data.motivo, loadingStatus: false } : c
        ));
      } else {
        setList(prev => prev.map(c => 
          (c.id === certId && c.titulo === titulo) ? { ...c, liberado: false, motivo: 'Erro ao validar', loadingStatus: false } : c
        ));
      }
    } catch (err) {
      setList(prev => prev.map(c => 
        (c.id === certId && c.titulo === titulo) ? { ...c, liberado: false, motivo: 'Erro de conexão', loadingStatus: false } : c
      ));
    }
  };

  const emitirCertificado = async (cert: CertificadoInfo) => {
    if (!participanteId) return;

    try {
      const response = await fetch('http://localhost:8080/api/certificados/emitir', { 
        credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participanteId, tipo: cert.tipo, alvoId: cert.id })
      });

      if (!response.ok) {
        const errData = await response.json();
        setDownloadError(errData.error || 'Erro ao gerar certificado.');
        setTimeout(() => setDownloadError(''), 5000);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      let filename = 'Certificado.pdf';
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('attachment')) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
        else filename = disposition.split('filename=')[1]?.replace(/['"]/g, '') || filename;
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
    } catch (err) {
      setDownloadError('Erro de conexão ao tentar emitir o certificado.');
      setTimeout(() => setDownloadError(''), 5000);
    }
  };

  const renderList = (list: CertificadoInfo[]) => {
    if (list.length === 0) {
      return (
        <GlassCard className="text-center py-20 text-gray-400">
          Nenhum certificado disponível nesta categoria.
        </GlassCard>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((cert) => (
          <GlassCard key={`${cert.tipo}-${cert.id}-${cert.titulo}`} className="p-6 flex flex-col hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cert.tipo === 'EVENTO' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-purple-500/20 text-purple-400'}`}>
                {cert.tipo === 'EVENTO' ? 'GERAL DO EVENTO' : 'ATIVIDADE ESPECÍFICA'}
              </span>
            </div>
            
            <h4 className="text-lg font-bold text-white mb-1">{cert.titulo}</h4>
            {cert.eventoTitulo && <p className="text-sm text-gray-400 mb-4">{cert.eventoTitulo}</p>}

            <div className="mt-auto pt-4 border-t border-white/10">
              {cert.liberado === undefined && !cert.loadingStatus ? (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full text-sm py-2"
                  onClick={() => selecionarCertificado(cert.id, cert.tipo, cert.titulo)}
                >
                  Verificar Disponibilidade
                </Button>
              ) : cert.loadingStatus ? (
                <div className="w-full text-center py-2 text-sm text-gray-400 animate-pulse bg-white/5 rounded">
                  Validando regras de negócio...
                </div>
              ) : cert.liberado ? (
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full text-sm py-2 flex items-center justify-center gap-2"
                  onClick={() => emitirCertificado(cert)}
                >
                  <Download size={16} /> Baixar PDF Oficial
                </Button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                  <AlertCircle size={16} /> <span className="truncate">{cert.motivo}</span>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 lg:p-12 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meus Certificados</h1>
          <p className="text-gray-400">
            Selecione a guia desejada para verificar e emitir seus certificados de Eventos ou Atividades.
          </p>
        </div>

        {downloadError && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-2 shadow-lg transition-all animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p>{downloadError}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Carregando seus certificados...</div>
        ) : error ? (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        ) : (
          <>
            <div className="flex gap-4 border-b border-white/10 mb-6">
              <button
                className={`pb-3 px-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'EVENTOS' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('EVENTOS')}
              >
                Certificados de Eventos
              </button>
              <button
                className={`pb-3 px-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'ATIVIDADES' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('ATIVIDADES')}
              >
                Certificados de Atividades
              </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'EVENTOS' ? renderList(eventos) : renderList(atividades)}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
