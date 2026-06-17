import { z } from 'zod';

export const garagemFiltersSchema = z.object({
  status: z.enum(['DISPONIVEL', 'EM_NEGOCIACAO', 'FINALIZADO']).optional(),
});

export type GaragemFilters = z.infer<typeof garagemFiltersSchema>;
