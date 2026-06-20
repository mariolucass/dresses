"use client";

import {
  ArrowRight,
  Coins,
  MessageCircle,
  Recycle,
  Repeat,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { ease1, spring2, staggerContainer, staggerItem } from "@shared/config/animation";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";

const STATS = [
  { value: "2.500+", label: "peças em circulação" },
  { value: "98%", label: "negociações concluídas" },
  { value: "4.8★", label: "satisfação média" },
];

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Anuncie sua peça",
    description: "Tire fotos, descreva o estado e escolha entre vender ou trocar.",
  },
  {
    icon: MessageCircle,
    title: "Negocie pelo chat",
    description: "Converse direto com o interessado e combine os detalhes.",
  },
  {
    icon: Repeat,
    title: "Feche o negócio",
    description: "Aceite a proposta, finalize e avalie a experiência.",
  },
];

const FEATURES = [
  {
    icon: Recycle,
    title: "Moda circular",
    description: "Cada peça reaproveitada é uma peça que não vira lixo. Bom para o bolso e para o planeta.",
  },
  {
    icon: Coins,
    title: "Pontos VAT",
    description: "Nossa moeda virtual permite comprar e trocar peças sem precisar sacar nada do bolso.",
  },
  {
    icon: ShieldCheck,
    title: "Comunidade avaliada",
    description: "Avaliações reais de quem já negociou te ajudam a comprar e vender com mais segurança.",
  },
  {
    icon: Sparkles,
    title: "Curadoria fácil",
    description: "Filtros por categoria, tamanho e condição para achar exatamente o que você procura.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen w-full" data-testid="landing-page">
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md" style={{ background: theme.brand.navyAlpha80 }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
              style={{ background: theme.gradient.cta, color: theme.brand.navy }}
            >
              B
            </div>
            <span className="font-serif text-lg text-white">Brechó Online</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Entrar
              </Button>
            </Link>
            <Link href={ROUTES.CADASTRO}>
              <Button
                className="gap-1.5 border-none"
                style={{ background: theme.gradient.cta, color: theme.brand.navy }}
              >
                Criar conta
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 pb-24 pt-20"
        style={{ background: theme.gradient.hero }}
      >
        <div className="pointer-events-none absolute inset-0" style={theme.texture.dots(theme.brand.white, 0.05)} />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: theme.gradient.glowOrange, opacity: 0.3 }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <motion.span
            variants={staggerItem}
            className="mb-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide"
            style={{ background: theme.color.bgSurface, color: theme.color.textSecondary, border: `1px solid ${theme.color.border}` }}
          >
            <Sparkles className="size-3.5" style={{ color: theme.brand.orangeLight }} />
            Moda sustentável, agora com pontos VAT
          </motion.span>

          <motion.h1
            variants={staggerItem}
            className="font-serif text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl"
          >
            Compre, venda e troque
            <br />
            <span style={{ color: theme.brand.orangeLight }}>roupas com propósito</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/70"
          >
            O brechó online onde cada peça ganha uma nova história. Encontre
            achados únicos, dê vida nova ao seu guarda-roupa e ganhe pontos
            por negociar com a comunidade.
          </motion.p>

          <motion.div variants={staggerItem} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href={ROUTES.CADASTRO}>
              <Button
                size="lg"
                className="gap-2 border-none px-7 text-base"
                style={{ background: theme.gradient.cta, color: theme.brand.navy }}
              >
                Começar agora
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 px-7 text-base text-white hover:bg-white/10 hover:text-white"
              >
                Já tenho conta
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-10"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-2xl text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Como funciona ──────────────────────────────────── */}
      <section className="px-6 py-24" style={{ background: theme.color.bgLight }}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: ease1 }}
            className="mx-auto mb-14 max-w-xl text-center"
          >
            <h2 className="font-serif text-3xl" style={{ color: theme.brand.navy }}>
              Como funciona
            </h2>
            <p className="mt-3 text-sm" style={{ color: theme.color.textInverted, opacity: 0.65 }}>
              Três passos simples entre o seu guarda-roupa e o de outra pessoa.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring2, delay: index * 0.12 }}
                className="rounded-2xl border bg-white p-7"
                style={{ borderColor: "rgba(21,17,82,0.08)", boxShadow: theme.shadow.card }}
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold"
                  style={{ background: theme.color.bgBase, color: theme.brand.orangeLight }}
                >
                  0{index + 1}
                </div>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: theme.brand.skyAlpha10 }}>
                  <step.icon className="size-4" style={{ color: theme.brand.sky }} />
                </div>
                <h3 className="font-medium" style={{ color: theme.brand.navy }}>{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.color.textInverted, opacity: 0.6 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Destaques ──────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ background: theme.gradient.section }}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: ease1 }}
            className="mx-auto mb-14 max-w-xl text-center"
          >
            <h2 className="font-serif text-3xl text-white">Por que usar o Brechó Online?</h2>
            <p className="mt-3 text-sm text-white/60">
              Tudo que você precisa para dar uma nova vida às suas roupas.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="rounded-2xl p-6"
                style={{ background: theme.color.bgSurface, border: `1px solid ${theme.color.border}` }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: theme.brand.orangeAlpha10 }}
                >
                  <feature.icon className="size-5" style={{ color: theme.brand.orangeLight }} />
                </div>
                <h3 className="font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA final ──────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ background: theme.color.bgLight }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: ease1 }}
          className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl p-12 text-center"
          style={{ background: theme.gradient.heroDeep, boxShadow: theme.shadow.cardFeatured }}
        >
          <div className="mb-4 flex items-center gap-1" style={{ color: theme.brand.orangeLight }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </div>
          <h2 className="font-serif text-3xl text-white">Pronto para garimpar?</h2>
          <p className="mt-3 max-w-md text-sm text-white/65">
            Crie sua conta gratuita agora e ganhe um bônus de boas-vindas em
            pontos VAT para sua primeira negociação.
          </p>
          <Link href={ROUTES.CADASTRO} className="mt-7">
            <Button
              size="lg"
              className="gap-2 border-none px-8 text-base"
              style={{ background: theme.gradient.cta, color: theme.brand.navy }}
            >
              Criar minha conta
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer mínimo (o AppFooter completo é do widget) ── */}
      <footer className="px-6 py-8 text-center text-xs" style={{ background: theme.color.bgBase, color: theme.color.textMuted }}>
        © {new Date().getFullYear()} Brechó Online — feito com ♻️ em Juazeiro do Norte, CE.
      </footer>
    </div>
  );
}
