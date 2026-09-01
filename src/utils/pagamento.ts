export type StatusPagamento = 'ISENTO' | 'PENDENTE' | 'APROVADO' | 'RECUSADO';

export interface Pagamento {
  id: number;
  inscricaoId: number;
  eventoId: number;
  tituloEvento: string;
  status: StatusPagamento;
  temComprovante: boolean;
  nomeArquivoOriginal: string | null;
  tipoArquivo: string | null;
  tamanhoArquivo: number | null;
  dataEnvio: string | null;
  dataAvaliacao: string | null;
  motivoRecusa: string | null;
  chavePix: string | null;
  valorInscricao: number | null;
  modalidadeNome: string | null;
  urlComprovante: string | null;
  dataInicioEvento?: string | null;
  dataFimInscricao?: string | null;
  dataInicioInscricao?: string | null;
}

export interface PagamentoPendente extends Pagamento {
  participanteId: number;
  nomeParticipante: string;
  emailParticipante: string;
}

export const ESTILO_STATUS: Record<StatusPagamento, { rotulo: string; classe: string }> = {
  ISENTO: {
    rotulo: 'ISENTO',
    classe: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
  },
  PENDENTE: {
    rotulo: 'PENDENTE',
    classe: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  },
  APROVADO: {
    rotulo: 'APROVADO',
    classe: 'bg-green-500/20 text-green-400 border-green-500/50',
  },
  RECUSADO: {
    rotulo: 'RECUSADO',
    classe: 'bg-red-500/20 text-red-400 border-red-500/50',
  },
};