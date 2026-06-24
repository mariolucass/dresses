"use client";

import type { Anuncio } from "@entities/anuncio";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";
import { Eye, Pencil, Shirt, Trash2 } from "lucide-react";
import Link from "next/link";

const STATUS = {
  DISPONIVEL: ["Disponível", theme.color.success],
  EM_NEGOCIACAO: ["Em negociação", theme.color.warning],
  FINALIZADO: ["Finalizado", theme.color.textMuted],
} as const;

export function GaragemItemCard({
  anuncio,
  onEdit,
  onDelete,
}: {
  anuncio: Anuncio;
  onEdit: (anuncio: Anuncio) => void;
  onDelete: (anuncio: Anuncio) => void;
}) {
  const [status, color] = STATUS[anuncio.status];
  return (
    <article
      className="group overflow-hidden rounded-2xl border"
      style={{
        background: theme.color.bgSurface,
        borderColor: theme.color.border,
        boxShadow: theme.shadow.card,
      }}
      data-testid="garagem-item-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--theme-surface2)]">
        {anuncio.fotos[0] ? (
          <img
            src={anuncio.fotos[0]}
            alt={anuncio.titulo}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Shirt className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
        )}
        <span
          className="absolute left-3 top-3 rounded-full border border-[var(--theme-border-strong)] bg-[var(--theme-bg-overlay)] text-[var(--theme-text-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur"
          style={{ color, borderColor: `${color}66` }}
        >
          {status}
        </span>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {anuncio.categoria.replaceAll("_", " ")} · {anuncio.tamanho}
        </p>
        <h2 className="mt-1 truncate font-display text-2xl font-black uppercase">
          {anuncio.titulo}
        </h2>
        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="font-display text-xl font-black text-primary">
            {anuncio.valorVAT
              ? `${anuncio.valorVAT} VAT`
              : anuncio.preco
                ? `R$ ${anuncio.preco.toFixed(2).replace(".", ",")}`
                : "Troca"}
          </p>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Eye className="size-3" /> {anuncio.views}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button asChild variant="outline" size="sm" aria-label="Ver anúncio">
            <Link href={ROUTES.ANUNCIO_DETALHE(anuncio.id)}>
              <Eye className="size-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(anuncio)}
            disabled={anuncio.status === "FINALIZADO"}
            aria-label="Editar anúncio"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(anuncio)}
            disabled={anuncio.status !== "DISPONIVEL"}
            className="hover:border-destructive hover:text-destructive"
            aria-label="Excluir anúncio"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
