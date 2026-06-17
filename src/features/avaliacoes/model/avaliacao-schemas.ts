import { z } from 'zod';

export const avaliacaoSchema = z.object({
  negociacaoId: z.string(),
  avaliadoId: z.string(),
  nota: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ]),
  comentario: z.string().max(500).optional(),
});

export type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;
