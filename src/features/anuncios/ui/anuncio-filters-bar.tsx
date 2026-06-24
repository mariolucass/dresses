"use client";

import type {
  AnuncioFilters,
  CategoriaAnuncio,
  CondicaoItem,
  TipoAnuncio,
} from "@entities/anuncio/model/anuncio.types";
import { anuncioFilterParsers } from "@features/anuncios/model/anuncio-filters";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useEffect } from "react";

const categorias = [
  ["ROUPAS_FEMININAS", "Feminino"],
  ["ROUPAS_MASCULINAS", "Masculino"],
  ["INFANTIL", "Infantil"],
  ["CALCADOS", "Calçados"],
  ["ACESSORIOS", "Acessórios"],
  ["BOLSAS", "Bolsas"],
  ["ESPORTES", "Esportes"],
  ["FESTA", "Festa"],
  ["OUTROS", "Outros"],
] as const;

const tipos = [
  ["VENDA", "Venda"],
  ["TROCA", "Troca"],
  ["AMBOS", "Venda ou troca"],
] as const;

const condicoes = [
  ["NOVO", "Novo com etiqueta"],
  ["SEMINOVO", "Ótimo estado"],
  ["USADO_BOM", "Bom estado"],
  ["USADO_REGULAR", "Com detalhes"],
] as const;

interface AnuncioFiltersBarProps {
  onFiltersChange?: (filters: AnuncioFilters) => void;
}

export function AnuncioFiltersBar({ onFiltersChange }: AnuncioFiltersBarProps) {
  const [filters, setFilters] = useQueryStates(anuncioFilterParsers, {
    shallow: false,
  });

  const normalizedFilters: AnuncioFilters = {
    busca: filters.busca || undefined,
    categoria: filters.categoria ?? undefined,
    tipo: filters.tipo ?? undefined,
    condicao: filters.condicao ?? undefined,
    tamanho: filters.tamanho || undefined,
    precoMin: filters.precoMin ?? undefined,
    precoMax: filters.precoMax ?? undefined,
  };

  useEffect(() => {
    onFiltersChange?.(normalizedFilters);
  }, [
    normalizedFilters.busca,
    normalizedFilters.categoria,
    normalizedFilters.condicao,
    normalizedFilters.precoMax,
    normalizedFilters.precoMin,
    normalizedFilters.tamanho,
    normalizedFilters.tipo,
    onFiltersChange,
  ]);

  const activeFilters = Object.values(normalizedFilters).filter(
    (value) => value !== undefined && value !== "",
  ).length;
  const hasFilters = activeFilters > 0;

  const clearFilters = () =>
    setFilters({
      busca: null,
      categoria: null,
      tipo: null,
      condicao: null,
      tamanho: null,
      precoMin: null,
      precoMax: null,
    });

  return (
    <section
      className="relative overflow-hidden rounded-2xl border p-4 sm:p-5"
      style={{
        background: theme.gradient.section,
        borderColor: theme.color.border,
        boxShadow: theme.shadow.card,
      }}
      data-testid="anuncio-filters-bar"
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: theme.gradient.accentLine }}
      />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SlidersHorizontal className="size-4" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold uppercase leading-none">
              Filtrar garimpo
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Refine por estilo, estado e valor
            </p>
          </div>
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-primary"
            onClick={clearFilters}
          >
            <X className="size-3.5" />
            Limpar {activeFilters}
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-12">
        <div className="relative md:col-span-2 xl:col-span-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.busca ?? ""}
            onChange={(event) =>
              setFilters({ busca: event.target.value || null })
            }
            placeholder="Buscar peça, marca ou descrição"
            className="h-10 bg-background/60 pl-9"
            aria-label="Buscar anúncios"
          />
        </div>

        <Select
          value={filters.categoria ?? "TODAS"}
          onValueChange={(value) =>
            setFilters({
              categoria: value === "TODAS" ? null : (value as CategoriaAnuncio),
            })
          }
        >
          <SelectTrigger className="h-10 bg-background/60 xl:col-span-2">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Todas as categorias</SelectItem>
            {categorias.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.tipo ?? "TODOS"}
          onValueChange={(value) =>
            setFilters({
              tipo: value === "TODOS" ? null : (value as TipoAnuncio),
            })
          }
        >
          <SelectTrigger className="h-10 bg-background/60 xl:col-span-2">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todas as modalidades</SelectItem>
            {tipos.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.condicao ?? "TODAS"}
          onValueChange={(value) =>
            setFilters({
              condicao: value === "TODAS" ? null : (value as CondicaoItem),
            })
          }
        >
          <SelectTrigger className="h-10 bg-background/60 xl:col-span-2">
            <SelectValue placeholder="Condição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Todas as condições</SelectItem>
            {condicoes.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={filters.tamanho ?? ""}
          onChange={(event) =>
            setFilters({ tamanho: event.target.value || null })
          }
          placeholder="Tamanho"
          className="h-10 bg-background/60 xl:col-span-2"
          aria-label="Filtrar por tamanho"
        />

        <div className="grid grid-cols-2 gap-3 md:col-span-2 xl:col-span-4 xl:col-start-9">
          <Input
            type="number"
            min={0}
            value={filters.precoMin ?? ""}
            onChange={(event) =>
              setFilters({
                precoMin: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
            placeholder="Preço mínimo"
            className="h-10 bg-background/60"
            aria-label="Preço mínimo"
          />
          <Input
            type="number"
            min={0}
            value={filters.precoMax ?? ""}
            onChange={(event) =>
              setFilters({
                precoMax: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
            placeholder="Preço máximo"
            className="h-10 bg-background/60"
            aria-label="Preço máximo"
          />
        </div>
      </div>
    </section>
  );
}
