export type TipoMensagem = "TEXTO" | "SISTEMA" | "CONTRAPROPOSTA";

export interface Mensagem {
  id: string;
  negociacaoId: string;
  remetenteId: string;
  texto: string;
  tipo: TipoMensagem;
  propostaId?: string;
  lida: boolean;
  createdAt: string;
}

export type CreateMensagemDto = Omit<Mensagem, 'id' | 'lida' | 'createdAt'>;
