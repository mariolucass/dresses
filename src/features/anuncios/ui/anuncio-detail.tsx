"use client";

import type {
  Anuncio,
  TipoAnuncio,
} from "@entities/anuncio/model/anuncio.types";
import type { User } from "@entities/user/model/user.types";
import { fetchAnuncioById } from "@features/anuncios/api/fetch-anuncios";
import { PropostaForm } from "@features/negociacao";
import { Badge } from "@shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import {
  ArrowLeft,
  Check,
  Eye,
  HandCoins,
  Ruler,
  Share2,
  Shirt,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const CATEGORY_LABEL: Record<string, string> = {
  ROUPAS_FEMININAS: "Roupas femininas",
  ROUPAS_MASCULINAS: "Roupas masculinas",
  INFANTIL: "Infantil",
  CALCADOS: "Calçados",
  ACESSORIOS: "Acessórios",
  BOLSAS: "Bolsas",
  ESPORTES: "Esportes",
  FESTA: "Festa",
  OUTROS: "Outros",
};

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

interface AnuncioDetailProps {
  id: string;
}

export function AnuncioDetail({ id }: AnuncioDetailProps) {
  const { session } = useAuth();
  const router = useRouter();
  const anuncio = useMemo(() => fetchAnuncioById(id), [id]);
  const vendedor = useMemo(() => {
    if (!anuncio) return null;
    return storage
      .getCollection<User>(STORAGE_KEYS.USERS)
      .find((u) => u.id === anuncio.userId);
  }, [anuncio]);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [shared, setShared] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  useEffect(() => {
    setProposalSent(false);
  }, [session?.userId]);

  if (!anuncio) {
    return (
      <div
        className="relative mx-auto flex min-h-96 max-w-xl flex-col items-center justify-center overflow-hidden rounded-2xl border p-8 text-center"
        style={{
          background: theme.gradient.section,
          borderColor: theme.color.border,
          boxShadow: theme.shadow.card,
        }}
      >
        <div className="absolute inset-0" style={theme.texture.dots()} />
        <Shirt className="relative size-10 text-primary" />
        <h1 className="relative mt-4 font-display text-4xl font-black uppercase">
          Anúncio não encontrado
        </h1>
        <p className="relative mt-2 text-sm text-muted-foreground">
          A peça pode ter sido removida ou a negociação já foi finalizada.
        </p>
        <Button asChild className="relative mt-6">
          <Link href={ROUTES.ANUNCIOS}>Voltar ao catálogo</Link>
        </Button>
      </div>
    );
  }

  const photos = anuncio.fotos.length ? anuncio.fotos : ["/placeholder.svg"];
  const typeTheme = TYPE_THEME[anuncio.tipo];
  const condition = CONDITION_LABEL[anuncio.condicao];
  const conditionTheme = theme.conditionColor[condition];
  const isOwnAnuncio = session?.userId === anuncio.userId;

  async function handleShare() {
    const shareData = {
      title: anuncio?.titulo,
      text: `Confira ${anuncio?.titulo} no Desapeguei`,
      url: window.location.href,
    };

    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      // O usuário pode cancelar o compartilhamento sem gerar feedback de erro.
    }
  }

  return (
    <article className="space-y-6" data-testid="anuncio-detail">
      <Button
        asChild
        variant="ghost"
        className="gap-2 px-0 text-muted-foreground hover:bg-transparent hover:text-primary"
      >
        <Link href={ROUTES.ANUNCIOS}>
          <ArrowLeft className="size-4" />
          Voltar ao catálogo
        </Link>
      </Button>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <section className="space-y-3">
          <div
            className="relative overflow-hidden rounded-2xl border"
            style={{
              background: theme.color.bgSurface,
              borderColor: theme.color.border,
              boxShadow: theme.shadow.card,
            }}
          >
            <img
              src={photos[selectedPhoto]}
              alt={anuncio.titulo}
              className="aspect-[4/5] w-full object-cover"
              fetchPriority="high"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
              style={{ background: theme.gradient.cardImageOverlay }}
            />
            <span
              className="absolute left-4 top-4 rounded-md border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md"
              style={{
                color: typeTheme.text,
                background: typeTheme.bg,
                borderColor: typeTheme.border,
              }}
            >
              {typeTheme.label}
            </span>
          </div>

          {photos.length > 1 ? (
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {photos.map((photo, index) => (
                <button
                  key={`${photo}-${index}`}
                  type="button"
                  className="overflow-hidden rounded-lg border opacity-60 transition-all hover:opacity-100 data-[active=true]:opacity-100 data-[active=true]:ring-2 data-[active=true]:ring-primary"
                  style={{ borderColor: theme.color.border }}
                  data-active={selectedPhoto === index}
                  onClick={() => setSelectedPhoto(index)}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <img
                    src={photo}
                    alt={`${anuncio.titulo}, foto ${index + 1}`}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section
          className="relative space-y-6 overflow-hidden rounded-2xl border p-5 sm:p-7 lg:sticky lg:top-24"
          style={{
            background: theme.gradient.section,
            borderColor: theme.color.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-0.5"
            style={{ background: theme.gradient.accentLineFull }}
          />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-widest"
              >
                {CATEGORY_LABEL[anuncio.categoria]}
              </Badge>
              <span
                className="rounded-md border px-2.5 py-1 text-[10px] font-medium"
                style={{
                  color: conditionTheme?.text,
                  background: conditionTheme?.bg,
                  borderColor: conditionTheme?.border,
                }}
              >
                {condition}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {anuncio.marca || "Garimpo sem marca"}
                </p>
                {vendedor && (
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                    <UserIcon className="size-3" />
                    Vendido por: {vendedor.nome.split(" ")[0]}
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl">
                {anuncio.titulo}
              </h1>
            </div>

            <div
              className="rounded-[10px] border p-4"
              style={{
                background: typeTheme.bg,
                borderColor: typeTheme.border,
              }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Valor da peça
              </span>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p
                  className="font-display text-4xl font-black leading-none"
                  style={{ color: typeTheme.text }}
                >
                  {anuncio.preco
                    ? currency.format(anuncio.preco)
                    : "Disponível para troca"}
                </p>
                {anuncio.valorVAT ? (
                  <p className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" />
                    {anuncio.valorVAT} VAT
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: Ruler, label: "Tamanho", value: anuncio.tamanho },
              { icon: Shirt, label: "Condição", value: condition },
              { icon: Eye, label: "Visitas", value: String(anuncio.views) },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-[10px] border p-3"
                style={{
                  background: theme.color.bgSurface2,
                  borderColor: theme.color.border,
                }}
              >
                <item.icon className="mb-2 size-4 text-primary" />
                <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-xs font-semibold sm:text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-5">
            <h2 className="font-display text-2xl font-bold uppercase">
              Sobre esta peça
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {anuncio.descricao}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {!isOwnAnuncio && (
              <Button
                type="button"
                size="lg"
                className="flex-1 gap-2 font-semibold"
                onClick={() => setProposalOpen(true)}
                disabled={proposalSent || anuncio.status !== "DISPONIVEL"}
              >
                <HandCoins className="size-4" />
                {proposalSent ? "Proposta enviada" : "Fazer proposta"}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className={!isOwnAnuncio ? "gap-2" : "flex-1 gap-2"}
              onClick={handleShare}
            >
              {shared ? (
                <Check className="size-4 text-primary" />
              ) : (
                <Share2 className="size-4" />
              )}
              {shared ? "Link copiado" : "Compartilhar"}
            </Button>
          </div>
        </section>
      </div>
      <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{
            background: theme.color.bgSurface,
            borderColor: theme.color.border,
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-black uppercase">
              Fazer proposta
            </DialogTitle>
            <DialogDescription>
              Monte uma oferta por {anuncio.titulo}. O vendedor poderá aceitar,
              recusar ou enviar uma contraproposta.
            </DialogDescription>
          </DialogHeader>
          <PropostaForm
            anuncio={anuncio}
            onSuccess={(proposta) => {
              setProposalSent(true);
              setProposalOpen(false);
              router.push(ROUTES.NEGOCIACAO_DETALHE(proposta.id));
            }}
          />
        </DialogContent>
      </Dialog>
    </article>
  );
}
