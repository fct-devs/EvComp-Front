import React from 'react';
import { Navbar } from '../../components/ui/Navbar';
import { Button, GlassCard, InputField } from '../../components/ui/Core';

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="PARTICIPANTE" />
      
      <main className="flex-1 w-full max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-extrabold text-white mb-8">Minha Conta</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
             <GlassCard className="flex flex-col items-center text-center p-6 bg-slate-800/80 border-white/5">
                <div className="w-24 h-24 bg-brand-accent/20 rounded-full flex items-center justify-center mb-4 border-2 border-brand-accent/50">
                  <span className="text-3xl font-bold text-white">GC</span>
                </div>
                <h2 className="text-xl font-bold text-white">Gabriel Ciriaco</h2>
                <p className="text-sm text-gray-400 mb-2">Aluno FCT UNESP</p>
                <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full border border-blue-800">Participante</span>
             </GlassCard>

             {/* Barra de progresso da imagem 5 */}
             <GlassCard className="mt-6 p-6 bg-slate-800/80 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Minha Presença na SECCOMP</h3>
                <div className="w-full bg-slate-700 rounded-full h-4 mb-2 overflow-hidden">
                  <div className="bg-emerald-500 h-4 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-right text-emerald-400 font-bold">45% Concluído</p>
             </GlassCard>
             
             <div className="mt-6">
                <Button variant="danger" className="w-full">Sair da Conta</Button>
             </div>
          </div>

          <div className="col-span-2">
             <GlassCard className="p-8 bg-slate-900/90 border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Informações Pessoais</h3>
                
                <form className="space-y-4">
                  <InputField label="Nome Completo" id="nome" type="text" defaultValue="Gabriel Ciriaco de Carvalho" />
                  <InputField label="Email" id="email" type="email" defaultValue="gabriel.ciriaco@unesp.br" />
                  <InputField label="RA / Identificação" id="ra" type="text" defaultValue="123456789" />
                  
                  <div className="pt-4 border-t border-white/10 mt-6">
                    <Button type="button" className="w-full">Salvar Alterações</Button>
                  </div>
                </form>
             </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
