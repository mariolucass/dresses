import { z } from "zod";

export const propostaSchema = z
  .object({
    anuncioId: z.string(),
    vendedorId: z.string(),
    tipo: z.enum(["COMPRA", "TROCA", "MISTA"]),
    valorOfertado: z.coerce.number().positive().optional(),
    vatOfertado: z.coerce.number().positive().optional(),
    itensOfertados: z.array(z.object({ anuncioId: z.string() })).default([]),
    mensagemInicial: z.string().max(500).optional(),
  })
  .refine((d) => d.tipo !== "COMPRA" || !!d.valorOfertado, {
    message: "Informe o valor da oferta.",
    path: ["valorOfertado"],
  })
  .refine((d) => d.tipo !== "TROCA" || d.itensOfertados.length > 0, {
    message: "Selecione ao menos um item para troca.",
    path: ["itensOfertados"],
  });

export const contrapropostaSchema = propostaSchema;

export type PropostaFormData = z.infer<typeof propostaSchema>;
