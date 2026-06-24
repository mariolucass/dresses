export type TipoTransacaoVAT = 'CREDITO' | 'DEBITO';

export type MotivoTransacaoVAT =
  | 'CADASTRO_BONUS'
  | 'VENDA_CONCLUIDA'
  | 'TROCA_CONCLUIDA'
  | 'PROPOSTA_ACEITA'
  | 'AJUSTE_MANUAL';

export interface TransacaoVAT {
  id: string;
  userId: string;
  tipo: TipoTransacaoVAT;
  valor: number;
  saldoAnterior: number;
  saldoPosterior: number;
  descricao: string;
  motivo: MotivoTransacaoVAT;
  negociacaoId?: string; // referência opcional à negociação que gerou a transação
  createdAt: string;
}

export type CreateTransacaoVATDto = Omit<
  TransacaoVAT,
  'id' | 'saldoAnterior' | 'saldoPosterior' | 'createdAt'
>;
