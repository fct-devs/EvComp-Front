import React from 'react';
import { Navbar } from '../../../components/ui/Navbar';
import { GlassCard, Button } from '../../../components/ui/Core';

export default function AdminEventosPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="ADMIN" />
      
      <main className="flex-1 w-full max-w-6xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Gestão de Eventos</h1>
          <Button variant="primary">+ Novo Evento</Button>
        </div>

        <GlassCard className="w-full bg-slate-900 border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm whitespace-nowrap">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold min-w-[200px]">Título do Evento</th>
                  <th className="p-4 font-semibold">Data Inicial</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-white whitespace-nowrap">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-400">#EV001</td>
                  <td className="p-4 font-bold">SECCOMP 2026</td>
                  <td className="p-4">12/05/2026</td>
                  <td className="p-4"><span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded-md text-xs border border-blue-800">EM ANDAMENTO</span></td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-brand-accent hover:text-white underline text-sm">Editar</button>
                    <button className="text-red-400 hover:text-red-300 underline text-sm">Excluir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
