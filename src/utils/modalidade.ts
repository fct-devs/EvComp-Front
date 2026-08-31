import { formatarBRL } from './formatadores';

export interface ModalidadeInscricao {
  id: number;
  eventoId: number;
  nome: string;
  descricao: string | null;
  valor: number;
  ativo: boolean;
}

export function resumoPrecoModalidades(modalidades: ModalidadeInscricao[]): string {
  const ativas = modalidades.filter((m) => m.ativo);
  if (ativas.length === 0) return 'Sem modalidade configurada';
  if (ativas.every((m) => Number(m.valor) === 0)) return 'Gratuito';
  const menor = Math.min(...ativas.map((m) => Number(m.valor)));
  return menor === 0 ? 'A partir de Gratuito' : `A partir de ${formatarBRL(menor)}`;
}
