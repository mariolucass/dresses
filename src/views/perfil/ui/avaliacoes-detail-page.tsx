"use client";

import type { Avaliacao } from "@entities/avaliacao";
import type { User } from "@entities/user";
import { getCurrentUserService } from "@features/auth";
import { AvaliacaoStars, fetchAvaliacaoById } from "@features/avaliacoes";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shared/components/ui/avatar";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import {
  ArrowLeft,
  CalendarDays,
  Handshake,
  Loader2,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { spring1 } from "@shared/config/animation";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

interface AvaliacaoDetailPageProps {
  avaliacaoId: string;
}

export function AvaliacaoDetailPage({ avaliacaoId }: AvaliacaoDetailPageProps) {
  const router = useRouter();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [avaliador, setAvaliador] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || !session) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    const found = fetchAvaliacaoById(avaliacaoId);
    if (found?.avaliadoId === session.userId) {
      setAvaliacao(found);
      setAvaliador(getCurrentUserService(found.avaliadorId));
    }
    setIsLoading(false);
  }, [avaliacaoId, isAuthLoading, isAuthenticated, router, session]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div
        className="mx-auto flex min-h-80 max-w-xl flex-col items-center justify-center rounded-2xl border p-8 text-center"
        style={{
          background: theme.gradient.section,
          borderColor: theme.color.border,
        }}
      >
        <MessageSquareText className="size-9 text-muted-foreground" />
        <h1 className="mt-4 font-display text-3xl font-black uppercase">
          Avaliação não encontrada
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta avaliação não existe ou não pertence ao seu perfil.
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.PERFIL_AVALIACOES}>Voltar às avaliações</Link>
        </Button>
      </div>
    );
  }

  const evaluatorName = avaliador?.nome ?? "Membro da comunidade";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring1}
      className="mx-auto max-w-7xl space-y-6"
      data-testid="avaliacao-detail-page"
    >
      <Button
        asChild
        variant="ghost"
        className="gap-2 px-0 text-muted-foreground hover:bg-transparent hover:text-primary"
      >
        <Link href={ROUTES.PERFIL_AVALIACOES}>
          <ArrowLeft className="size-4" />
          Voltar às avaliações
        </Link>
      </Button>

      <article
        className="relative overflow-hidden rounded-2xl border"
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

        <header className="flex flex-col gap-5 border-b p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 border">
              <AvatarImage src={avaliador?.avatar} alt={evaluatorName} />
              <AvatarFallback className="font-semibold">
                {getInitials(evaluatorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                Avaliação recebida de
              </p>
              <h1 className="mt-1 font-display text-3xl font-black uppercase">
                {evaluatorName}
              </h1>
            </div>
          </div>
          <AvaliacaoStars value={avaliacao.nota} readOnly size="lg" />
        </header>

        <div className="p-6 sm:p-8">
          <div
            className="rounded-xl border p-5 sm:p-6"
            style={{
              background: theme.color.bgSurface2,
              borderColor: theme.color.border,
            }}
          >
            <MessageSquareText className="size-5 text-primary" />
            <p className="mt-4 text-base leading-8 text-foreground">
              {avaliacao.comentario || "Avaliação enviada sem comentário."}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <DetailItem
              icon={CalendarDays}
              label="Recebida em"
              value={formatDate(avaliacao.createdAt)}
            />
            <DetailItem
              icon={Handshake}
              label="Negociação"
              value={avaliacao.negociacaoId}
              href={ROUTES.NEGOCIACAO_DETALHE(avaliacao.negociacaoId)}
            />
            <DetailItem
              icon={ShieldCheck}
              label="Nota"
              value={`${avaliacao.nota} de 5`}
            />
          </div>
        </div>
      </article>
    </motion.div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <Icon className="size-4 text-primary" />
      <p className="mt-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xs font-medium">{value}</p>
    </>
  );

  const containerClasses = href
    ? "group block rounded-lg border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
    : "rounded-lg border p-3";

  if (href) {
    return (
      <Link
        href={href}
        className={containerClasses}
        style={{
          background: theme.color.bgSurface2,
          borderColor: theme.color.border,
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={containerClasses}
      style={{
        background: theme.color.bgSurface2,
        borderColor: theme.color.border,
      }}
    >
      {content}
    </div>
  );
}
