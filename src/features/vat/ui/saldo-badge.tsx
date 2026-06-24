"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shared/components/ui/dialog";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { Coins, History } from "lucide-react";
import { useEffect } from "react";

import { fetchSaldoVAT } from "../api/fetch-saldo";
import {
  VAT_UPDATED_EVENT,
  type VatUpdatedEventDetail,
} from "../model/vat-events";
import { useVatStore } from "../model/vat-store";
import { VatHistory } from "./vat-history";

export function SaldoBadge() {
  const { session, isAuthenticated, isLoading } = useAuth();
  const saldo = useVatStore((state) => state.saldo);
  const setSaldo = useVatStore((state) => state.setSaldo);

  useEffect(() => {
    if (!session) {
      setSaldo(0);
      return;
    }

    setSaldo(fetchSaldoVAT(session.userId));

    const handleVatUpdated = (event: Event) => {
      const detail = (event as CustomEvent<VatUpdatedEventDetail>).detail;
      if (detail.userId === session.userId) setSaldo(detail.saldo);
    };

    window.addEventListener(VAT_UPDATED_EVENT, handleVatUpdated);
    return () =>
      window.removeEventListener(VAT_UPDATED_EVENT, handleVatUpdated);
  }, [session, setSaldo]);

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />;
  }

  if (!isAuthenticated || !session) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-primary/30 bg-primary/10 px-3 text-primary hover:bg-primary/15 hover:text-primary"
          data-testid="saldo-badge"
          aria-label={`${saldo} VAT disponíveis. Abrir extrato.`}
        >
          <Coins className="size-4" />
          <span className="font-display text-base font-black tabular-nums">
            {saldo}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            VAT
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-xl rounded-2xl border"
        style={{
          background: theme.color.bgSurface,
          borderColor: theme.color.borderPrimary,
          boxShadow: theme.shadow.modal,
        }}
      >
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <History className="size-5" />
          </div>
          <DialogTitle className="font-display text-3xl font-black uppercase">
            Extrato VAT
          </DialogTitle>
          <DialogDescription>
            Acompanhe todas as entradas e saídas da sua moeda virtual.
          </DialogDescription>
        </DialogHeader>
        <VatHistory userId={session.userId} />
      </DialogContent>
    </Dialog>
  );
}
