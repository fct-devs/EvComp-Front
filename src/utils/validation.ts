export function validarDados(email: string, senha: string): boolean {
  return email.trim() !== '' && senha.trim() !== '';
}

export function validarDadosCadastro(nome: string, email: string, senha: string): { valido: boolean; erro?: string } {
  if (nome.trim() === '') {
    return { valido: false, erro: 'Nome não pode ser vazio.' };
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) {
    return { valido: false, erro: 'E-mail em formato inválido.' };
  }

  const temTamanhoMinimo = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /\d/.test(senha);

  if (!temTamanhoMinimo || !temMaiuscula || !temNumero) {
    return { valido: false, erro: 'A senha não atende aos requisitos.' };
  }

  return { valido: true };
}

export function verificarEmailInstitucional(email: string): boolean 
{
  return email.includes('unesp.br');
}

export function validarRa(ra: string): boolean {
  return !ra || ra.length === 9;
}

export function validarDadosEvento(titulo: string, dataInicio: Date, dataTermino: Date, descricao: string, link: string): boolean {
  if (!titulo || titulo.trim() === '') return false;
  if (!dataInicio || !dataTermino || dataInicio > dataTermino) return false;
  return true;
}

export function verificarConflitos(atividade: any, outrasAtividades: any[]): boolean {
  if (!atividade || !atividade.dataInicio || !atividade.horarioInicio || !atividade.horarioFim) return false;
  
  const dtInicioAtv = new Date(`${atividade.dataInicio}T${atividade.horarioInicio}`);
  const dtFimAtv = new Date(`${atividade.dataFim || atividade.dataInicio}T${atividade.horarioFim}`);

  for (const outra of outrasAtividades) {
    if (outra.id === atividade.id) continue;
    if (!outra.dataInicio || !outra.horarioInicio || !outra.horarioFim) continue;
    
    const dtInicioOutra = new Date(`${outra.dataInicio}T${outra.horarioInicio}`);
    const dtFimOutra = new Date(`${outra.dataFim || outra.dataInicio}T${outra.horarioFim}`);

    if (dtInicioAtv < dtFimOutra && dtFimAtv > dtInicioOutra) {
      return true;
    }
  }
  return false;
}

export function validarDadosAtividade(titulo: string, data_inicio: string, data_termino: string, horario_inicio: string, horario_termino: string, evInicio?: string, evFim?: string): string | null {
    if (!titulo || !data_inicio || !data_termino || !horario_inicio || !horario_termino) {
        return 'Campos obrigatórios ausentes.';
    }
    
    const dtIn = new Date(`${data_inicio}T${horario_inicio}`);
    const dtFi = new Date(`${data_termino}T${horario_termino}`);
    if (dtIn > dtFi) {
        return 'A data e hora de início não podem ser posteriores ao término.';
    }

    if (evInicio && evFim) {
        const parseDateFallback = (dt: any) => {
            try {
                if (!dt) return null;
                if (Array.isArray(dt)) {
                    return new Date(dt[0], dt[1] - 1, dt[2]);
                }
                if (typeof dt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dt.trim())) {
                    const parts = dt.trim().split('-');
                    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                }
                if (typeof dt === 'string') {
                    const parsed = new Date(dt);
                    if (!isNaN(parsed.getTime())) {
                        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
                    }
                }
                return null;
            } catch (err) {
                return null;
            }
        };

        const pEvIn = parseDateFallback(evInicio);
        const pEvFi = parseDateFallback(evFim);
        const pAtIn = parseDateFallback(data_inicio);
        const pAtFi = parseDateFallback(data_termino);
        
        if (pEvIn && pAtIn && pAtIn < pEvIn) return 'A data de início da atividade não pode ser anterior ao evento.';
        if (pEvFi && pAtFi && pAtFi > pEvFi) return 'A data de término da atividade não pode ser posterior ao evento.';
    }
    return null;
}
