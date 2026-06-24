"use client";

import type { User, UserRole } from "@entities/user/model/user.types";
import { getCurrentUserService, logoutService } from "@features/auth";
import { AvaliacaoStars } from "@features/avaliacoes";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shared/components/ui/avatar";
import { Badge } from "@shared/components/ui/badge";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import {
  ArrowRight,
  CalendarDays,
  Coins,
  Database,
  Handshake,
  Loader2,
  LogOut,
  Mail,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { spring1 } from "@shared/config/animation";
import { resetDatabase, seedDatabase } from "@shared/lib/seed";

const ROLE_LABEL: Record<UserRole, string> = {
  AMBOS: "Compra e venda",
  COMPRADOR: "Comprador",
  VENDEDOR: "Vendedor",
};

const ROLE_DESCRIPTION: Record<UserRole, string> = {
  AMBOS: "Garimpa novas peças e também coloca o próprio acervo em circulação.",
  COMPRADOR: "Está por aqui para descobrir peças únicas e novos garimpos.",
  VENDEDOR: "Ajuda boas peças a encontrarem novas histórias e novos donos.",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function PerfilPage() {
  const router = useRouter();
  const {
    session,
    isAuthenticated,
    isLoading: isAuthLoading,
    clearSession,
  } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !session) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    setUser(getCurrentUserService(session.userId));
    setIsLoadingUser(false);
  }, [isAuthLoading, isAuthenticated, session, router]);

  function handleLogout() {
    logoutService();
    clearSession();
    router.push(ROUTES.HOME);
  }

  if (isAuthLoading || isLoadingUser) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        data-testid="perfil-page"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="text-xs uppercase tracking-widest">
            Carregando perfil
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center rounded-2xl border p-8 text-center"
        style={{
          background: theme.gradient.section,
          borderColor: theme.color.border,
        }}
        data-testid="perfil-page"
      >
        <UserRound className="size-10 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-black uppercase">
          Perfil indisponível
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Não foi possível carregar seus dados. Tente entrar novamente.
        </p>
        <Button className="mt-6" onClick={() => router.push(ROUTES.LOGIN)}>
          Ir para o login
        </Button>
      </div>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring1}
      className="mx-auto max-w-7xl space-y-6 py-2"
      data-testid="perfil-page"
    >
      <section
        className="relative overflow-hidden rounded-2xl border"
        style={{
          background: theme.gradient.hero,
          borderColor: theme.color.border,
          boxShadow: theme.shadow.card,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={theme.texture.gridFine(theme.brand.lime, 0.045)}
        />
        <div
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full blur-3xl"
          style={{ background: theme.brand.limeAlpha10 }}
        />
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: theme.gradient.accentLineFull }}
        />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-full blur-md"
                style={{ background: theme.brand.limeAlpha30 }}
              />
              <Avatar
                className="relative size-28 border-4 bg-card sm:size-32"
                style={{ borderColor: theme.color.bgSurface }}
              >
                <AvatarImage src={user.avatar} alt={user.nome} />
                <AvatarFallback className="bg-primary font-display text-3xl font-black text-primary-foreground">
                  {getInitials(user.nome)}
                </AvatarFallback>
              </Avatar>
              <span
                className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full border"
                style={{
                  color: theme.color.success,
                  background: theme.color.bgSurface,
                  borderColor: theme.color.successBorder,
                }}
                title="Membro ativo"
              >
                <ShieldCheck className="size-3.5" />
              </span>
            </div>

            <div>
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="size-3" />
                Perfil da comunidade
              </p>
              <h1 className="mt-2 font-display text-5xl font-black uppercase leading-[0.9] sm:text-6xl">
                {user.nome}
              </h1>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/10">
                  {ROLE_LABEL[user.role]}
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3.5" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  Desde {memberSince}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="gap-2 self-center border-destructive/30 text-muted-foreground hover:bg-destructive/10 hover:text-destructive lg:self-auto"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <LogOut className="size-4" />
            Sair da conta
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Star}
          eyebrow="Reputação"
          value={user.avaliacaoMedia.toFixed(1)}
          detail={
            <AvaliacaoStars value={user.avaliacaoMedia} readOnly size="sm" />
          }
          accent={theme.color.warning}
          background={theme.color.warningBg}
          border={theme.color.warningBorder}
        />
        <MetricCard
          icon={Sparkles}
          eyebrow="Avaliações recebidas"
          value={String(user.totalAvaliacoes)}
          detail={
            <span>
              {user.totalAvaliacoes === 1
                ? "experiência compartilhada"
                : "experiências compartilhadas"}
            </span>
          }
          accent={theme.color.swap}
          background={theme.color.swapBg}
          border={theme.color.swapBorder}
          href={ROUTES.PERFIL_AVALIACOES}
        />
        <MetricCard
          icon={Coins}
          eyebrow="Saldo disponível"
          value={`${user.saldoVAT} VAT`}
          detail={<span>prontos para o próximo garimpo</span>}
          accent={theme.color.primary}
          background={theme.brand.limeAlpha10}
          border={theme.color.borderPrimary}
          href="/perfil/carteira"
        />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <section
          className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
          style={{
            background: theme.color.bgSurface,
            borderColor: theme.color.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <Quote
            className="absolute right-6 top-6 size-16"
            style={{ color: theme.color.textSubtle }}
          />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
            Sobre mim
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase">
            Minha história no brechó
          </h2>
          <p className="relative mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            {user.bio ||
              "Este perfil ainda não tem uma bio. Mas cada peça em circulação já conta um pouco da história."}
          </p>

          <div className="mt-8 border-t pt-5">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShoppingBag className="size-4" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold uppercase">
                  {ROLE_LABEL[user.role]}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {ROLE_DESCRIPTION[user.role]}
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside
          className="overflow-hidden rounded-2xl border"
          style={{
            background: theme.gradient.section,
            borderColor: theme.color.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Atalhos
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase leading-none">
              Continue circulando
            </h2>
          </div>

          <nav className="border-t" aria-label="Atalhos do perfil">
            <ProfileLink
              href={ROUTES.ANUNCIOS}
              icon={ShoppingBag}
              label="Explorar anúncios"
              description="Encontre sua próxima peça"
            />
            <ProfileLink
              href={ROUTES.GARAGEM}
              icon={UserRound}
              label="Minha garagem"
              description="Veja suas peças e favoritos"
            />
            <ProfileLink
              href={ROUTES.NEGOCIACOES}
              icon={Handshake}
              label="Negociações"
              description="Acompanhe propostas e conversas"
            />
            <ProfileLink
              href={ROUTES.PERFIL_AVALIACOES}
              icon={Star}
              label="Minhas avaliações"
              description="Veja sua reputação completa"
            />
          </nav>
        </aside>
      </div>

      <section
        className="mt-6 overflow-hidden rounded-2xl border border-dashed p-6"
        style={{ borderColor: theme.color.border }}
      >
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Ferramentas de Teste
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              seedDatabase();
              window.location.reload();
            }}
          >
            <Database className="size-4" />
            Seed Database
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              resetDatabase();
              window.location.reload();
            }}
          >
            <Trash2 className="size-4" />
            Reset Database
          </Button>
        </div>
      </section>
    </motion.div>
  );
}

interface MetricCardProps {
  icon: typeof Star;
  eyebrow: string;
  value: string;
  detail: React.ReactNode;
  accent: string;
  background: string;
  border: string;
  href?: string;
}

function MetricCard({
  icon: Icon,
  eyebrow,
  value,
  detail,
  accent,
  background,
  border,
  href,
}: MetricCardProps) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          <p
            className="mt-2 font-display text-4xl font-black leading-none"
            style={{ color: accent }}
          >
            {value}
          </p>
        </div>
        <span
          className={`flex size-9 items-center justify-center rounded-lg transition-transform duration-200 ${href ? "group-hover:scale-110" : ""}`}
          style={{ color: accent, background: theme.color.bgSurface }}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 min-h-4 text-xs text-muted-foreground">{detail}</div>
    </>
  );

  const containerClasses = href
    ? "group block rounded-[10px] border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
    : "rounded-[10px] border p-5";

  if (href) {
    return (
      <Link
        href={href}
        className={containerClasses}
        style={{
          background,
          borderColor: border,
          boxShadow: theme.shadow.card,
        }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <article
      className={containerClasses}
      style={{ background, borderColor: border, boxShadow: theme.shadow.card }}
    >
      {inner}
    </article>
  );
}

interface ProfileLinkProps {
  href: string;
  icon: typeof ShoppingBag;
  label: string;
  description: string;
}

function ProfileLink({
  href,
  icon: Icon,
  label,
  description,
}: ProfileLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 border-b px-6 py-4 transition-colors last:border-b-0 hover:bg-[var(--theme-bg-surface-hover)]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-sm font-semibold">{label}</strong>
        <span className="block truncate text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
