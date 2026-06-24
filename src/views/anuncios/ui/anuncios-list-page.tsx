"use client";

import type { AnuncioFilters } from "@entities/anuncio/model/anuncio.types";
import { AnuncioFiltersBar } from "@features/anuncios/ui/anuncio-filters-bar";
import { AnuncioList } from "@features/anuncios/ui/anuncio-list";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@shared/config/animation";

export function AnunciosListPage() {
  const [filters, setFilters] = useState<AnuncioFilters>({});
  const handleFiltersChange = useCallback((nextFilters: AnuncioFilters) => {
    setFilters(nextFilters);
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-7"
      data-testid="anuncios-list-page"
    >
      <motion.header
        variants={staggerItem}
        className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: theme.gradient.hero }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={theme.texture.dots(theme.brand.white, 0.025)}
        />
        <div
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: theme.gradient.accentLineFull }}
        />
        <div>
          <p className="relative inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="size-3" />
            Garimpo aberto
          </p>
          <h1 className="relative mt-2 font-display text-5xl font-black uppercase leading-[0.92] sm:text-6xl">
            Peças com
            <span className="text-primary"> história</span>
          </h1>
          <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Garimpe peças disponíveis para compra, troca ou proposta em VAT.
          </p>
        </div>
        <Button asChild size="lg" className="relative gap-2 font-semibold">
          <Link href={ROUTES.ANUNCIO_NOVO}>
            <Plus className="size-4" />
            Novo anúncio
          </Link>
        </Button>
      </motion.header>

      <motion.div variants={staggerItem}>
        <AnuncioFiltersBar onFiltersChange={handleFiltersChange} />
      </motion.div>
      <motion.div variants={staggerItem}>
        <AnuncioList filters={filters} />
      </motion.div>
    </motion.div>
  );
}
