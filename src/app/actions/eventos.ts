'use server';

import { cookies } from 'next/headers';

const API_BASE = process.env.API_URL || 'http://localhost:8080/api';

// --- MÉTODOS DA ConsultarEventoUI E InscricaoUI (ASTAH) ---

export async function solicitarConsultaEvento() {
  try {
    const res = await fetch(`${API_BASE}/eventos`, { cache: 'no-store' });
    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Falha ao buscar eventos', data: [] };
  }
}
export async function buscarEventosDoColetor() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado', data: [] };

  try {
    const res = await fetch(`${API_BASE}/eventos/coletor`, {
      headers: { 'Authorization': `Bearer ${token}` },
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
    const res = await fetch(`${API_BASE}/atividades/${atividadeId}`, { cache: 'no-store' });
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
