"use client";

import type { Avaliacao } from "@entities/avaliacao";
import type { User } from "@entities/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shared/components/ui/avatar";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { ArrowRight, MessageSquareText } from "lucide-react";
import Link from "next/link";

import { AvaliacaoStars } from "./avaliacao-stars";

interface AvaliacaoCardProps {
  avaliacao: Avaliacao;
  avaliador?: User | null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AvaliacaoCard({ avaliacao, avaliador }: AvaliacaoCardProps) {
  const name = avaliador?.nome ?? "Membro da comunidade";

  return (
    <Link
      href={ROUTES.PERFIL_AVALIACAO_DETALHE(avaliacao.id)}
      className="group block rounded-xl border p-5 transition-all hover:-translate-y-0.5"
      style={{
        background: theme.color.bgSurface,
        borderColor: theme.color.border,
        boxShadow: theme.shadow.card,
      }}
      data-testid="avaliacao-card"
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-10 border">
          <AvatarImage src={avaliador?.avatar} alt={name} />
          <AvatarFallback className="text-xs font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDate(avaliacao.createdAt)}
              </p>
            </div>
            <AvaliacaoStars value={avaliacao.nota} readOnly size="sm" />
          </div>

          <div className="mt-4 flex items-start gap-2">
            <MessageSquareText className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {avaliacao.comentario || "Avaliação enviada sem comentário."}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Negociação {avaliacao.negociacaoId}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Ver avaliação
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
