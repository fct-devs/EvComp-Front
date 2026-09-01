'use client';

import React, { useEffect, useState } from 'react';
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
  const [sucess, setSucess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [senhaRequisitos, setSenhaRequisitos] = useState({
    minCaracteres: false,
    temMaiuscula: false,
    temNumero: false,
  });

  const isInstitucional = verificarEmailInstitucional(formData.email);
  const informarDadosInvalidos = () => setError('Dados inválidos. Verifique os campos.');
  const informarEmailDuplicado = () => setError('Este e-mail já está em uso.');
  const informarErroCadastro = () => setError('Erro ao realizar cadastro.');
  const informarSucesso = () => {
    setSucess('Cadastro realizado com sucesso.');
    setTimeout(() => {
      router.push('/login');
    }, 2000); 
  }

  useEffect(() => {
    const { senha } = formData;
    setSenhaRequisitos({
      minCaracteres: senha.length >= 8,
      temMaiuscula: /[A-Z]/.test(senha),
      temNumero: /[0-9]/.test(senha),
    });
  }, [formData.senha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    
    const validacao = validarDadosCadastro(formData.nome, formData.email, formData.senha);
    if (!validacao.valido) {
      setError(validacao.erro || 'Dados inválidos. Verifique os campos.');
      return;
    }

    if (isInstitucional && !validarRa(formData.ra)) {
       setError('RA Institucional inválido.');
       return;
    }
    
    setLoading(true);
    setError('');
    setSucess('');

    const formPayload = new FormData();
    formPayload.append('nome', formData.nome);
    formPayload.append('email', formData.email);
    if (isInstitucional) formPayload.append('ra', formData.ra);
    formPayload.append('senha', formData.senha);

    const res = await solicitarCadastro(formPayload);
    
    if (res.success) {
      informarSucesso();
    } else {
      setError(res.error || 'Erro ao realizar cadastro.');
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto relative z-10 py-8">
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex rounded-full border border-white/20 p-1 w-full bg-black">
            <Link href="/login" className="w-1/2 text-center py-2 text-gray-400 hover:text-white rounded-full font-semibold cursor-pointer transition-colors">
              ENTRAR
            </Link>
            <div className="w-1/2 text-center py-2 bg-white text-black rounded-full font-bold cursor-pointer transition-colors shadow-sm">
              CADASTRAR
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {sucess && (
            <div className="bg-emerald-500/20 border border-emerald-500/50 p-3 rounded text-emerald-200 text-sm animate-fade-in">
              {sucess}
            </div>
          )}
          
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

         <div>
            <InputField label="Senha" id="senha" type="password" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
            
            {formData.senha && (
              <ul className="mt-2 space-y-1 text-xs transition-all duration-300">
                <li className={`flex items-center gap-2 ${senhaRequisitos.minCaracteres ? 'text-brand-accent line-through opacity-60' : 'text-gray-400'}`}>
                  <span>{senhaRequisitos.minCaracteres ? '✓' : '○'}</span> Mínimo de 8 caracteres
                </li>
                <li className={`flex items-center gap-2 ${senhaRequisitos.temMaiuscula ? 'text-brand-accent line-through opacity-60' : 'text-gray-400'}`}>
                  <span>{senhaRequisitos.temMaiuscula ? '✓' : '○'}</span> Pelo menos uma letra maiúscula
                </li>
                <li className={`flex items-center gap-2 ${senhaRequisitos.temNumero ? 'text-brand-accent line-through opacity-60' : 'text-gray-400'}`}>
                  <span>{senhaRequisitos.temNumero ? '✓' : '○'}</span> Pelo menos um número
                </li>
              </ul>
            )}
          </div>
          <InputField label="Confirmar senha" id="confirmarSenha" type="password" placeholder="Confirmar senha" value={formData.confirmarSenha} onChange={handleChange} required />

          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="termos" className="w-4 h-4 text-brand-accent rounded focus:ring-brand-accent bg-transparent border-gray-600" required />
            <label htmlFor="termos" className="text-sm text-gray-300">
              Concordo com os <Link href="/termos" target="_blank" className="underline hover:text-brand-accent transition-colors font-semibold">Termos de Serviço</Link> da aplicação.
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