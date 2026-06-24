import type { Anuncio } from "@entities/anuncio/model/anuncio.types";

export type TipoProposta = "COMPRA" | "TROCA" | "MISTA";

export type StatusProposta =
  | "PENDENTE"
  | "ACEITA"
  | "RECUSADA"
  | "CONTRAPROPOSTA"
  | "CANCELADA"
  | "SUBSTITUIDA"
  | "CONCLUIDA";

export interface ItemOfertado {
  anuncioId: string;
  anuncio?: Anuncio; // join opcional
}

export interface Proposta {
  id: string;
  anuncioId: string; // anúncio alvo da proposta
  compradorId: string;
  vendedorId: string;
  /** Participante que enviou esta versão da proposta. */
  autorId?: string;
  tipo: TipoProposta;
  valorOfertado?: number; // para propostas de COMPRA ou MISTA
  vatOfertado?: number; // valor VAT ofertado
  itensOfertados: ItemOfertado[]; // para propostas de TROCA
  itensDesejados?: ItemOfertado[]; // itens extras desejados do vendedor, além do anuncioId principal
  mensagemInicial?: string;
  status: StatusProposta;
  contrapropostaRef?: string; // ID da proposta pai se for contraproposta
  createdAt: string;
  updatedAt: string;
}

export type CreatePropostaDto = Omit<
  Proposta,
  "id" | "status" | "createdAt" | "updatedAt" | "autorId"
>;

export type RespostaProposta = {
  propostaId: string;
  actorId: string;
  resposta: "ACEITA" | "RECUSADA" | "CONTRAPROPOSTA";
  contrapropostaData?: Partial<CreatePropostaDto>;
};

export interface Negociacao {
  id: string; // mesmo ID da proposta inicial
  proposta: Proposta;
  historico: Proposta[]; // contrapropostas
  chatId: string;
}
