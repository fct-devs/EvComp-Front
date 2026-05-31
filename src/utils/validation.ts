export function validarDados(email: string, senha: string): boolean {
  return email.trim() !== '' && senha.trim() !== '';
}

export function validarDadosCadastro(nome: string, email: string, senha: string): boolean 
{
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const temTamanhoMinimo = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /\d/.test(senha);

  return (nome.trim() !== '' && emailValido && temTamanhoMinimo && temMaiuscula && temNumero);
}

export function verificarEmailInstitucional(email: string): boolean 
{
  return email.includes('unesp.br');
}

export function validarRa(ra: string): boolean {
  return !ra || ra.length >= 6;
}

export function validarDadosEvento(titulo: string, dataInicio: Date, dataTermino: Date, descricao: string, link: string): boolean {
  if (!titulo || titulo.trim() === '') return false;
  if (!dataInicio || !dataTermino || dataInicio > dataTermino) return false;
  return true;
}

export function verificarConflitos(atividades: any[], atividadeId: string): boolean {
  return false;
}
