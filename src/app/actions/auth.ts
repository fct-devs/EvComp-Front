'use server';

import { cookies } from 'next/headers';
import { validarDados } from '../../utils/validation';

const API_BASE = process.env.API_URL || 'http://localhost:8080/api';

export async function solicitarLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const senha = formData.get('senha') as string;

  if (!validarDados(email, senha)) {
    return { success: false, error: 'Dados inválidos' };
  }

  try {
    const res = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    
    if (!res.ok) {
      return { success: false, error: 'Credenciais inválidas' };
    }
    
    const data = await res.json();
    
    if (data.token) {
      const cookieStore = await cookies();
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      };
      
      cookieStore.set('auth_token', data.token, options);
      
      const publicOptions = { ...options, httpOnly: false };
      
      if (data.role) {
        cookieStore.set('user_role', data.role, publicOptions);
      }
      if (data.isColetor) {
        cookieStore.set('is_coletor', data.isColetor, publicOptions);
      }
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: 'Erro ao conectar com o servidor.' };
  }
}

export async function solicitarLogout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });
    } catch (e) {
      console.error('Erro ao chamar o logout no backend', e);
    }
  }

  cookieStore.delete('auth_token');
  cookieStore.delete('user_role');
  cookieStore.delete('is_coletor');
  return { success: true };
}

export async function solicitarCadastro(formData: FormData) {
  const payload = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    ra: formData.get('ra') || null,
    senha: formData.get('senha')
  };

  try {
    const res = await fetch(`${API_BASE}/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      try {
        const errorData = await res.json();
        return { success: false, error: errorData.error || 'Erro no cadastro. Verifique os dados.' };
      } catch (e) {
        return { success: false, error: 'Erro no cadastro. Verifique os dados.' };
      }
    }
    

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: 'Erro de conexão.' };
  }
}

export async function recuperarSenhaAction(formData: FormData) {
  const email = formData.get('email');
  try {
    const res = await fetch(`${API_BASE}/redefinir-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return { success: false, error: 'E-mail não encontrado' };
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Erro de conexão.' };
  }
}

export async function buscarPerfilUsuario() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return { success: false, error: 'Não autenticado' };

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      try {
        cookieStore.delete('auth_token');
        cookieStore.delete('user_role');
        cookieStore.delete('is_coletor');
      } catch (err) {}
      return { success: false, error: 'Sessão inválida' };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    try {
      cookieStore.delete('auth_token');
      cookieStore.delete('user_role');
      cookieStore.delete('is_coletor');
    } catch (err) {}
    return { success: false, error: 'Erro de conexão.' };
  }
}
