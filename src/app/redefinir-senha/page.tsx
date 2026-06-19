'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button, InputField } from '../../components/ui/Core';

function RedefinirSenhaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [tokenInput, setTokenInput] = useState(''); // estado isolado para a tela de erro
  const [loading, setLoading] = useState(false);
  
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);

  // Estado para controlar os requisitos da senha
  const [senhaRequisitos, setSenhaRequisitos] = useState({
    minCaracteres: false,
    temMaiuscula: false,
    temNumero: false,
  });

  // --- MÉTODOS DA RedefinicaoSenhaUI (ASTAH) ---
  const informarTokenInvalido = () => {
    setTokenValido(false);
    setErro('Código de redefinição inválido ou expirado.');
  };

  const solicitarNovaSenha = () => {
    setTokenValido(true);
  };

  const informarSenhaInvalida = () => {
    setErro('A senha deve ter no mínimo 8 caracteres, contendo pelo menos um número e uma letra maiúscula.');
  };

  const mensagemErroRedefinicao = () => {
    setErro('As senhas não coincidem.');
  };

  const mensagemSucesso = () => {
    setSucesso(true);
  };

  // Efeito para validar a senha em tempo real conforme o usuário digita
  useEffect(() => {
    setSenhaRequisitos({
      minCaracteres: novaSenha.length >= 8,
      temMaiuscula: /[A-Z]/.test(novaSenha),
      temNumero: /[0-9]/.test(novaSenha),
    });
  }, [novaSenha]);

  useEffect(() => {
    const validar = async () => {
      if (!token) {
        informarTokenInvalido();
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/api/redefinicao-senha/validar?tokenRecebido=${token}`, { credentials: 'include', 
          method: 'POST'
        });
        const isValid = await response.json();
        if (isValid === true) {
          solicitarNovaSenha();
        } else {
          informarTokenInvalido();
        }
      } catch (e) {
        informarTokenInvalido();
      }
    };
    validar();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    // Validação da senha
    if (!senhaRequisitos.minCaracteres || !senhaRequisitos.temMaiuscula || !senhaRequisitos.temNumero) {
      informarSenhaInvalida();
      return;
    }

    if (novaSenha !== confirmacao) {
      mensagemErroRedefinicao();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/redefinicao-senha/confirmar?tokenRecebido=${token}&novaSenha=${encodeURIComponent(novaSenha)}`, { credentials: 'include', 
        method: 'POST'
      });
      const result = await response.json();
      
      if (result === true) {
        mensagemSucesso();
      } else {
        informarTokenInvalido();
      }
    } catch (error) {
      setErro('Ocorreu um erro ao redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-brand-accent/30">
          <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Criar Nova Senha</h1>
        <p className="text-gray-400 text-sm">
          Quase lá! Digite sua nova senha forte abaixo.
        </p>
      </div>

      {tokenValido === null ? (
         <div className="text-center text-white/60 py-12">
           <div className="animate-spin h-10 w-10 border-4 border-brand-accent border-t-transparent rounded-full mx-auto mb-6"></div>
           Validando código de segurança...
         </div>
      ) : sucesso ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-2xl text-center shadow-lg backdrop-blur-sm transition-all duration-500 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-emerald-400 font-semibold text-2xl mb-2">Senha Alterada!</h3>
          <p className="text-emerald-100/70 text-sm mb-6 leading-relaxed">
            Sua senha foi redefinida com sucesso. Você já pode acessar sua conta.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button className="w-full">Ir para Login</Button>
            </Link>
          </div>
        </div>
      ) : tokenValido === false ? (
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl text-center shadow-lg backdrop-blur-sm transition-all duration-500 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 className="text-red-400 font-semibold text-xl mb-2">Código Inválido</h3>
          <p className="text-red-100/70 text-sm mb-6 leading-relaxed">{erro}</p>
          
          <div className="space-y-4 text-left">
            <InputField 
              label="Tentar informar novamente" 
              id="novoToken" 
              type="text" 
              placeholder="Digite o código de 6 dígitos"
              value={tokenInput}
              onChange={(e: any) => {
                 setTokenInput(e.target.value.replace(/\D/g, '').slice(0, 6));
              }}
              required
            />
            <Button 
               className="w-full" 
               disabled={tokenInput.length !== 6}
               onClick={async () => {
                 try {
                   const response = await fetch(`http://localhost:8080/api/redefinicao-senha/validar?tokenRecebido=${tokenInput}`, { credentials: 'include',  method: 'POST' });
                   const isValid = await response.json();
                   if (isValid === true) {
                     window.history.replaceState(null, '', `/redefinir-senha?token=${tokenInput}`);
                     setTokenValido(true);
                     setErro('');
                   } else {
                     setErro('Código de redefinição inválido ou expirado.');
                   }
                 } catch (e) {
                   setErro('Erro de conexão ao validar o código.');
                 }
               }}
            >
              Validar Código
            </Button>
          </div>

          <div className="relative flex py-5 items-center">
             <div className="flex-grow border-t border-red-500/30"></div>
             <span className="flex-shrink-0 mx-4 text-red-300/50 text-xs uppercase">ou</span>
             <div className="flex-grow border-t border-red-500/30"></div>
          </div>

          <div>
            <Link href="/recuperar-senha">
              <Button className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-200 border-red-500/50">
                Solicitar Reenvio de Código
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-300 text-sm text-center font-medium animate-in slide-in-from-top-2">
              {erro}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <InputField 
                label="Nova Senha" 
                id="novaSenha" 
                type="password" 
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e: any) => setNovaSenha(e.target.value)}
                required
              />
              {novaSenha && (
                <ul className="mt-2 space-y-1 text-xs transition-all duration-300">
                  <li className={`flex items-center gap-2 ${senhaRequisitos.minCaracteres ? 'text-sky-400 line-through opacity-60' : 'text-gray-400'}`}>
                    <span>{senhaRequisitos.minCaracteres ? '✓' : '○'}</span> Mínimo de 8 caracteres
                  </li>
                  <li className={`flex items-center gap-2 ${senhaRequisitos.temMaiuscula ? 'text-sky-400 line-through opacity-60' : 'text-gray-400'}`}>
                    <span>{senhaRequisitos.temMaiuscula ? '✓' : '○'}</span> Pelo menos uma letra maiúscula
                  </li>
                  <li className={`flex items-center gap-2 ${senhaRequisitos.temNumero ? 'text-sky-400 line-through opacity-60' : 'text-gray-400'}`}>
                    <span>{senhaRequisitos.temNumero ? '✓' : '○'}</span> Pelo menos um número
                  </li>
                </ul>
              )}
            </div>

            <InputField 
              label="Confirmar Senha" 
              id="confirmacao" 
              type="password" 
              placeholder="Digite a senha novamente"
              value={confirmacao}
              onChange={(e: any) => setConfirmacao(e.target.value)}
              required
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full shadow-lg shadow-brand-accent/20" 
              disabled={loading || !senhaRequisitos.minCaracteres || !senhaRequisitos.temMaiuscula || !senhaRequisitos.temNumero}
            >
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="text-white text-center">Carregando...</div>}>
        <RedefinirSenhaContent />
      </Suspense>
    </AuthLayout>
  );
}
