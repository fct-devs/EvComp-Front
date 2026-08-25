'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/ui/Navbar';
import { GlassCard, Button } from '../../components/ui/Core';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      <Navbar role="ADMIN" />

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-white mb-8">Painel do Administrador</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 bg-slate-800/80 border border-white/10 hover:border-brand-accent/50 transition-colors">
            <h2 className="text-xl font-bold text-white mb-4">Eventos</h2>
            <p className="text-gray-400 text-sm mb-6">Crie e gerencie os eventos da instituição.</p>
            <div className="space-y-3">
              <Link href="/admin/eventos/criar"><Button className="w-full">Novo Evento</Button></Link>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-slate-800/80 border border-white/10 hover:border-brand-accent/50 transition-colors">
            <h2 className="text-xl font-bold text-white mb-4">Atividades</h2>
            <p className="text-gray-400 text-sm mb-6">Vincule minicursos e palestras aos eventos.</p>
            <div className="space-y-3">
              <Link href="/admin/eventos"><Button className="w-full" variant="secondary">Nova Atividade</Button></Link>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-slate-800/80 border border-white/10 hover:border-brand-accent/50 transition-colors">
            <h2 className="text-xl font-bold text-white mb-4">Coletores</h2>
            <p className="text-gray-400 text-sm mb-6">Gerencie quem pode validar os passaportes.</p>
            <div className="space-y-3">
              <Link href="/admin/coletores"><Button className="w-full" variant="secondary">Gerir Coletores</Button></Link>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-slate-800/80 border border-white/10 hover:border-brand-accent/50 transition-colors">
            <h2 className="text-xl font-bold text-white mb-4">Pagamentos</h2>
            <p className="text-gray-400 text-sm mb-6">Confira comprovantes de PIX e aprove ou recuse inscrições.</p>
            <div className="space-y-3">
              <Link href="/admin/pagamentos"><Button className="w-full" variant="secondary">Ver Pagamentos</Button></Link>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
