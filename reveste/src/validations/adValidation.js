import { z } from 'zod';

export const adSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
  categoria: z.enum(['camisa', 'calca', 'casaco', 'calcado', 'acessorio', 'outro'], {
    errorMap: () => ({ message: 'Selecione uma categoria válida' }),
  }),
  tamanho: z.enum(['PP', 'P', 'M', 'G', 'GG'], {
    errorMap: () => ({ message: 'Selecione um tamanho válido' }),
  }),
  conservacao: z.enum(['Novo', 'Bom', 'Regular', 'Marcas de uso'], {
    errorMap: () => ({ message: 'Selecione o estado de conservação' }),
  }),
  foto: z.string().url('Insira uma URL de imagem válida'),
  modalidade: z.enum(['Venda', 'Troca', 'Ambos'], {
    errorMap: () => ({ message: 'Selecione uma modalidade' }),
  }),
  vats: z.preprocess(
    (val) => Number(val),
    z.number().gt(0, 'O valor em VATs deve ser maior que 0')
  ),
});