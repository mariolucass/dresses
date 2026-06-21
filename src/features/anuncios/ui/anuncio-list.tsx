"use client";

import type { AnuncioFilters } from "@entities/anuncio/model/anuncio.types";
import { fetchAnuncios } from "@features/anuncios/api/fetch-anuncios";
import { AnuncioCard } from "@widgets/anuncio-card";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface AnuncioListProps {
  filters?: AnuncioFilters;
}

export function AnuncioList({ filters }: AnuncioListProps) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const onStorage = () => setVersion((value) => value + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const anuncios = useMemo(() => fetchAnuncios(filters), [filters, version]);

  if (anuncios.length === 0) {
    return (
      <div
        className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center"
        data-testid="anuncio-list"
      >
        <Search className="mb-4 h-10 w-10 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Nenhuma peca encontrada</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Ajuste os filtros ou publique um novo anuncio para movimentar o catalogo.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      data-testid="anuncio-list"
    >
      {anuncios.map((anuncio) => (
        <AnuncioCard key={anuncio.id} anuncio={anuncio} />
      ))}
    </div>
  );
}
