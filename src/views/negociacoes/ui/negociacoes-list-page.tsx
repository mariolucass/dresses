"use client";

import type { Proposta, StatusProposta } from "@entities/proposta";
import { fetchNegociacoes, PropostaCard } from "@features/negociacao";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Handshake } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@shared/config/animation";

const FILTERS: Array<{ label: string; statuses?: StatusProposta[] }> = [
  { label: "Todas" },
  { label: "Em andamento", statuses: ["PENDENTE", "ACEITA", "CONTRAPROPOSTA"] },
  { label: "Concluídas", statuses: ["CONCLUIDA"] },
  { label: "Encerradas", statuses: ["RECUSADA", "CANCELADA", "SUBSTITUIDA"] },
];

export function NegociacoesListPage() {
  const { session, isLoading } = useAuth();
  const [items, setItems] = useState<Proposta[]>([]);
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => {
    if (session) setItems(fetchNegociacoes(session.userId));
  }, [session]);

  const filter = FILTERS[activeFilter];
  const visible = filter.statuses
    ? items.filter((item) => filter.statuses?.includes(item.status))
    : items;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl py-6 sm:py-10"
      data-testid="negociacoes-list-page"
    >
      <motion.div variants={staggerItem}>
        <span
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: theme.color.sell }}
      >
        Converse e combine
      </span>
      <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
        Negociações
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Acompanhe propostas de compra e troca, converse com a outra parte e
        conclua seus acordos.
      </p>

      </motion.div>

      <motion.div
        variants={staggerItem}
        className="mt-7 flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Filtrar negociações"
      >
        {FILTERS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActiveFilter(index)}
            className="shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition"
            style={{
              color:
                index === activeFilter
                  ? theme.color.primaryFg
                  : theme.color.textSecondary,
              background:
                index === activeFilter
                  ? theme.color.primary
                  : theme.color.bgSurface2,
              borderColor:
                index === activeFilter
                  ? theme.color.primary
                  : theme.color.border,
            }}
          >
            {item.label}
          </button>
        ))}
      </motion.div>

      {!isLoading && session && visible.length > 0 ? (
        <motion.div variants={staggerItem} className="mt-4 grid gap-4 lg:grid-cols-2">
          {visible.map((item) => (
            <PropostaCard
              key={item.id}
              proposta={item}
              currentUserId={session.userId}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={staggerItem}
          className="mt-6 rounded-2xl border p-10 text-center"
          style={{
            background: theme.gradient.sellCard,
            borderColor: theme.color.borderSell,
          }}
        >
          <Handshake
            className="mx-auto size-8"
            style={{ color: theme.color.sell }}
          />
          <p className="mt-4 font-display text-xl font-bold uppercase">
            {isLoading
              ? "Carregando"
              : session
                ? "Nenhuma negociação aqui"
                : "Entre para ver suas negociações"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Suas propostas e conversas aparecerão nesta área.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
