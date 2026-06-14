'use server';

const API_BASE = process.env.API_URL || 'http://localhost:8080/api';

// --- MÉTODOS DA RegistrarPresencaUI (ASTAH) ---
export async function registrarPresenca(atividadeId: string, codigoParticipante: string) {
  try {
    const res = await fetch(`${API_BASE}/presenca`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_BASE}/eventos`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_BASE}/atividades`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_BASE}/participantes`, { credentials: 'include',  cache: 'no-store' });
    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Erro ao buscar participantes.', data: [] };
  }
}

export async function tornarColetor(eventoId: string, participanteRa: string) {
  try {
    const res = await fetch(`${API_BASE}/eventos/${eventoId}/coletores/${participanteRa}`, { credentials: 'include', 
      method: 'POST',
    });
    if (!res.ok) return { success: false, error: 'Não foi possível atribuir o coletor.' };
    return { success: true, message: 'Participante promovido a Coletor.' };
  } catch (error) {
    return { success: false, error: 'Erro de rede.' };
  }
}

export async function removerColetor(eventoId: string, coletorId: string) {
  try {
    const res = await fetch(`${API_BASE}/eventos/${eventoId}/coletores/${coletorId}`, { credentials: 'include', 
      method: 'DELETE',
    });
    if (!res.ok) return { success: false, error: 'Não foi possível remover o coletor.' };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro de rede.' };
  }
}

// --- MÉTODOS DA GerarRelatorioUI (ASTAH) ---
export async function solicitarGerarRelatorio(eventoId: string) {
  try {
    const res = await fetch(`${API_BASE}/relatorios/gerar?eventoId=${eventoId}`, { credentials: 'include', 
      method: 'GET',
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
    const res = await fetch(`${API_BASE}/certificados/emitir`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participanteId, eventoId, atividadeId }),
    });
    if (!res.ok) return { success: false, error: 'Erro ao emitir certificado.' };
    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: 'Erro de conexão' };
  }
}
