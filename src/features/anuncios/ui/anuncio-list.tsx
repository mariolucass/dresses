"use client";

import type { AnuncioFilters } from "@entities/anuncio/model/anuncio.types";
import { fetchAnuncios } from "@features/anuncios/api/fetch-anuncios";
import theme from "@shared/config/theme";
import { AnuncioCard } from "@widgets/anuncio-card";
import { Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface AnuncioListProps {
  filters?: AnuncioFilters;
}

export function AnuncioList({ filters }: AnuncioListProps) {
  const [version, setVersion] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const onStorage = () => setVersion((value) => value + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const anuncios = useMemo(() => isMounted ? fetchAnuncios(filters) : [], [filters, version, isMounted]);

  if (!isMounted) {
    return <div className="min-h-80 w-full animate-pulse rounded-2xl bg-muted/20" />;
  }

  if (anuncios.length === 0) {
    return (
      <div
        className="relative flex min-h-80 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed p-8 text-center"
        style={{
          background: theme.gradient.section,
          borderColor: theme.color.borderStrong,
        }}
        data-testid="anuncio-list"
      >
        <div className="absolute inset-0" style={theme.texture.dots()} />
        <div className="relative flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Search className="size-6" />
        </div>
        <span className="relative mt-5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
          <Sparkles className="size-3" />
          Nada por aqui ainda
        </span>
        <h2 className="relative mt-2 font-display text-3xl font-black uppercase">
          Nenhuma peça encontrada
        </h2>
        <p className="relative mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Ajuste os filtros ou publique uma nova peça para movimentar o
          catálogo.
        </p>
      </div>
    );
  }

  return (
    <section data-testid="anuncio-list">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            {anuncios.length}
          </span>{" "}
          {anuncios.length === 1 ? "peça encontrada" : "peças encontradas"}
        </p>
        <div
          className="h-px flex-1"
          style={{ background: theme.gradient.accentLine }}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {anuncios.map((anuncio) => (
          <AnuncioCard key={anuncio.id} anuncio={anuncio} />
        ))}
      </div>
    </section>
  );
}
