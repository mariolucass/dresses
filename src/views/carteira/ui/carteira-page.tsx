"use client";

import { WalletPanel } from "@features/vat";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@shared/config/animation";

export function CarteiraPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl py-6 sm:py-10"
    >
      <motion.div variants={staggerItem}>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          Sua moeda circular
        </span>
        <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
          Minha carteira
        </h1>
        <p className="mb-8 mt-3 text-sm text-muted-foreground">
          Gerencie e simule transações com a moeda virtual do Desapeguei.
        </p>
      </motion.div>
      <motion.div variants={staggerItem}>
        <WalletPanel />
      </motion.div>
    </motion.div>
  );
}
