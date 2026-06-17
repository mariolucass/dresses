import { z } from "zod";

export const mensagemSchema = z.object({
  negociacaoId: z.string(),
  remetenteId: z.string(),
  texto: z.string().min(1, "A mensagem não pode ser vazia.").max(500),
  tipo: z.enum(["TEXTO", "SISTEMA"]).default("TEXTO"),
});

export type MensagemFormData = z.infer<typeof mensagemSchema>;
