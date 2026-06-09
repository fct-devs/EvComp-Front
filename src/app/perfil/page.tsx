'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/ui/Navbar';
import { Button, GlassCard, InputField } from '../../components/ui/Core';
import { solicitarLogout, buscarPerfilUsuario } from '../actions/auth';

export default function PerfilPage() {
  const router = useRouter();
  const [userData, setUserData] = useState({ nome: '', email: '', ra: '', role: 'PARTICIPANTE' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      const res = await buscarPerfilUsuario();
      if (res.success && res.data) {
        setUserData(res.data);
      } else {
        router.push('/login');
      }
      setLoading(false);
    }
    carregarPerfil();
  }, [router]);

  const handleLogout = async () => {
    await solicitarLogout();
    router.push('/login');
  };

  const iniciais = userData.nome ? userData.nome.substring(0, 2).toUpperCase() : 'US';

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
         <span className="text-white">Carregando perfil...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar role={userData.role as "PARTICIPANTE" | "COLETOR" | "ADMIN"} />
      
      <main className="flex-1 w-full max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-extrabold text-white mb-8">Minha Conta</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
             <GlassCard className="flex flex-col items-center text-center p-6 bg-slate-800/80 border-white/5">
                <div className="w-24 h-24 bg-brand-accent/20 rounded-full flex items-center justify-center mb-4 border-2 border-brand-accent/50">
                  <span className="text-3xl font-bold text-white">{iniciais}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{userData.nome}</h2>
                <p className="text-sm text-gray-400 mb-2">{userData.role === 'PARTICIPANTE' ? 'Participante' : userData.role}</p>
                <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full border border-blue-800">{userData.role}</span>
             </GlassCard>


             <div className="mt-6">
                <Button variant="danger" className="w-full" onClick={handleLogout}>Sair da Conta</Button>
             </div>
          </div>

          <div className="col-span-2">
             <GlassCard className="p-8 bg-slate-900/90 border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Informações Pessoais</h3>
                
                <form className="space-y-4">
                  <div className="pointer-events-none opacity-80">
                    <InputField label="Nome Completo" id="nome" type="text" value={userData.nome} readOnly />
                    <InputField label="Email" id="email" type="email" value={userData.email} readOnly />
                    {userData.ra && (
                       <InputField label="RA / Identificação" id="ra" type="text" value={userData.ra} readOnly />
                    )}
                  </div>
                  
                  <div className="pt-4 mt-6">
                    <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-md text-sm text-sky-200">
                      <strong>Nota:</strong> As informações pessoais não podem ser alteradas pelo sistema. Caso necessite corrigir algum dado cadastral, por favor, contate a organização do evento.
                    </div>
                  </div>
                </form>
             </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
