import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/ui/Navbar';
import { GlassCard, Button } from '../../components/ui/Core';
import { buscarPerfilUsuario } from '../actions/auth';

export default async function DashboardPage() {
  const perfilRes = await buscarPerfilUsuario();
  
  let role = 'PARTICIPANTE';
  let isColetor = false;
  let userName = 'Participante';

  if (perfilRes.success && perfilRes.data) {
    if (perfilRes.data.role) role = perfilRes.data.role;
    if (perfilRes.data.isColetor !== undefined) {
      isColetor = perfilRes.data.isColetor === true || perfilRes.data.isColetor === 'true';
    }
    if (perfilRes.data.nome) userName = perfilRes.data.nome.split(' ')[0];
  }

  // Define se o usuário tem privilégios de coletor (role COLETOR explícita ou flag isColetor)
  const temModoColetor = role === 'COLETOR' || isColetor;

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role={role as any} />
      
      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Olá, {userName}!</h1>
        <p className="text-gray-400 mb-8">Bem-vindo(a) ao seu painel. O que deseja fazer hoje?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 bg-slate-800/80 border border-white/10 hover:border-brand-accent/50 transition-colors flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Explorar Eventos</h2>
              <p className="text-gray-400 text-sm mb-6">Descubra e inscreva-se nos próximos eventos da instituição.</p>
            </div>
            <Link href="/dashboard/eventos">
              <Button className="w-full">Ver Eventos</Button>
            </Link>
          </GlassCard>

          <GlassCard className="p-6 bg-slate-800/80 border border-white/10 hover:border-brand-accent/50 transition-colors flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Minhas Inscrições</h2>
              <p className="text-gray-400 text-sm mb-6">Acesse suas credenciais e os seus passaportes de entrada (QR Code).</p>
            </div>
            <Link href="/dashboard/minhas-inscricoes">
              <Button className="w-full" variant="secondary">Minhas Inscrições</Button>
            </Link>
          </GlassCard>

          <GlassCard className="p-6 bg-slate-800/80 border border-white/10 hover:border-brand-accent/50 transition-colors flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Meus Certificados</h2>
              <p className="text-gray-400 text-sm mb-6">Visualize e baixe os seus certificados de participação.</p>
            </div>
            <Link href="/dashboard/certificados">
              <Button className="w-full" variant="secondary">Ver Certificados</Button>
            </Link>
          </GlassCard>

          {temModoColetor && (
            <GlassCard className="p-6 bg-emerald-900/40 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors flex flex-col justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div>
                <h2 className="text-xl font-bold text-emerald-300 mb-2 flex items-center space-x-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
                  <span>Modo Coletor</span>
                </h2>
                <p className="text-emerald-100/70 text-sm mb-6">Acesse o scanner de QR Code para validar a entrada de participantes.</p>
              </div>
              <Link href="/coletor/scan">
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-full transition-colors shadow-lg shadow-emerald-900/50 mt-2">Iniciar Scanner</button>
              </Link>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}
