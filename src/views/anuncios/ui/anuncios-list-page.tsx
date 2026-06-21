"use client";

import type { AnuncioFilters } from "@entities/anuncio/model/anuncio.types";
import { AnuncioFiltersBar } from "@features/anuncios/ui/anuncio-filters-bar";
import { AnuncioList } from "@features/anuncios/ui/anuncio-list";
import { ROUTES } from "@shared/config/routes";
import { Button } from "@shared/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

export function AnunciosListPage() {
  const [filters, setFilters] = useState<AnuncioFilters>({});
  const handleFiltersChange = useCallback((nextFilters: AnuncioFilters) => {
    setFilters(nextFilters);
  }, []);

  return (
    <div className="space-y-6" data-testid="anuncios-list-page">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Catalogo</p>
          <h1 className="text-3xl font-bold tracking-tight">Anuncios do brecho</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Garimpe pecas disponiveis para compra, troca ou proposta em VAT.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href={ROUTES.ANUNCIO_NOVO}>
            <Plus className="h-4 w-4" />
            Novo anuncio
          </Link>
        </Button>
      </header>

      <AnuncioFiltersBar onFiltersChange={handleFiltersChange} />
      <AnuncioList filters={filters} />
    </div>
  );
}
