'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button, InputField } from '../../components/ui/Core';
import { solicitarLogin, solicitarLogout } from '../actions/auth';
import { validarDados } from '../../utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [senhaRequisitos, setSenhaRequisitos] = useState({
    minCaracteres: false,
    temMaiuscula: false,
    temNumero: false,
  });

  useEffect(() => {
    setSenhaRequisitos({
      minCaracteres: senha.length >= 8,
      temMaiuscula: /[A-Z]/.test(senha),
      temNumero: /[0-9]/.test(senha),
    });
  }, [senha]);

  // Limpa qualquer sessão que tenha ficado para trás
  useEffect(() => {
    solicitarLogout();
  }, []);

  const informarCredenciaisInvalidas = () => setError('Credenciais Inválidas');
  const informarDadosInvalidos = () => setError('Por favor, preencha o email e a senha corretamente.');
  const informarErroLogin = () => setError('Erro de conexão com o servidor.');
  const exibirSessao = (data: any) => {
    if (data.role === 'ADMIN') {
      window.location.href = '/admin';
    } else if (data.isColetor === 'true' || data.isColetor === true || data.role === 'COLETOR') {
      window.location.href = '/coletor/scan';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!validarDados(email, senha)) {
      informarDadosInvalidos();
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('senha', senha);
    
    const res = await solicitarLogin(formData);
    
    if (res.success) {
      exibirSessao(res.data);
    } else {
      if (res.error === 'Credenciais inválidas') {
        informarCredenciaisInvalidas();
      } else {
        informarErroLogin();
      }
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="flex flex-row items-center justify-between mb-12">
          {/* Toggle mimicking the inspiration image */}
          <div className="flex rounded-full border border-white/20 p-1 w-full bg-slate-800">
            <div className="w-1/2 text-center py-2 bg-white text-slate-900 rounded-full font-bold cursor-pointer transition-colors shadow-sm">
              ENTRAR
            </div>
            <Link href="/cadastro" className="w-1/2 text-center py-2 text-gray-400 hover:text-white rounded-full font-semibold cursor-pointer transition-colors">
              CADASTRAR
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-3 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          <InputField 
            label="Email" 
            id="email" 
            type="email" 
            placeholder="nome@exemplo.com"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            required
          />
          <div className="space-y-1">
            <InputField 
              label="Senha" 
              id="senha" 
              type="password" 
              placeholder="Sua senha"
              value={senha}
              onChange={(e: any) => setSenha(e.target.value)}
              required
            />
            {senha && (
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
            <div className="flex justify-end pt-2">
              <Link href="/recuperar-senha" className="text-sm text-brand-accent hover:text-blue-400 transition-colors">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Autenticando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
