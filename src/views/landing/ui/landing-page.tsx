"use client";

import { ArrowRight, Camera, Check, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { ease1, spring2 } from "@shared/config/animation";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "2.500+", label: "peças circulando agora" },
  { value: "98%", label: "negociações concluídas" },
  { value: "4.8", label: "satisfação média" },
];

const STEPS = [
  {
    num: "01",
    icon: Camera,
    iconColor: theme.brand.lime,
    iconBg: theme.brand.limeAlpha10,
    title: "Anuncie sua peça",
    description:
      "Tire foto, descreva o estado real e escolha se quer vender, trocar ou aceitar os dois.",
  },
  {
    num: "02",
    icon: MessageCircle,
    iconColor: theme.brand.violet,
    iconBg: theme.brand.violetAlpha10,
    title: "Negocie no chat",
    description:
      "Receba propostas, faça contrapropostas e combine os detalhes diretamente com quem quer comprar ou trocar.",
  },
  {
    num: "03",
    icon: Check,
    iconColor: theme.brand.terra,
    iconBg: theme.brand.terraAlpha10,
    title: "Feche o negócio",
    description:
      "Aceite a proposta, combine a entrega e avalie a experiência. Sua reputação é o que vale aqui.",
  },
];

const FEATURES = [
  {
    tag: "Circular",
    title: "Moda que fecha o ciclo",
    description:
      "Cada peça que passa de mão em mão é uma que não foi pro lixo. Bom pro seu bolso e para o mundo todo.",
  },
  {
    tag: "Pontos VAT",
    title: "Nossa moeda interna",
    description:
      "Ganhe pontos negociando e use pra conseguir peças sem tirar nada do bolso. Uma economia paralela dentro da plataforma.",
  },
  {
    tag: "Reputação",
    title: "Avaliações reais, pós-negociação",
    description:
      "Só avalia quem negociou de verdade. Sem estrelinhas de fachada, a pontuação de alguém diz tudo antes de você fechar qualquer coisa.",
  },
  {
    tag: "Busca",
    title: "Filtros que funcionam",
    description:
      "Por tamanho, condição, modalidade e categoria. Você não vai perder tempo vendo o que não te interessa.",
  },
];

const TESTIMONIALS = [
  {
    initials: "ML",
    name: "Mario Lucas",
    location: "Crato",
    text: "Achei o site super simples de navegar. Encontrei tudo o que queria sem dificuldade. Recomendo!",
  },
  {
    initials: "AC",
    name: "Ana Caroline",
    location: "Farias Brito",
    text: "Experiência de compra ótima! O site é descomplicado e os produtos são lindos. Com certeza vou comprar mais vezes.",
  },
  {
    initials: "W",
    name: "Wallyson",
    location: "Juazeiro do Norte",
    text: "Site nota 10. Muito rápido para comprar e a curadoria das roupas é excelente. Adorei!",
  },
];

const TICKER_ITEMS = [
  "Vestido midi floral · T.M · R$65",
  "Blazer oversized · T.G · troca direta",
  "Conjunto linho · T.P · R$110",
  "Kimono festa · T.M · 1x usado",
  "Calça wide leg · T.38 · R$48",
  "Top cropped · T.P · ou troca",
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-12 flex items-center gap-3">
      <span
        className="text-[10px] font-semibold uppercase tracking-[.16em]"
        style={{ color: theme.color.textSubtle }}
      >
        {children}
      </span>
      <div className="h-px flex-1" style={{ background: theme.color.border }} />
    </div>
  );
}

function ModePills() {
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      <span
        className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[.04em]"
        style={{
          background: theme.color.sellBg,
          color: theme.color.sell,
          borderColor: theme.color.sellBorder,
        }}
      >
        Venda com proposta
      </span>
      <span
        className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[.04em]"
        style={{
          background: theme.color.swapBg,
          color: theme.color.swap,
          borderColor: theme.color.swapBorder,
        }}
      >
        Troca direta
      </span>
      <span
        className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[.04em]"
        style={{
          background: theme.brand.limeAlpha10,
          color: theme.brand.lime,
          borderColor: theme.brand.limeAlpha30,
        }}
      >
        Aceito os dois
      </span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: ease1 }}
      className="min-h-screen w-full"
      style={{ background: theme.color.bgBase }}
      data-testid="landing-page"
    >
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "var(--theme-header-bg)",
          borderColor: theme.color.border,
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-[18px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-lg bg-[var(--theme-surface2)]">
              <Image
                src="/desapeguei_logo.png"
                alt="Desapeguei"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
            </div>
            <span
              className="font-display text-[17px] font-bold uppercase tracking-[.06em]"
              style={{ color: theme.color.textPrimary }}
            >
              Desapeguei
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link href={ROUTES.LOGIN}>
              <Button
                variant="ghost"
                className="text-[13px] hover:bg-[var(--theme-bg-surface-hover)]"
              >
                Entrar
              </Button>
            </Link>
            <Link href={ROUTES.CADASTRO}>
              <Button
                className="rounded-full border-none font-display text-[14px] font-bold uppercase tracking-[.05em]"
                style={{ background: theme.brand.lime, color: "#111" }}
              >
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        className="border-b px-4 pb-24 pt-[96px] sm:px-6 lg:px-8"
        style={{ borderColor: theme.color.border }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ease1 }}
          className="mx-auto max-w-7xl"
        >
          {/* Kicker */}
          <div
            className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[.14em]"
            style={{ color: theme.brand.terra }}
          >
            <span className="inline-block h-px w-5 bg-current" />
            Desapeguei - venda, troca &amp; negociação
          </div>

          {/* Headline */}
          <h1
            className="font-display text-[56px] md:text-[82px] font-black uppercase leading-[.9] tracking-[-0.02em]"
            style={{ color: theme.color.textPrimary }}
          >
            Sua roupa
            <br />
            merece uma
            <br />
            <span style={{ color: theme.brand.lime }}>segunda chance.</span>
          </h1>

          {/* Body row */}
          <div
            className="mt-16 grid grid-cols-1 md:grid-cols-2 items-start md:items-end gap-10 md:gap-16 border-t pt-12"
            style={{ borderColor: theme.color.border }}
          >
            {/* Left: desc + pills */}
            <div>
              <p
                className="max-w-[340px] text-[15px] leading-[1.65]"
                style={{ color: theme.color.textSecondary }}
              >
                Anuncie peças para{" "}
                <strong
                  className="font-medium"
                  style={{ color: theme.color.textPrimary }}
                >
                  vender ou trocar
                </strong>
                , negocie pelo chat e feche negócio com quem compartilha seu
                gosto. Sem burocracia, sem intermediário.
              </p>
              <ModePills />
            </div>

            {/* Right: stats + CTAs */}
            <div className="flex flex-col items-start md:items-end gap-5">
              <div className="w-full space-y-3">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-baseline justify-between border-b pb-3 last:border-b-0 last:pb-0"
                    style={{ borderColor: theme.color.border }}
                  >
                    <span
                      className="font-display text-[28px] font-black"
                      style={{ color: theme.color.textPrimary }}
                    >
                      {s.value}
                    </span>
                    <span
                      className="text-[11px] tracking-[.04em]"
                      style={{ color: theme.color.textSubtle }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link href={ROUTES.LOGIN}>
                  <Button
                    variant="outline"
                    className="rounded-full border text-[13px]"
                    style={{
                      borderColor: theme.color.borderHover,
                      color: theme.color.textSecondary,
                    }}
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href={ROUTES.CADASTRO}>
                  <Button
                    className="gap-1.5 rounded-full border-none font-display font-bold uppercase tracking-[.05em]"
                    style={{ background: theme.brand.lime, color: "#111" }}
                  >
                    Começar agora
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────────── */}
      <div
        className="flex gap-12 overflow-hidden border-b px-8 py-3.5"
        style={{
          background: theme.color.bgSurface,
          borderColor: theme.color.border,
        }}
      >
        {TICKER_ITEMS.map((item) => (
          <div
            key={item}
            className="flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[.08em]"
            style={{ color: theme.color.textSubtle }}
          >
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: theme.brand.lime }}
            />
            {item}
          </div>
        ))}
      </div>

      {/* ── Como funciona ──────────────────────────────────────────────── */}
      <section
        className="border-b px-4 py-32 sm:px-6 lg:px-8"
        style={{ borderColor: theme.color.border }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Como funciona</SectionLabel>

          <div
            className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"
            style={{ borderColor: theme.color.border }}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring2, delay: i * 0.1 }}
                className="relative px-0 py-8 md:py-0 md:px-7 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0"
                style={{
                  borderColor: theme.color.border,
                }}
              >
                {/* big dim number */}
                <div
                  className="mb-5 font-display text-[72px] font-black leading-none tracking-[-0.03em] select-none opacity-5"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {step.num}
                </div>

                <div
                  className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border"
                  style={{
                    background: step.iconBg,
                    borderColor: theme.color.border,
                  }}
                >
                  <step.icon
                    className="size-4"
                    style={{ color: step.iconColor }}
                  />
                </div>

                <h3
                  className="mb-2 font-display text-[22px] font-bold leading-tight"
                  style={{ color: theme.color.textPrimary }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[13px] leading-[1.6]"
                  style={{ color: theme.color.textSecondary }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features (editorial) ───────────────────────────────────────── */}
      <section
        className="border-b px-4 py-32 sm:px-6 lg:px-8"
        style={{ borderColor: theme.color.border }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-start gap-12 md:gap-24">
            {/* Left sticky column */}
            <div className="md:sticky md:top-24">
              <h2
                className="font-display text-[40px] md:text-[48px] font-black uppercase leading-[.92]"
                style={{ color: theme.color.textPrimary }}
              >
                Feito pra
                <br />
                quem{" "}
                <em className="not-italic" style={{ color: theme.brand.lime }}>
                  sabe
                </em>
                <br />o que quer.
              </h2>
              <p
                className="mt-5 text-[13px] leading-[1.65]"
                style={{ color: theme.color.textSecondary }}
              >
                Sem filtros quebrados, sem anúncios inúteis, sem foto de
                estoque. Tudo aqui é real. São peças de pessoas reais, com
                preços negociáveis.
              </p>
              <Link href={ROUTES.CADASTRO}>
                <span
                  className="mt-7 inline-flex cursor-pointer items-center gap-1.5 border-b pb-0.5 text-[12px] font-medium uppercase tracking-[.08em] transition-opacity hover:opacity-70"
                  style={{
                    color: theme.brand.lime,
                    borderColor: theme.brand.limeAlpha30,
                  }}
                >
                  Ver todas as peças →
                </span>
              </Link>
            </div>

            {/* Right: feature list */}
            <div
              className="divide-y"
              style={{ borderColor: theme.color.border }}
            >
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring2, delay: i * 0.08 }}
                  className="grid grid-cols-[80px_1fr] items-start gap-5 py-6 first:pt-0 last:pb-0"
                >
                  <span
                    className="mt-0.5 text-[10px] font-bold uppercase tracking-[.12em]"
                    style={{ color: theme.color.textSubtle }}
                  >
                    {f.tag}
                  </span>
                  <div>
                    <h3
                      className="mb-1.5 font-display text-[20px] font-bold"
                      style={{ color: theme.color.textPrimary }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-[13px] leading-[1.6]"
                      style={{ color: theme.color.textSecondary }}
                    >
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Prova social ───────────────────────────────────────────────── */}
      <section
        className="border-b px-4 py-32 sm:px-6 lg:px-8"
        style={{
          background: theme.color.bgSurface,
          borderColor: theme.color.border,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionLabel>O que dizem por aqui</SectionLabel>

          {/* Pull quote */}
          <blockquote
            className="mb-7 font-display text-[28px] md:text-[38px] font-bold leading-[1.05]"
            style={{ color: theme.color.textPrimary }}
          >
            "Site muito fácil de usar e prático. Amei a peça que comprei,{" "}
            <em
              className="font-light not-italic"
              style={{ color: theme.brand.lime }}
            >
              chegou tudo certinho!
            </em>
            "
          </blockquote>
          <div
            className="mb-12 flex flex-col md:flex-row md:items-center gap-2 md:gap-2.5 text-[11px] uppercase tracking-[.08em]"
            style={{ color: theme.color.textSubtle }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold shrink-0"
                style={{
                  background: theme.brand.limeAlpha10,
                  borderColor: theme.brand.limeAlpha30,
                  color: theme.brand.lime,
                }}
              >
                JM
              </div>
              Joao Vitor Moura - Juazeiro do Norte
            </div>
            <div className="flex items-center gap-2">
              <span
                className="hidden md:inline-block h-6 w-px"
                style={{ background: theme.color.border }}
              />
              Membro desde março
            </div>
          </div>

          {/* Card grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-t border-x md:border-r-0 md:border-l"
            style={{ borderColor: theme.color.border }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="border-b border-r p-8"
                style={{ borderColor: theme.color.border }}
              >
                {/* Stars */}
                <div className="mb-2.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5"
                      style={{ fill: theme.brand.lime }}
                    >
                      <polygon points="6,0 7.3,4.2 11.7,4.2 8.2,6.8 9.5,11 6,8.4 2.5,11 3.8,6.8 0.3,4.2 4.7,4.2" />
                    </svg>
                  ))}
                </div>
                <p
                  className="mb-4 text-[13px] leading-[1.6]"
                  style={{ color: theme.color.textSecondary }}
                >
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full border text-[9px] font-semibold"
                    style={{
                      background: theme.brand.limeAlpha10,
                      borderColor: theme.brand.limeAlpha30,
                      color: theme.brand.lime,
                    }}
                  >
                    {t.initials}
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: theme.color.textPrimary }}
                  >
                    {t.name}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: theme.color.textSubtle }}
                  >
                    {t.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ──────────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:py-32 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-24">
          {/* Left */}
          <div>
            <p
              className="mb-5 text-[10px] font-semibold uppercase tracking-[.16em]"
              style={{ color: theme.color.textSubtle }}
            >
              Comece hoje
            </p>
            <h2
              className="font-display text-[44px] md:text-[56px] font-black uppercase leading-[.92]"
              style={{ color: theme.color.textPrimary }}
            >
              Seu guarda-
              <br />
              roupa tem
              <br />
              <span style={{ color: theme.brand.lime }}>valor.</span>
            </h2>
            <p
              className="mt-5 text-[13px] leading-[1.65]"
              style={{ color: theme.color.textSecondary }}
            >
              Cadastro gratuito. Ganhe bônus em pontos VAT na primeira
              negociação.
            </p>
          </div>

          {/* Right: inline form */}
          <div
            className="flex flex-col gap-6 md:gap-8 rounded-2xl border p-8 md:p-12"
            style={{
              background: theme.color.bgSurface,
              borderColor: theme.color.border,
            }}
          >
            <div>
              <h3
                className="font-display text-[18px] font-bold"
                style={{ color: theme.color.textPrimary }}
              >
                Crie sua conta
              </h3>
              <p
                className="mt-1 text-[13px]"
                style={{ color: theme.color.textSecondary }}
              >
                Leva menos de 2 minutos. Sem cartão de crédito.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full rounded-lg border px-3.5 py-2.5 text-[13px] outline-none focus:ring-2 transition-all"
                style={{
                  background: theme.color.bgSurface2,
                  borderColor: theme.color.borderHover,
                  color: theme.color.textPrimary,
                  // @ts-ignore
                  "--tw-ring-color": theme.brand.limeAlpha30,
                }}
              />
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full rounded-lg border px-3.5 py-2.5 text-[13px] outline-none focus:ring-2 transition-all"
                style={{
                  background: theme.color.bgSurface2,
                  borderColor: theme.color.borderHover,
                  color: theme.color.textPrimary,
                  // @ts-ignore
                  "--tw-ring-color": theme.brand.limeAlpha30,
                }}
              />
            </div>

            <Link href={ROUTES.CADASTRO}>
              <button
                className="w-full rounded-full py-3 text-center font-display text-[15px] font-bold uppercase tracking-[.05em] transition-opacity hover:opacity-90"
                style={{ background: theme.brand.lime, color: "#111" }}
              >
                Criar conta grátis
              </button>
            </Link>

            <p
              className="text-center text-[11px]"
              style={{ color: theme.color.textSubtle }}
            >
              Já tem conta?{" "}
              <Link
                href={ROUTES.LOGIN}
                className="hover:opacity-70 transition-opacity"
                style={{ color: theme.brand.lime }}
              >
                Entrar →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer
        className="border-t py-6"
        style={{
          background: theme.color.bgBase,
          borderColor: theme.color.border,
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-4 sm:px-6 lg:px-8">
          <p
            className="text-[11px] tracking-[.02em]"
            style={{ color: theme.color.textSubtle }}
          >
            © {new Date().getFullYear()} Desapeguei - Juazeiro do Norte, CE
          </p>
          <div className="flex gap-5">
            {["Termos", "Privacidade", "Suporte"].map((label) => (
              <span
                key={label}
                className="cursor-pointer text-[11px] uppercase tracking-[.04em] transition-colors hover:opacity-60"
                style={{ color: theme.color.textSubtle }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
