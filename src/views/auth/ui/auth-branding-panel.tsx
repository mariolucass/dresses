"use client";

import { ease1, staggerContainer, staggerItem } from "@shared/config/animation";
import theme from "@shared/config/theme";
import { Recycle, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

const HIGHLIGHTS = [
  {
    icon: Recycle,
    title: "Moda circular",
    description: "Dê uma segunda vida às suas roupas e ganhe pontos por isso.",
  },
  {
    icon: Sparkles,
    title: "Pontos VAT",
    description:
      "Use o saldo virtual para comprar ou trocar peças sem dinheiro.",
  },
  {
    icon: ShieldCheck,
    title: "Comunidade avaliada",
    description: "Negocie com confiança através de avaliações reais.",
  },
];

/**
 * Painel decorativo exibido ao lado dos formulários de login/cadastro.
 * Some em telas pequenas (md:flex).
 */
export function AuthBrandingPanel() {
  return (
    <div
      className="relative hidden flex-col justify-between overflow-hidden p-10 md:flex md:w-[44%]"
      style={{ background: theme.gradient.hero }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={theme.texture.dots("var(--theme-text-primary)", 0.06)}
      />
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: theme.brand.terra, opacity: 0.16 }}
      />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease1 }}
        className="relative z-10 flex items-center gap-2"
      >
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-[var(--theme-surface2)]">
          <Image src="/desapeguei_logo.png" alt="Desapeguei" width={36} height={36} className="object-contain" priority />
        </div>
        <span className="font-display text-xl font-bold uppercase tracking-wide text-[var(--theme-text-primary)]">
          Desapeguei
        </span>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 space-y-8"
      >
        <motion.div variants={staggerItem} className="space-y-3">
          <h2 className="font-display text-4xl font-black uppercase leading-none text-[var(--theme-text-primary)]">
            Moda com propósito, do seu jeito.
          </h2>
          <p className="text-sm text-[var(--theme-text-secondary)]">
            Compre, venda e troque peças únicas com outras pessoas da comunidade.
            Sem desperdício e com confiança.
          </p>
        </motion.div>

        <div className="space-y-5">
          {HIGHLIGHTS.map((item) => (
            <motion.div
              key={item.title}
              variants={staggerItem}
              className="flex gap-3"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: theme.color.bgSurface2,
                  border: `1px solid ${theme.color.border}`,
                }}
              >
                <item.icon
                  className="size-4"
                  style={{ color: theme.color.primary }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--theme-text-primary)]">{item.title}</p>
                <p className="text-xs leading-relaxed text-[var(--theme-text-muted)]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <p className="relative z-10 text-xs text-[var(--theme-text-subtle)]">
        © {new Date().getFullYear()} Desapeguei - feito com ♻️ por quem ama
        moda sustentável.
      </p>
    </div>
  );
}
