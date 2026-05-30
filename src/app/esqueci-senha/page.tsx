'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button, InputField } from '../../components/ui/Core';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recuperação mock disparada:', { email });
    setEnviado(true);
    // TODO: Connect to Spring Boot backend
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-white mb-2">Recuperar Senha</h2>
          <p className="text-gray-400">Insira seu e-mail cadastrado para receber as instruções.</p>
        </div>

        {!enviado ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Email" 
              id="email" 
              type="email" 
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            
            <div className="pt-2 flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Enviar Instruções
              </Button>
              <Link href="/login" className="text-center text-sm text-gray-400 hover:text-white">
                Voltar para o login
              </Link>
            </div>
          </form>
        ) : (
          <div className="glass p-8 text-center space-y-4 rounded-xl">
            <svg className="w-12 h-12 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 className="text-xl font-bold text-white">E-mail Enviado!</h3>
            <p className="text-gray-300 text-sm">Se o e-mail estiver cadastrado, você receberá um link temporário para redefinir sua senha em instantes.</p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="secondary" className="w-full">Voltar ao Início</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
