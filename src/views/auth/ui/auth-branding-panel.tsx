"use client";

import { motion } from "motion/react";
import { Recycle, ShieldCheck, Sparkles } from "lucide-react";

import { ease1, staggerContainer, staggerItem } from "@shared/config/animation";
import theme from "@shared/config/theme";

const HIGHLIGHTS = [
  {
    icon: Recycle,
    title: "Moda circular",
    description: "Dê uma segunda vida às suas roupas e ganhe pontos por isso.",
  },
  {
    icon: Sparkles,
    title: "Pontos VAT",
    description: "Use o saldo virtual para comprar ou trocar peças sem dinheiro.",
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
      style={{ background: theme.gradient.heroDeep }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={theme.texture.dots(theme.brand.white, 0.06)}
      />
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: theme.gradient.glowOrange, opacity: 0.35 }}
      />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease1 }}
        className="relative z-10 flex items-center gap-2"
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
          style={{ background: theme.gradient.cta, color: theme.brand.navy }}
        >
          B
        </div>
        <span className="font-serif text-xl text-white">Brechó Online</span>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 space-y-8"
      >
        <motion.div variants={staggerItem} className="space-y-3">
          <h2 className="font-serif text-3xl leading-tight text-white">
            Moda com propósito, do seu jeito.
          </h2>
          <p className="text-sm text-white/70">
            Compre, venda e troque peças únicas com outras pessoas da
            comunidade — sem desperdício, com confiança.
          </p>
        </motion.div>

        <div className="space-y-5">
          {HIGHLIGHTS.map((item) => (
            <motion.div key={item.title} variants={staggerItem} className="flex gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <item.icon className="size-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs leading-relaxed text-white/60">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <p className="relative z-10 text-xs text-white/40">
        © {new Date().getFullYear()} Brechó Online — feito com ♻️ por quem ama moda sustentável.
      </p>
    </div>
  );
}
