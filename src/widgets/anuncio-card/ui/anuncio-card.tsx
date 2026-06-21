"use client";

import type { Anuncio } from "@entities/anuncio/model/anuncio.types";
import { Badge } from "@shared/components/ui/badge";
import { ROUTES } from "@shared/config/routes";
import { cn } from "@shared/lib/utils";
import { Eye, Heart, Ruler, Shirt } from "lucide-react";
import Link from "next/link";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const tipoLabel = {
  VENDA: "Venda",
  TROCA: "Troca",
  AMBOS: "Venda ou troca",
} as const;

interface AnuncioCardProps {
  anuncio: Anuncio;
  className?: string;
}

export function AnuncioCard({ anuncio, className }: AnuncioCardProps) {
  const imageUrl = anuncio.fotos[0] ?? "/placeholder.svg";

  return (
    <Link
      href={ROUTES.ANUNCIO_DETALHE(anuncio.id)}
      className={cn(
        "group block overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      data-testid="anuncio-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={anuncio.titulo}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          aria-label="Favoritar anuncio"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </span>
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground hover:bg-background">
          {tipoLabel[anuncio.tipo]}
        </Badge>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {anuncio.marca || "Marca nao informada"}
          </p>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5">
            {anuncio.titulo}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold">
              {anuncio.preco ? currency.format(anuncio.preco) : "Troca"}
            </p>
            {anuncio.valorVAT ? (
              <p className="text-xs text-muted-foreground">{anuncio.valorVAT} VAT</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5" />
              {anuncio.tamanho}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {anuncio.views}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shirt className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{anuncio.condicao.replace("_", " ")}</span>
        </div>
      </div>
    </Link>
  );
}
