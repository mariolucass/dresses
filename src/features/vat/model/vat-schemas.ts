import { z } from "zod";

export const vatTransacaoSchema = z.object({
  userId: z.string(),
  tipo: z.enum(["CREDITO", "DEBITO"]),
  valor: z.number().positive("O valor deve ser positivo."),
  descricao: z.string().min(3),
  motivo: z.enum([
    "CADASTRO_BONUS",
    "VENDA_CONCLUIDA",
    "TROCA_CONCLUIDA",
    "PROPOSTA_ACEITA",
    "AJUSTE_MANUAL",
  ]),
  negociacaoId: z.string().optional(),
});

export type VatTransacaoFormData = z.infer<typeof vatTransacaoSchema>;
