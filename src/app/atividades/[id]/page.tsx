import React from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { Button, GlassCard } from '../../../components/ui/Core';
import { selecionarAtividade } from '../../actions/eventos';

// SVG genérico simulando um QR Code
const QRCodeMock = () => (
  <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-slate-900 mx-auto">
    <rect width="100" height="100" fill="white" />
    <path d="M10 10H40V40H10V10ZM20 20V30H30V20H20Z" fill="currentColor"/>
    <path d="M60 10H90V40H60V10ZM70 20V30H80V20H70Z" fill="currentColor"/>
    <path d="M10 60H40V90H10V60ZM20 70V80H30V70H20Z" fill="currentColor"/>
    <path d="M60 60H70V70H60V60Z" fill="currentColor"/>
    <path d="M80 60H90V70H80V60Z" fill="currentColor"/>
    <path d="M60 80H70V90H60V80Z" fill="currentColor"/>
    <path d="M80 80H90V90H80V80Z" fill="currentColor"/>
    <path d="M70 70H80V80H70V70Z" fill="currentColor"/>
    <path d="M50 10H60V20H50V10Z" fill="currentColor"/>
    <path d="M50 30H60V50H50V30Z" fill="currentColor"/>
    <path d="M50 60H60V90H50V60Z" fill="currentColor"/>
    <path d="M10 50H40V60H10V50Z" fill="currentColor"/>
    <path d="M70 50H100V60H70V50Z" fill="currentColor"/>
  </svg>
);

export default async function AtividadeDetalhesPage({ params }: { params: { id: string } }) {
  // --- MÉTODOS DA InscricaoUI (ASTAH) ---
  const response = await selecionarAtividade(params.id);
  const atividade = response.success && response.data ? response.data : {
    id: params.id,
    titulo: 'Atividade não encontrada ou backend offline',
    ministrante: 'Desconhecido',
    status: 'Pendente',
  };

  const exibirDadosEventoEAtividades = () => atividade;
  const dados = exibirDadosEventoEAtividades();

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      {/* Background Decorativo da Instituição */}
      <div className="absolute inset-0 z-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0A192F 100%)'
      }}></div>

      <Navbar role="PARTICIPANTE" />
      
      <main className="flex-1 w-full max-w-4xl mx-auto py-16 px-6 relative z-10 flex items-center justify-center">
        <GlassCard className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 flex flex-col items-center text-center">
          
          <div className="mb-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
            {dados.status?.toUpperCase() || 'INSCRITO'}
          </div>
          
          <h1 className="text-3xl font-extrabold text-white mb-2">{dados.titulo}</h1>
          <p className="text-gray-300 mb-8">{dados.ministrante}</p>
          
          <div className="bg-white p-6 rounded-xl shadow-lg relative border-4 border-slate-100">
            {/* Decorações do QR Code estilo wireframe */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-accent -translate-x-2 -translate-y-2 rounded-tl-sm"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-accent translate-x-2 -translate-y-2 rounded-tr-sm"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-accent -translate-x-2 translate-y-2 rounded-bl-sm"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-accent translate-x-2 translate-y-2 rounded-br-sm"></div>
            
            <QRCodeMock />
          </div>

          <div className="mt-8 space-y-2">
            <h2 className="text-xl font-bold text-white">Seu Passaporte Digital</h2>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Utilize este QR Code exclusivamente para registrar sua presença nesta atividade. Apresente-o ao coletor na entrada do local.
            </p>
          </div>

          <div className="mt-10 w-full flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
             <Button variant="secondary" className="w-full">Voltar aos Eventos</Button>
             <Button variant="danger" className="w-full">Cancelar Inscrição</Button>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
