'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button, InputField } from '../../components/ui/Core';

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // --- MÉTODOS DA RedefinicaoSenhaUI (ASTAH) ---
  const solicitarEmailRedefinicao = () => {
    // A renderização do formulário
  };

  const mensagemGenericaEnvioInstrucoes = () => {
    setSucesso(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetch(`/api/redefinicao-senha/solicitar?email=${encodeURIComponent(email)}`, { credentials: 'include', 
        method: 'POST',
      });
      mensagemGenericaEnvioInstrucoes();
      setCooldown(30);
    } catch (error) {
      console.error(error);
      mensagemGenericaEnvioInstrucoes();
      setCooldown(30);
    } finally {
      setLoading(false);
    }
  };

  const [erroValidacao, setErroValidacao] = useState('');

  const handleValidarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroValidacao('');
    if (tokenInput.length === 6) {
      try {
        const response = await fetch(`/api/redefinicao-senha/validar?tokenRecebido=${tokenInput}`, { credentials: 'include', 
          method: 'POST'
        });
        const isValid = await response.json();
        if (isValid === true) {
          router.push(`/redefinir-senha?token=${tokenInput}`);
        } else {
          setErroValidacao('Código inválido ou expirado.');
        }
      } catch (err) {
        setErroValidacao('Ocorreu um erro ao validar o código.');
      }
    }
  };

  solicitarEmailRedefinicao();

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-brand-accent/30">
            <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Recuperar Senha</h1>
          <p className="text-gray-400 text-sm">
            Informe seu e-mail e enviaremos um código de recuperação para o seu acesso.
          </p>
        </div>

        {sucesso ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-2xl text-center shadow-lg backdrop-blur-sm transition-all duration-500 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-emerald-400 font-semibold text-xl mb-2">E-mail Enviado!</h3>
            <p className="text-emerald-100/70 text-sm mb-6 leading-relaxed">
              Verifique sua caixa de entrada. Você pode clicar no link enviado ou inserir o código de 6 dígitos abaixo.
            </p>
            
            <form onSubmit={handleValidarCodigo} className="space-y-4 text-left">
              {erroValidacao && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-300 text-xs text-center font-medium animate-in slide-in-from-top-2">
                  {erroValidacao}
                </div>
              )}
              <InputField 
                label="Código de 6 dígitos" 
                id="token" 
                type="text" 
                placeholder="Ex: 123456"
                value={tokenInput}
                onChange={(e: any) => setTokenInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              <Button type="submit" className="w-full mt-2" disabled={tokenInput.length !== 6}>
                Validar Código
              </Button>
              
              {erroValidacao && (
                <div className="pt-4 pb-2 text-center">
                  <div className="relative flex items-center mb-4">
                    <div className="flex-grow border-t border-emerald-500/30"></div>
                    <span className="flex-shrink-0 mx-4 text-emerald-300/50 text-xs uppercase">ou</span>
                    <div className="flex-grow border-t border-emerald-500/30"></div>
                  </div>
                  <Button 
                    type="button"
                    onClick={handleSubmit} 
                    disabled={loading || cooldown > 0}
                    className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 border-emerald-500/50 disabled:opacity-50"
                  >
                    {loading ? 'Reenviando...' : cooldown > 0 ? `Aguarde ${cooldown}s para reenviar` : 'Solicitar Envio de um Novo Código'}
                  </Button>
                </div>
              )}
            </form>

            <div className="pt-6">
              <Link href="/login" className="text-sm font-medium text-emerald-300 hover:text-white transition-colors">
                &larr; Voltar ao Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Email cadastrado" 
              id="email" 
              type="email" 
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />

            <div className="pt-2 space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Instruções'}
              </Button>
              
              <div className="text-center pt-2">
                <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  &larr; Voltar ao Login
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
