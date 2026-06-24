"use client";

import { AnuncioForm } from "@features/anuncios/ui/anuncio-form";
import { spring1 } from "@shared/config/animation";
import theme from "@shared/config/theme";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function AnuncioCreatePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring1}
      className="space-y-7"
      data-testid="anuncio-create-page"
    >
      <header className="relative overflow-hidden rounded-2xl border p-6 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: theme.gradient.hero }}
        />
        <div
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: theme.gradient.accentLineFull }}
        />
        <p className="relative inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
          <Sparkles className="size-3" />
          Abra espaço no armário
        </p>
        <h1 className="relative mt-2 font-display text-5xl font-black uppercase leading-[0.92] sm:text-6xl">
          Publique uma <span className="text-primary">peça</span>
        </h1>
        <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cadastre fotos, descrição, categoria, marca e valores para venda ou
          troca.
        </p>
      </header>
      <AnuncioForm />
    </motion.div>
  );
}
