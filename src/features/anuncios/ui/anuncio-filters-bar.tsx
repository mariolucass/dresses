"use client";

import type { AnuncioFilters } from "@entities/anuncio/model/anuncio.types";
import type {
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
import { Button } from "@shared/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useEffect } from "react";

const categorias = [
  ["ROUPAS_FEMININAS", "Feminino"],
  ["ROUPAS_MASCULINAS", "Masculino"],
  ["INFANTIL", "Infantil"],
  ["CALCADOS", "Calcados"],
  ["ACESSORIOS", "Acessorios"],
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
  ["NOVO", "Novo"],
  ["SEMINOVO", "Seminovo"],
  ["USADO_BOM", "Usado bom"],
  ["USADO_REGULAR", "Usado regular"],
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

  const hasFilters = Object.values(normalizedFilters).some(Boolean);

  return (
    <section
      className="rounded-lg border bg-card p-4 shadow-sm"
      data-testid="anuncio-filters-bar"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_repeat(5,minmax(120px,1fr))_auto]">
        <Input
          value={filters.busca ?? ""}
          onChange={(event) => setFilters({ busca: event.target.value || null })}
          placeholder="Buscar por peca, marca ou descricao"
          className="h-10"
        />

        <Select
          value={filters.categoria ?? "TODAS"}
          onValueChange={(value) =>
            setFilters({
              categoria:
                value === "TODAS" ? null : (value as CategoriaAnuncio),
            })
          }
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Categorias</SelectItem>
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
            setFilters({ tipo: value === "TODOS" ? null : (value as TipoAnuncio) })
          }
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Tipos</SelectItem>
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
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Condicao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Condicoes</SelectItem>
            {condicoes.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={filters.tamanho ?? ""}
          onChange={(event) => setFilters({ tamanho: event.target.value || null })}
          placeholder="Tamanho"
          className="h-10"
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            min={0}
            value={filters.precoMin ?? ""}
            onChange={(event) =>
              setFilters({
                precoMin: event.target.value ? Number(event.target.value) : null,
              })
            }
            placeholder="Min"
            className="h-10"
          />
          <Input
            type="number"
            min={0}
            value={filters.precoMax ?? ""}
            onChange={(event) =>
              setFilters({
                precoMax: event.target.value ? Number(event.target.value) : null,
              })
            }
            placeholder="Max"
            className="h-10"
          />
        </div>

        <Button
          type="button"
          variant={hasFilters ? "outline" : "secondary"}
          className="h-10 gap-2"
          onClick={() =>
            setFilters({
              busca: null,
              categoria: null,
              tipo: null,
              condicao: null,
              tamanho: null,
              precoMin: null,
              precoMax: null,
            })
          }
          disabled={!hasFilters}
        >
          {hasFilters ? (
            <X className="h-4 w-4" />
          ) : (
            <SlidersHorizontal className="h-4 w-4" />
          )}
          Limpar
        </Button>
      </div>
    </section>
  );
}
