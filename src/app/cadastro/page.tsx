'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button, InputField } from '../../components/ui/Core';
import { solicitarCadastro } from '../actions/auth';
import { validarDadosCadastro, verificarEmailInstitucional, validarRa } from '../../utils/validation';

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '', email: '', ra: '', senha: '', confirmarSenha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- MÉTODOS DA CadastrarParticipanteUI (ASTAH) ---
  const isInstitucional = verificarEmailInstitucional(formData.email);
  const informarDadosInvalidos = () => setError('Dados inválidos. Verifique os campos.');
  const informarEmailDuplicado = () => setError('Este e-mail já está em uso.');
  const informarErroCadastro = () => setError('Erro ao realizar cadastro.');
  const informarSucesso = () => {
    alert('Cadastro realizado com sucesso!');
    router.push('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    
    if (!validarDadosCadastro(formData.nome, formData.email, formData.senha)) {
      informarDadosInvalidos();
      return;
    }

    if (isInstitucional && !validarRa(formData.ra)) {
       setError('RA Institucional inválido.');
       return;
    }
    
    setLoading(true);
    setError('');

    const formPayload = new FormData();
    formPayload.append('nome', formData.nome);
    formPayload.append('email', formData.email);
    if (isInstitucional) formPayload.append('ra', formData.ra);
    formPayload.append('senha', formData.senha);

    const res = await solicitarCadastro(formPayload);
    
    if (res.success) {
      informarSucesso();
    } else {
      if (res.error?.includes('duplicado')) {
         informarEmailDuplicado();
      } else {
         informarErroCadastro();
      }
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto relative z-10 py-8">
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex rounded-full border border-white/20 p-1 w-full bg-slate-800">
            <Link href="/login" className="w-1/2 text-center py-2 text-gray-400 hover:text-white rounded-full font-semibold cursor-pointer transition-colors">
              ENTRAR
            </Link>
            <div className="w-1/2 text-center py-2 bg-white text-slate-900 rounded-full font-bold cursor-pointer transition-colors shadow-sm">
              CADASTRAR
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-3 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          <InputField label="Nome Completo" id="nome" type="text" placeholder="Nome completo" value={formData.nome} onChange={handleChange} required />
          <InputField label="Email" id="email" type="email" placeholder="nome@exemplo.com" value={formData.email} onChange={handleChange} required />
          
          {isInstitucional && (
            <div className="animate-fade-in">
               <InputField label="RA (Obrigatório para alunos UNESP)" id="ra" type="text" placeholder="Seu RA" value={formData.ra} onChange={handleChange} required={isInstitucional} />
            </div>
          )}

          <InputField label="Senha" id="senha" type="password" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
          <InputField label="Confirmar senha" id="confirmarSenha" type="password" placeholder="Confirmar senha" value={formData.confirmarSenha} onChange={handleChange} required />

          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="termos" className="w-4 h-4 text-brand-accent rounded focus:ring-brand-accent bg-transparent border-gray-600" required />
            <label htmlFor="termos" className="text-sm text-gray-300">
              Concordo com os <a href="#" className="underline hover:text-white">Termos de Serviço</a> da aplicação.
            </label>
          </div>

          <div className="pt-6">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
