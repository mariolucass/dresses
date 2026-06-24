import { z } from "zod";

export const anuncioSchema = z
  .object({
    titulo: z
      .string()
      .min(5, "Titulo muito curto.")
      .max(80, "Titulo muito longo."),
    descricao: z.string().min(10, "Descricao muito curta.").max(1000),
    marca: z.string().max(60, "Marca muito longa.").optional(),
    fotos: z.array(z.string()).min(1, "Adicione ao menos uma foto.").max(5),
    preco: z.coerce.number().positive().optional(),
    valorVAT: z.coerce.number().positive().optional(),
    tipo: z.enum(["VENDA", "TROCA", "AMBOS"]),
    categoria: z.enum([
      "ROUPAS_FEMININAS",
      "ROUPAS_MASCULINAS",
      "INFANTIL",
      "CALCADOS",
      "ACESSORIOS",
      "BOLSAS",
      "ESPORTES",
      "FESTA",
      "OUTROS",
    ]),
    condicao: z.enum(["NOVO", "SEMINOVO", "USADO_BOM", "USADO_REGULAR"]),
    tamanho: z.string().min(1, "Informe o tamanho."),
  })
  .refine(
    (data) => {
      if (data.tipo === "VENDA" || data.tipo === "AMBOS") return !!data.preco;
      return true;
    },
    { message: "Informe o preco para anuncios de venda.", path: ["preco"] },
  )
  .refine(
    (data) => {
      if (data.tipo === "TROCA" || data.tipo === "AMBOS")
        return !!data.valorVAT;
      return true;
    },
    { message: "Informe o valor VAT para trocas.", path: ["valorVAT"] },
  );

export type AnuncioFormData = z.infer<typeof anuncioSchema>;
