import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/ui/Navbar';
import { Button } from '../../components/ui/Core';
import { solicitarConsultaEvento } from '../actions/eventos';
import { buscarPerfilUsuario } from '../actions/auth';

export default async function DashboardPage() {
  // --- MÉTODOS DA ConsultarEventoUI (ASTAH) ---
  const response = await solicitarConsultaEvento();
  const eventos = response.success ? response.data : [];
  
  const perfilRes = await buscarPerfilUsuario();
  let inscritos: number[] = [];
  if (perfilRes.success) {
    try {
      const minRes = await fetch(`http://localhost:8080/api/inscricoes/minhas?participanteId=${perfilRes.data.id}`, { credentials: 'include' });
      if (minRes.ok) {
        const minData = await minRes.json();
        if (minData.inscritos) inscritos = minData.inscritos;
      }
    } catch(e) {}
  }
  
  const exibirDadosEvento = () => eventos;
  const informarEventoNaoEncontrado = () => (
    <p className="text-gray-400 text-center py-4">Nenhum evento encontrado no sistema.</p>
  );
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role="PARTICIPANTE" />
      
      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6">
        <div className="border border-white/20 rounded-2xl bg-slate-800/50 backdrop-blur-sm p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Inscrições em Eventos</h2>
          
          <div className="flex justify-between border-b border-white/10 pb-2 mb-4 text-sm font-semibold text-gray-300">
            <span>Evento</span>
            <span>Data/Horário</span>
          </div>

          <div className="space-y-4">
            {eventos.length === 0 && informarEventoNaoEncontrado()}
            {exibirDadosEvento().map((ev: any) => (
              <div key={ev.id} className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-white/5 hover:border-brand-accent/50 transition-colors">
                <div className="mb-4 md:mb-0 md:pr-4">
                  <h3 className="text-white font-bold">{ev.nome || ev.titulo || `Evento #${ev.id}`}</h3>
                  <p className="text-gray-400 text-sm mt-1">{ev.descricao || 'Sem descrição'}</p>
                </div>
                
                <div className="flex flex-row md:flex-col items-center justify-between md:items-end min-w-[120px]">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-lg">{ev.dataInicio ? new Date(ev.dataInicio).toLocaleDateString('pt-BR', { credentials: 'include',  timeZone: 'UTC' }) : 'TBA'}</span>
                  </div>
                  <span className="text-gray-400 text-sm mt-1">{ev.dataFim ? new Date(ev.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'TBA'}</span>
                  
                  {inscritos.includes(ev.id) ? (
                    <span className="mt-4 md:mt-0 md:ml-6 block w-full text-center px-6 py-2 rounded-full font-bold transition-all duration-300 bg-gray-500/50 text-gray-300 cursor-not-allowed border border-gray-400/20 text-sm">
                       INSCRITO
                    </span>
                  ) : (
                    <Link href={`/dashboard/eventos/${ev.id}/inscricao`} className="mt-4 md:mt-0 md:ml-6 block w-full text-center px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 bg-white text-slate-900 hover:bg-gray-200 text-sm">
                       INSCREVER-SE
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/dashboard/eventos">
               <Button variant="secondary" className="w-full max-w-sm text-lg py-3">VER TODOS OS EVENTOS</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
