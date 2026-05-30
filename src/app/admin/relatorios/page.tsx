import React from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';

export default function AdminRelatoriosPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="ADMIN" />
      
      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-extrabold text-white mb-2">Painel de Relatórios</h1>
        <p className="text-gray-400 mb-8">Audite os dados do evento e gere as listas de frequência finais.</p>

        <GlassCard className="bg-slate-900 border-white/5 p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h2 className="text-white font-bold text-lg border-b border-white/10 pb-2">Relatórios Disponíveis</h2>
                 
                 <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-white/5 hover:border-brand-accent transition-colors">
                    <div>
                       <p className="text-white font-semibold text-sm">Lista de Presença Assinada</p>
                       <p className="text-xs text-gray-400">PDF pronto para assinatura ou arquivo</p>
                    </div>
                    <Button variant="secondary" className="px-4 py-1 text-xs">Gerar</Button>
                 </div>

                 <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-white/5 hover:border-brand-accent transition-colors">
                    <div>
                       <p className="text-white font-semibold text-sm">Certificados Pendentes</p>
                       <p className="text-xs text-gray-400">Relação de participantes aprovados</p>
                    </div>
                    <Button variant="secondary" className="px-4 py-1 text-xs">Gerar</Button>
                 </div>

                 <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-white/5 hover:border-brand-accent transition-colors">
                    <div>
                       <p className="text-white font-semibold text-sm">Estatísticas do Evento</p>
                       <p className="text-xs text-gray-400">Gráficos de adesão e desistência</p>
                    </div>
                    <Button variant="secondary" className="px-4 py-1 text-xs">Gerar</Button>
                 </div>
              </div>

              <div className="flex items-center justify-center border-l border-white/10 pl-8">
                 <div className="text-center">
                    <svg className="w-32 h-32 text-brand-accent/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-sm text-gray-400 font-light">Selecione um relatório ao lado para compilar os dados do banco de dados.</p>
                 </div>
              </div>
           </div>
        </GlassCard>
      </main>
    </div>
  );
}
