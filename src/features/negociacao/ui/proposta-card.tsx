"use client";

import type { Proposta } from "@entities/proposta";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";
import { ArrowRight, Coins, Repeat2, Shirt } from "lucide-react";
import Link from "next/link";
import { getNegociacaoRelations } from "../api/negociacao-actions";

const STATUS = {
  PENDENTE: ["Aguardando resposta", theme.color.warning],
  ACEITA: ["Proposta aceita", theme.color.success],
  RECUSADA: ["Recusada", theme.color.error],
  CONTRAPROPOSTA: ["Contraproposta", theme.color.swap],
  CANCELADA: ["Cancelada", theme.color.textMuted],
  SUBSTITUIDA: ["Substituída", theme.color.textMuted],
  CONCLUIDA: ["Concluída", theme.color.success],
} as const;

export function PropostaCard({
  proposta,
  currentUserId,
}: {
  proposta: Proposta;
  currentUserId: string;
}) {
  const { anuncio, comprador, vendedor } = getNegociacaoRelations(proposta);
  const counterpart =
    proposta.compradorId === currentUserId ? vendedor : comprador;
  const [statusLabel, statusColor] = STATUS[proposta.status];

  return (
    <article
      className="group overflow-hidden rounded-2xl border transition duration-200 hover:-translate-y-0.5"
      style={{
        background: theme.gradient.section,
        borderColor: theme.color.border,
        boxShadow: theme.shadow.card,
      }}
      data-testid="proposta-card"
    >
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-[var(--theme-surface2)] sm:size-28">
          {anuncio?.fotos[0] ? (
            <img
              src={anuncio.fotos[0]}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <Shirt className="m-auto mt-8 size-8 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Negociando com {counterpart?.nome ?? "usuário"}
              </p>
              <h2 className="mt-1 truncate font-display text-2xl font-black uppercase">
                {anuncio?.titulo ?? "Anúncio removido"}
              </h2>
            </div>
            <span
              className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ color: statusColor, borderColor: `${statusColor}55` }}
            >
              {statusLabel}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {Number(proposta.vatOfertado) > 0 && (
              <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary">
                <Coins className="size-3.5" /> {proposta.vatOfertado} VAT
              </span>
            )}
            {proposta.itensOfertados.length > 0 && (
              <span
                className="flex items-center gap-1 rounded-md px-2 py-1"
                style={{
                  background: theme.color.swapBg,
                  color: theme.color.swap,
                }}
              >
                <Repeat2 className="size-3.5" />{" "}
                {proposta.itensOfertados.length} peça(s) oferecida(s)
              </span>
            )}
            {(proposta.itensDesejados?.length ?? 0) > 0 && (
              <span
                className="flex items-center gap-1 rounded-md px-2 py-1"
                style={{
                  background: theme.color.bgSurface2,
                  color: theme.color.textSecondary,
                  border: `1px solid ${theme.color.border}`,
                }}
              >
                + {proposta.itensDesejados!.length} peça(s) desejada(s)
              </span>
            )}
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mt-3 -ml-3 gap-2 text-primary"
          >
            <Link href={ROUTES.NEGOCIACAO_DETALHE(proposta.id)}>
              Abrir negociação <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
