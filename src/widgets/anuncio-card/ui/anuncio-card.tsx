"use client";

import type {
  Anuncio,
  TipoAnuncio,
} from "@entities/anuncio/model/anuncio.types";
import type { User } from "@entities/user/model/user.types";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import { cn } from "@shared/lib/utils";
import { Eye, Ruler, Shirt, Sparkles, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const TYPE_THEME: Record<
  TipoAnuncio,
  { label: string; text: string; bg: string; border: string }
> = {
  VENDA: theme.modeColor.sell,
  TROCA: theme.modeColor.swap,
  AMBOS: theme.modeColor.both,
};

const CONDITION_LABEL: Record<Anuncio["condicao"], string> = {
  NOVO: "Novo com etiqueta",
  SEMINOVO: "Ótimo estado",
  USADO_BOM: "Bom estado",
  USADO_REGULAR: "Com detalhes",
};

interface AnuncioCardProps {
  anuncio: Anuncio;
  className?: string;
}

export function AnuncioCard({ anuncio, className }: AnuncioCardProps) {
  const imageUrl = anuncio.fotos[0] ?? "/placeholder.svg";
  const typeTheme = TYPE_THEME[anuncio.tipo];
  const condition = CONDITION_LABEL[anuncio.condicao];
  const conditionTheme = theme.conditionColor[condition];

  const vendedor = useMemo(() => {
    return storage
      .getCollection<User>(STORAGE_KEYS.USERS)
      .find((u) => u.id === anuncio.userId);
  }, [anuncio.userId]);

  return (
    <Link
      href={ROUTES.ANUNCIO_DETALHE(anuncio.id)}
      className={cn(
        "group relative block overflow-hidden rounded-[10px] border outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      style={{
        background: theme.color.bgSurface,
        borderColor: theme.color.border,
        boxShadow: theme.shadow.card,
      }}
      data-testid="anuncio-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={anuncio.titulo}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: theme.gradient.cardImageOverlay }}
        />

        <span
          className="absolute left-3 top-3 rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md"
          style={{
            color: typeTheme.text,
            background: typeTheme.bg,
            borderColor: typeTheme.border,
          }}
        >
          {typeTheme.label}
        </span>

        <span
          className="absolute bottom-3 right-0 rounded-l-md border-y border-l px-3 py-2 font-display text-xl font-black uppercase leading-none backdrop-blur-md"
          style={{
            color: typeTheme.text,
            background: theme.color.bgSurface,
            borderColor: typeTheme.border,
            boxShadow: theme.shadow.button,
          }}
        >
          {anuncio.preco ? currency.format(anuncio.preco) : "Só troca"}
          {anuncio.valorVAT ? (
            <span className="ml-1.5 font-sans text-[9px] font-semibold tracking-widest text-muted-foreground">
              {anuncio.valorVAT} VAT
            </span>
          ) : null}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {anuncio.marca || "Garimpo sem marca"}
            </p>
            {vendedor && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <UserIcon className="size-3" />
                {vendedor.nome.split(" ")[0]}
              </span>
            )}
          </div>
          <h3 className="mt-1 line-clamp-2 min-h-12 font-display text-2xl font-bold uppercase leading-none transition-colors group-hover:text-primary">
            {anuncio.titulo}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium"
            style={{
              color: conditionTheme?.text,
              background: conditionTheme?.bg,
              borderColor: conditionTheme?.border,
            }}
          >
            <Sparkles className="size-3" />
            {condition}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Ruler className="size-3.5" />
            {anuncio.tamanho}
          </span>
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Shirt className="size-3.5 text-primary" />
            Ver detalhes
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Eye className="size-3.5" />
            {anuncio.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
