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

// --- MÉTODOS DA ConsultarEventoUI E InscricaoUI (ASTAH) ---

export async function solicitarConsultaEvento() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/eventos`, { 
      headers,
      cache: 'no-store' 
    });
    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Falha ao buscar eventos', data: [] };
  }
}

export async function buscarEventosDoColetor() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/eventos/coletor`, { 
      headers,
      cache: 'no-store'
    });
    if (!res.ok) return { success: false, error: 'Erro ao carregar eventos', data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Falha de conexão com o servidor', data: [] };
  }
}

export async function solicitarEventosDisponiveis(participanteId: string) {
  // Simulando a mesma chamada para fins de compatibilidade com o Astah
  return solicitarConsultaEvento();
}

export async function selecionarAtividade(atividadeId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getBase()}/atividades/${atividadeId}`, { 
      headers,
      cache: 'no-store' 
    });
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Falha ao buscar detalhes da atividade', data: null };
  }
}

export async function confirmarInscricao(participanteId: string, eventoId: string, atividades: any[]) {
  // Mock para o fluxo do Astah
  return { success: true };
}
