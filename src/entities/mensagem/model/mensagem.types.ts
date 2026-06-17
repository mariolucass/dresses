export type TipoMensagem = 'TEXTO' | 'SISTEMA';

export interface Mensagem {
  id: string;
  negociacaoId: string;
  remetenteId: string;
  texto: string;
  tipo: TipoMensagem;
  lida: boolean;
  createdAt: string;
}

export type CreateMensagemDto = Omit<Mensagem, 'id' | 'lida' | 'createdAt'>;
