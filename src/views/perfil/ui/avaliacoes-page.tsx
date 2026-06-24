"use client";

import type { Avaliacao } from "@entities/avaliacao";
import { getCurrentUserService } from "@features/auth";
import {
  AvaliacaoCard,
  AvaliacaoStars,
  fetchAvaliacoes,
} from "@features/avaliacoes";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { ArrowLeft, Loader2, MessageSquareText, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@shared/config/animation";

export function AvaliacoesPage() {
  const router = useRouter();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || !session) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    setAvaliacoes(fetchAvaliacoes(session.userId));
    setIsLoading(false);
  }, [isAuthLoading, isAuthenticated, router, session]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const user = session ? getCurrentUserService(session.userId) : null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-6"
      data-testid="avaliacoes-page"
    >
      <motion.div variants={staggerItem}>
        <Button
        asChild
        variant="ghost"
        className="gap-2 px-0 text-muted-foreground hover:bg-transparent hover:text-primary"
      >
        <Link href={ROUTES.PERFIL}>
          <ArrowLeft className="size-4" />
          Voltar ao perfil
        </Link>
      </Button>
      </motion.div>

      <motion.header
        variants={staggerItem}
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
        style={{
          background: theme.gradient.hero,
          borderColor: theme.color.border,
          boxShadow: theme.shadow.card,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: theme.gradient.accentLineFull }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              Reputação na comunidade
            </p>
            <h1 className="mt-2 font-display text-5xl font-black uppercase leading-none">
              Minhas avaliações
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Experiências compartilhadas por pessoas que negociaram com você.
            </p>
          </div>

          <div className="rounded-xl border bg-background/40 p-4 backdrop-blur">
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl font-black text-primary">
                {(user?.avaliacaoMedia ?? 0).toFixed(1)}
              </span>
              <div>
                <AvaliacaoStars
                  value={user?.avaliacaoMedia ?? 0}
                  readOnly
                  size="sm"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {avaliacoes.length}{" "}
                  {avaliacoes.length === 1 ? "avaliação" : "avaliações"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {avaliacoes.length === 0 ? (
        <motion.section
          variants={staggerItem}
          className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center"
          style={{
            background: theme.gradient.section,
            borderColor: theme.color.borderStrong,
          }}
        >
          <MessageSquareText className="size-9 text-muted-foreground" />
          <h2 className="mt-4 font-display text-3xl font-black uppercase">
            Nenhuma avaliação ainda
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Quando uma negociação for concluída e avaliada, ela aparecerá aqui.
          </p>
        </motion.section>
      ) : (
        <motion.section variants={staggerItem}>
          <div className="mb-4 flex items-center gap-2">
            <Star className="size-4 text-primary" />
            <h2 className="font-display text-2xl font-bold uppercase">
              Avaliações recebidas
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {avaliacoes.map((avaliacao) => (
              <AvaliacaoCard
                key={avaliacao.id}
                avaliacao={avaliacao}
                avaliador={getCurrentUserService(avaliacao.avaliadorId)}
              />
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
