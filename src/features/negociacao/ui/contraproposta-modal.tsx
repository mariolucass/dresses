"use client";

import type { Proposta } from "@entities/proposta";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";
import type { FormEvent } from "react";
import { useState } from "react";
import { respondPropostaService } from "../api/respond-proposta";

export function ContrapropostaModal({
  proposta,
  open,
  onOpenChange,
  onSuccess,
  actorId,
}: {
  proposta: Proposta;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  actorId: string;
}) {
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const valor = Number(data.get("valor") || 0);
    const vat = Number(data.get("vat") || 0);
    if (valor <= 0 && vat <= 0) {
      setError("Informe um valor para a contraproposta.");
      return;
    }
    const result = respondPropostaService({
      propostaId: proposta.id,
      actorId,
      resposta: "CONTRAPROPOSTA",
      contrapropostaData: {
        ...proposta,
        contrapropostaRef: proposta.id,
        valorOfertado: valor || undefined,
        vatOfertado: vat || undefined,
      },
    });
    if (!result.success) setError(result.error);
    else {
      setError("");
      onOpenChange(false);
      onSuccess?.();
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl"
        style={{
          background: theme.color.bgSurface,
          borderColor: theme.color.borderSwap,
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-black uppercase">
            Contraproposta
          </DialogTitle>
          <DialogDescription>
            Ajuste os valores para continuar a negociação.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="counter-value">Valor em reais</Label>
            <Input
              id="counter-value"
              name="valor"
              type="number"
              min="0"
              step="0.01"
              defaultValue={proposta.valorOfertado}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="counter-vat">VAT</Label>
            <Input
              id="counter-vat"
              name="vat"
              type="number"
              min="0"
              step="1"
              defaultValue={proposta.vatOfertado}
              className="mt-1.5"
            />
          </div>
          {error && (
            <p className="text-xs" style={{ color: theme.color.error }}>
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            Enviar contraproposta
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
