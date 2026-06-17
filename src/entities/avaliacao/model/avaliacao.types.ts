export type NotaAvaliacao = 1 | 2 | 3 | 4 | 5;

export interface Avaliacao {
  id: string;
  negociacaoId: string;
  avaliadorId: string;
  avaliadoId: string;
  nota: NotaAvaliacao;
  comentario?: string;
  createdAt: string;
}

export type CreateAvaliacaoDto = Omit<Avaliacao, 'id' | 'createdAt'>;
