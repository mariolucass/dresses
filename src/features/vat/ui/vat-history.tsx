"use client";

import type { MotivoTransacaoVAT, TransacaoVAT } from "@entities/transacao-vat";
import theme from "@shared/config/theme";
import { ArrowDownLeft, ArrowUpRight, Coins, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchHistoricoVAT } from "../api/fetch-historico";
import { VAT_UPDATED_EVENT } from "../model/vat-events";

const MOTIVO_LABEL: Record<MotivoTransacaoVAT, string> = {
  CADASTRO_BONUS: "Bônus de cadastro",
  VENDA_CONCLUIDA: "Venda concluída",
  TROCA_CONCLUIDA: "Troca concluída",
  PROPOSTA_ACEITA: "Proposta aceita",
  AJUSTE_MANUAL: "Ajuste de saldo",
};

interface VatHistoryProps {
  userId: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function VatHistory({ userId }: VatHistoryProps) {
  const [transactions, setTransactions] = useState<TransacaoVAT[]>([]);

  useEffect(() => {
    const refresh = () => setTransactions(fetchHistoricoVAT(userId));

    refresh();
    window.addEventListener(VAT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(VAT_UPDATED_EVENT, refresh);
  }, [userId]);

  if (transactions.length === 0) {
    return (
      <div
        className="flex flex-col items-center rounded-[10px] border px-6 py-10 text-center"
        style={{
          background: theme.color.bgSurface2,
          borderColor: theme.color.border,
        }}
        data-testid="vat-history"
      >
        <ReceiptText className="size-8 text-muted-foreground" />
        <p className="mt-3 font-display text-xl font-bold uppercase">
          Nenhuma movimentação
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Seus créditos e débitos VAT aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div
      className="max-h-[55vh] space-y-2 overflow-y-auto pr-1"
      data-testid="vat-history"
    >
      {transactions.map((transaction) => {
        const credit = transaction.tipo === "CREDITO";

        return (
          <article
            key={transaction.id}
            className="flex items-center gap-3 rounded-[10px] border p-3"
            style={{
              background: theme.color.bgSurface2,
              borderColor: theme.color.border,
            }}
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full"
              style={{
                color: credit ? theme.color.success : theme.color.sell,
                background: credit ? theme.color.successBg : theme.color.sellBg,
                border: `1px solid ${credit ? theme.color.successBorder : theme.color.sellBorder}`,
              }}
            >
              {credit ? (
                <ArrowDownLeft className="size-4" />
              ) : (
                <ArrowUpRight className="size-4" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {transaction.descricao}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {MOTIVO_LABEL[transaction.motivo]} ·{" "}
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <span
                  className="shrink-0 font-display text-xl font-black tabular-nums"
                  style={{
                    color: credit ? theme.color.success : theme.color.sell,
                  }}
                >
                  {credit ? "+" : "−"}
                  {transaction.valor}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Coins className="size-3" />
                Saldo após movimentação: {transaction.saldoPosterior} VAT
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
