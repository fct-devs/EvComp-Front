import React from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';

export default function ColetorScanPage() {
  // --- MÉTODOS DA RegistrarPresencaUI (ASTAH) ---
  const exibirMensagemSucesso = () => alert("Presença registrada!");
  const exibirMensagemErro = () => alert("Falha ao registrar presença.");
  const selecionarAtividade = (atividadeId: string) => {}; // Lógica futura de seleção
  const exibirDadosAtividade = (dadosAtividade: any) => {};

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="COLETOR" />
      
      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Modo Coletor de Presença</h1>
          <p className="text-gray-400">Escaneie os passaportes digitais dos participantes na entrada do evento.</p>
        </div>

        <GlassCard className="w-full bg-slate-900/90 flex flex-col items-center p-12 relative overflow-hidden">
          {/* Câmera Mock Frame */}
          <div className="relative w-72 h-72 border-2 border-brand-accent/50 rounded-2xl bg-black/50 mb-8 flex items-center justify-center overflow-hidden">
            <div className="absolute w-full h-1 bg-brand-accent shadow-[0_0_10px_#3b82f6] animate-pulse" style={{ top: '50%' }}></div>
            
            {/* SVG Scanner */}
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M3 9h18M9 21V9"></path>
            </svg>
            <p className="absolute bottom-4 text-xs text-brand-accent font-bold tracking-widest">Aguardando QR Code...</p>
          </div>

          <div className="w-full flex justify-center space-x-4">
             <Button variant="primary">Ligar Câmera Frontal</Button>
             <Button variant="secondary">Digitar RA Manualmente</Button>
          </div>
        </GlassCard>

        <div className="w-full mt-8">
          <h2 className="text-white font-bold mb-4">Últimas Leituras</h2>
          <div className="space-y-2">
             <div className="bg-emerald-900/30 border border-emerald-500/50 p-4 rounded-lg flex justify-between items-center">
               <div>
                 <p className="text-white font-bold">João Silva</p>
                 <p className="text-xs text-gray-400">RA: 1827364</p>
               </div>
               <span className="text-emerald-400 font-bold text-sm bg-emerald-900 px-3 py-1 rounded-full">VALIDADO</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
