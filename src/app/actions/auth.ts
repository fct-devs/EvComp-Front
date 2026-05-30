'use server';

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
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: 'Erro ao conectar com o servidor.' };
  }
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
      return { success: false, error: 'Erro no cadastro. Verifique os dados.' };
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
