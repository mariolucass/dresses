"use client";

import { fetchAnuncioById } from "@features/anuncios/api/fetch-anuncios";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/ui/button";
import { ROUTES } from "@shared/config/routes";
import { ArrowLeft, Eye, HandCoins, Ruler, Share2, Shirt } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const categoryLabel: Record<string, string> = {
  ROUPAS_FEMININAS: "Roupas femininas",
  ROUPAS_MASCULINAS: "Roupas masculinas",
  INFANTIL: "Infantil",
  CALCADOS: "Calcados",
  ACESSORIOS: "Acessorios",
  BOLSAS: "Bolsas",
  ESPORTES: "Esportes",
  FESTA: "Festa",
  OUTROS: "Outros",
};

interface AnuncioDetailProps {
  id: string;
}

export function AnuncioDetail({ id }: AnuncioDetailProps) {
  const anuncio = useMemo(() => fetchAnuncioById(id), [id]);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  if (!anuncio) {
    return (
      <div className="mx-auto flex min-h-96 max-w-xl flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold">Anuncio nao encontrado</h1>
        <p className="mt-2 text-muted-foreground">
          A peca pode ter sido removida ou finalizada.
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.ANUNCIOS}>Voltar ao catalogo</Link>
        </Button>
      </div>
    );
  }

  const photos = anuncio.fotos.length ? anuncio.fotos : ["/placeholder.svg"];

  return (
    <article className="space-y-6" data-testid="anuncio-detail">
      <Button asChild variant="ghost" className="gap-2 px-0">
        <Link href={ROUTES.ANUNCIOS}>
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catalogo
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-muted">
            <img
              src={photos[selectedPhoto]}
              alt={anuncio.titulo}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          {photos.length > 1 ? (
            <div className="grid grid-cols-5 gap-3">
              {photos.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  className="overflow-hidden rounded-md border data-[active=true]:ring-2 data-[active=true]:ring-primary"
                  data-active={selectedPhoto === index}
                  onClick={() => setSelectedPhoto(index)}
                >
                  <img
                    src={photo}
                    alt={`${anuncio.titulo} foto ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{anuncio.tipo === "AMBOS" ? "Venda ou troca" : anuncio.tipo}</Badge>
              <Badge variant="outline">{categoryLabel[anuncio.categoria]}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {anuncio.marca || "Marca nao informada"}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{anuncio.titulo}</h1>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <p className="text-3xl font-bold">
                {anuncio.preco ? currency.format(anuncio.preco) : "Disponivel para troca"}
              </p>
              {anuncio.valorVAT ? (
                <p className="pb-1 text-sm font-medium text-muted-foreground">
                  {anuncio.valorVAT} VAT em trocas
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-4">
              <Ruler className="mb-2 h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Tamanho</p>
              <p className="font-semibold">{anuncio.tamanho}</p>
            </div>
            <div className="rounded-lg border p-4">
              <Shirt className="mb-2 h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Condicao</p>
              <p className="font-semibold">{anuncio.condicao.replace("_", " ")}</p>
            </div>
            <div className="rounded-lg border p-4">
              <Eye className="mb-2 h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Visitas</p>
              <p className="font-semibold">{anuncio.views}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Descricao</h2>
            <p className="leading-7 text-muted-foreground">{anuncio.descricao}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="flex-1 gap-2">
              <Link href={ROUTES.NEGOCIACOES}>
                <HandCoins className="h-4 w-4" />
                Fazer Proposta
              </Link>
            </Button>
            <Button type="button" variant="outline" size="lg" className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </section>
      </div>
    </article>
  );
}
