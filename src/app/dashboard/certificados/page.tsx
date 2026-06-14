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
  cargaHoraria: number;
  liberado: boolean;
  motivo?: string;
}

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<CertificadoInfo[]>([]);
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
          const response = await fetch(`http://localhost:8080/api/certificados/disponiveis/${perfil.data.id}`);
          if (response.ok) {
            const data = await response.json();
            setCertificados(data);
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

  const emitirCertificado = async (cert: CertificadoInfo) => {
    if (!participanteId) return;

    try {
      const response = await fetch('http://localhost:8080/api/certificados/emitir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participanteId: participanteId,
          tipo: cert.tipo,
          alvoId: cert.id
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        setDownloadError(errData.error || 'Erro ao gerar certificado.');
        setTimeout(() => setDownloadError(''), 5000);
        return;
      }

      // Download file from response blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      
      // Attempt to extract filename from Content-Disposition if present
      let filename = 'Certificado.pdf';
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('attachment')) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        } else {
            filename = disposition.split('filename=')[1]?.replace(/['"]/g, '') || filename;
        }
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

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 lg:p-12 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Meus Certificados</h1>
            <p className="text-gray-400">
              Visualize e emita os certificados dos eventos e atividades concluídas.
            </p>
          </div>
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
        ) : certificados.length === 0 ? (
          <GlassCard className="text-center py-20 text-gray-400">
            Você ainda não possui certificados disponíveis. Confirme sua presença em eventos para gerar certificados.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificados.map((cert, index) => (
              <GlassCard key={`${cert.tipo}-${cert.id}-${index}`} className="flex flex-col relative overflow-hidden group">

                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${cert.tipo === 'EVENTO' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-purple-500/20 text-purple-400'}`}>
                    {cert.tipo === 'EVENTO' ? 'GERAL' : 'ATIVIDADE'}
                  </span>
                  <span className="text-gray-400 text-sm">{cert.cargaHoraria} horas</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 flex-grow pr-8">{cert.titulo}</h3>
                
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                  {!cert.liberado ? (
                    <span className={`text-sm flex items-center gap-1 ${cert.motivo?.includes('Presença') || cert.motivo?.includes('Frequência') ? 'text-red-400' : 'text-yellow-500'}`}>
                      <AlertCircle size={16} /> {cert.motivo || 'Em Andamento'}
                    </span>
                  ) : (
                    <span className="text-sm text-green-400">Liberado</span>
                  )}
                  
                  {cert.liberado && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => emitirCertificado(cert)}
                    >
                      <Download size={16} />
                      Emitir PDF
                    </Button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
