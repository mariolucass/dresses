import { z } from 'zod';

export const anuncioSchema = z.object({
  titulo: z.string().min(5, 'Título muito curto.').max(80, 'Título muito longo.'),
  descricao: z.string().min(10, 'Descrição muito curta.').max(1000),
  fotos: z.array(z.string()).min(1, 'Adicione ao menos uma foto.').max(5),
  preco: z.coerce.number().positive().optional(),
  valorVAT: z.coerce.number().positive().optional(),
  tipo: z.enum(['VENDA', 'TROCA', 'AMBOS']),
  categoria: z.enum([
    'ROUPAS_FEMININAS', 'ROUPAS_MASCULINAS', 'INFANTIL',
    'CALCADOS', 'ACESSORIOS', 'BOLSAS', 'ESPORTES', 'FESTA', 'OUTROS',
  ]),
  condicao: z.enum(['NOVO', 'SEMINOVO', 'USADO_BOM', 'USADO_REGULAR']),
  tamanho: z.string().min(1, 'Informe o tamanho.'),
}).refine(
  (data) => {
    if (data.tipo === 'VENDA' || data.tipo === 'AMBOS') return !!data.preco;
    return true;
  },
  { message: 'Informe o preço para anúncios de venda.', path: ['preco'] },
).refine(
  (data) => {
    if (data.tipo === 'TROCA' || data.tipo === 'AMBOS') return !!data.valorVAT;
    return true;
  },
  { message: 'Informe o valor VAT para trocas.', path: ['valorVAT'] },
);

export type AnuncioFormData = z.infer<typeof anuncioSchema>;
