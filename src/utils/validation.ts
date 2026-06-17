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

export function verificarConflitos(atividades: any[], atividadeId: string): boolean {
  return false;
}
