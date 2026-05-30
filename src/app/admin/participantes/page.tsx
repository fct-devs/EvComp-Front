import React from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';

export default function AdminParticipantesPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="ADMIN" />
      
      <main className="flex-1 w-full max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-extrabold text-white mb-2">Participantes & Coletores</h1>
        <p className="text-gray-400 mb-8">Gerencie permissões, delegue coletores e exporte dados.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="bg-slate-900 border-white/5 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Atribuir Coletor de Presença</h2>
            <div className="space-y-4">
               <input type="text" placeholder="Buscar por RA ou Email" className="w-full bg-slate-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent" />
               <Button className="w-full">Tornar Coletor</Button>
            </div>
          </GlassCard>

          <GlassCard className="bg-slate-900 border-white/5 p-6 flex flex-col items-center justify-center text-center">
            {/* SVG Placeholder for Reports */}
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400 mb-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">Relatórios Gerenciais</h2>
            <p className="text-sm text-gray-400 mb-6">Exporte PDFs com métricas de participação, total de alunos internos/externos e adesão de atividades.</p>
            <Button variant="secondary" className="w-full border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900">
              Gerar Relatório de Evento
            </Button>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
