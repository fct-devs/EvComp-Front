'use server';

import { cookies } from 'next/headers';
import { getApiBase } from '../../utils/api';

const getBase = () => getApiBase();

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// --- MÉTODOS DA RegistrarPresencaUI (ASTAH) ---
export async function registrarPresenca(atividadeId: string, codigoParticipante: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/presenca`, { 
      method: 'POST',
      headers,
      body: JSON.stringify({ atividadeId, ra: codigoParticipante }),
    });
    
    if (!res.ok) return { success: false, error: 'Falha ao registrar presença. RA inválido ou atividade incorreta.' };
    
    return { success: true, message: 'Presença validada com sucesso!' };
  } catch (error) {
    return { success: false, error: 'Erro de rede ao contatar a API.' };
  }
}

// --- MÉTODOS DA CriacaoEventoUI E EditarEventoUI (ASTAH) ---
export async function solicitarCriacaoEvento(formData: FormData) {
  const payload = {
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao'),
    link: formData.get('link'),
    dataInicio: formData.get('dataInicio'),
    dataFim: formData.get('dataFim')
  };
  
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/eventos`, { 
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      if (res.status === 409) return { success: false, error: 'Evento Duplicado' };
      return { success: false, error: 'Erro ao criar evento.' };
    }
    
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Falha de conexão' };
  }
}

// --- MÉTODOS DA CriacaoAtividadeUI (ASTAH) ---
export async function solicitarCriacaoAtividade(formData: FormData) {
  const payload = Object.fromEntries(formData.entries());
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/atividades`, { 
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) return { success: false, error: 'Erro ao criar atividade.' };
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Falha de conexão' };
  }
}

// --- MÉTODOS DA AtribuirColetorUI e RemoverColetorUI (ASTAH) ---
export async function exibirParticipantes() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/participantes`, { 
      headers,
      cache: 'no-store' 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { success: false, data: [], error: errorData?.error || `Erro ${res.status} ao buscar participantes.` };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Erro ao buscar participantes.', data: [] };
  }
}

export async function tornarColetor(eventoId: string, participanteId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/eventos/${eventoId}/coletores/${participanteId}`, { 
      method: 'POST',
      headers,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { success: false, error: data?.error || 'Não foi possível atribuir o coletor.' };
    return { success: true, message: data?.message || 'Participante promovido a Coletor.' };
  } catch (error) {
    return { success: false, error: 'Erro de rede.' };
  }
}

export async function removerColetor(eventoId: string, coletorId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/eventos/${eventoId}/coletores/${coletorId}`, { 
      method: 'DELETE',
      headers,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { success: false, error: data?.error || 'Não foi possível remover o coletor.' };
    return { success: true, message: data?.message || 'Coletor removido com sucesso.' };
  } catch (error) {
    return { success: false, error: 'Erro de rede.' };
  }
}

// --- MÉTODOS DA GerarRelatorioUI (ASTAH) ---
export async function solicitarGerarRelatorio(eventoId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/relatorios/gerar?eventoId=${eventoId}`, { 
      method: 'GET',
      headers,
    });
    if (!res.ok) return { success: false, error: 'Erro ao gerar relatório.' };
    
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Erro de conexão.' };
  }
}

// --- MÉTODOS DA EmitirCertificadosUI (ASTAH) ---
export async function emitirCertificado(participanteId: string, eventoId: string, atividadeId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/certificados/emitir`, { 
      method: 'POST',
      headers,
      body: JSON.stringify({ participanteId, eventoId, atividadeId }),
    });
    if (!res.ok) return { success: false, error: 'Erro ao emitir certificado.' };
    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: 'Erro de conexão' };
  }
}
