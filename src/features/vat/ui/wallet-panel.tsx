"use client";

import { Input } from "@shared/components/ui/input";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Coins,
  WalletCards,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { creditarVAT } from "../api/creditar-vat";
import { debitarVAT } from "../api/debitar-vat";
import { fetchSaldoVAT } from "../api/fetch-saldo";
import { VAT_UPDATED_EVENT } from "../model/vat-events";
import { VatHistory } from "./vat-history";

type Operation = "comprar" | "resgatar";

export function WalletPanel() {
  const { session } = useAuth();
  const [saldo, setSaldo] = useState(0);
  const [values, setValues] = useState<Record<Operation, string>>({
    comprar: "",
    resgatar: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Operation, string>>>({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!session) return;
    const refresh = () => setSaldo(fetchSaldoVAT(session.userId));
    refresh();
    window.addEventListener(VAT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(VAT_UPDATED_EVENT, refresh);
  }, [session]);

  function submit(operation: Operation) {
    return (event: FormEvent) => {
      event.preventDefault();
      if (!session) return;
      const amount = Number(values[operation]);
      setSuccess("");
      setErrors({});
      if (!Number.isFinite(amount) || amount <= 0) {
        setErrors({ [operation]: "Informe uma quantidade maior que zero." });
        return;
      }
      const result =
        operation === "comprar"
          ? creditarVAT(
              session.userId,
              amount,
              "Compra simulada de VAT",
              undefined,
              "AJUSTE_MANUAL",
            )
          : debitarVAT(
              session.userId,
              amount,
              "Resgate simulado de VAT",
              undefined,
              "AJUSTE_MANUAL",
            );
      if (!result.success) {
        setErrors({ [operation]: result.error });
        return;
      }
      setValues((current) => ({ ...current, [operation]: "" }));
      setSuccess(
        operation === "comprar"
          ? `${amount} VAT adicionados à carteira.`
          : `${amount} VAT resgatados com sucesso.`,
      );
    };
  }

  if (!session) {
    return (
      <div className="rounded-2xl border p-10 text-center text-muted-foreground">
        Faça login para gerenciar sua carteira VAT.
      </div>
    );
  }

  return (
    <div className="space-y-5" data-testid="wallet-panel">
      {success && (
        <div
          className="flex items-center gap-2 rounded-xl border p-3 text-sm"
          style={{
            color: theme.color.success,
            background: theme.color.successBg,
            borderColor: theme.color.successBorder,
          }}
        >
          <CheckCircle2 className="size-4" /> {success}
        </div>
      )}
      <section
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
        style={{
          background: theme.gradient.section,
          borderColor: theme.color.borderPrimary,
          boxShadow: theme.shadow.glowLime,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: theme.gradient.accentLine }}
        />
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <WalletCards className="size-7" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Saldo disponível
            </p>
            <p className="mt-1 font-display text-4xl font-black tabular-nums sm:text-5xl">
              {saldo} <span className="text-xl text-primary">VAT</span>
            </p>
          </div>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <OperationCard
          operation="comprar"
          title="Comprar VAT"
          description="Adicione fundos virtuais à sua conta."
          value={values.comprar}
          error={errors.comprar}
          onChange={(value) =>
            setValues((current) => ({ ...current, comprar: value }))
          }
          onSubmit={submit("comprar")}
        />
        <OperationCard
          operation="resgatar"
          title="Resgatar saldo"
          description="Converta seu saldo em dinheiro fictício."
          value={values.resgatar}
          error={errors.resgatar}
          onChange={(value) =>
            setValues((current) => ({ ...current, resgatar: value }))
          }
          onSubmit={submit("resgatar")}
        />
      </div>
      <section>
        <h2 className="mb-3 font-display text-2xl font-black uppercase">
          Movimentações
        </h2>
        <VatHistory userId={session.userId} />
      </section>
      <p className="rounded-xl border border-dashed p-3 text-center text-xs text-muted-foreground">
        Ambiente demonstrativo. Integração com PIX em breve.
      </p>
    </div>
  );
}

function OperationCard({
  operation,
  title,
  description,
  value,
  error,
  onChange,
  onSubmit,
}: {
  operation: Operation;
  title: string;
  description: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  const credit = operation === "comprar";
  const accent = credit ? theme.color.success : theme.color.sell;
  const Icon = credit ? ArrowDownToLine : ArrowUpFromLine;
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border p-5"
      style={{
        background: theme.color.bgSurface,
        borderColor: theme.color.border,
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 items-center justify-center rounded-lg"
          style={{
            color: accent,
            background: credit ? theme.color.successBg : theme.color.sellBg,
          }}
        >
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-black uppercase">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <label
        className="mt-5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
        htmlFor={`wallet-${operation}`}
      >
        Quantidade de VAT
      </label>
      <div className="relative mt-2">
        <Input
          id={`wallet-${operation}`}
          type="number"
          min="1"
          step="1"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 pr-16"
          placeholder="0"
        />
        <span className="pointer-events-none absolute right-3 top-3.5 flex items-center gap-1 text-xs font-bold text-muted-foreground">
          <Coins className="size-3.5" /> VAT
        </span>
      </div>
      {error && (
        <p className="mt-2 text-xs" style={{ color: theme.color.error }}>
          {error}
        </p>
      )}
      <Button
        type="submit"
        className="mt-4 w-full"
        variant={credit ? "default" : "destructive"}
      >
        Confirmar {credit ? "compra" : "resgate"}
      </Button>
    </form>
  );
}
