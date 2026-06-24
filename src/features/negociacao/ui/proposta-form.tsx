"use client";

import type { Anuncio } from "@entities/anuncio";
import type { Proposta, TipoProposta } from "@entities/proposta";
import { fetchGaragem } from "@features/garagem";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { Coins, Repeat2 } from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { createPropostaService } from "../api/create-proposta";
import { propostaSchema } from "../model/negociacao-schemas";

export function PropostaForm({
  anuncio,
  onSuccess,
}: {
  anuncio: Anuncio;
  onSuccess?: (proposta: Proposta) => void;
}) {
  const { session } = useAuth();
  const [tipo, setTipo] = useState<TipoProposta>(
    anuncio.tipo === "TROCA" ? "TROCA" : "COMPRA",
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedDesejados, setSelectedDesejados] = useState<string[]>([]);
  const [error, setError] = useState("");
  const garage = useMemo(
    () =>
      session
        ? fetchGaragem(session.userId, "DISPONIVEL").filter(
            (item) => item.id !== anuncio.id,
          )
        : [],
    [session, anuncio.id],
  );
  const sellerGarage = useMemo(
    () =>
      fetchGaragem(anuncio.userId, "DISPONIVEL").filter(
        (item) => item.id !== anuncio.id,
      ),
    [anuncio.userId, anuncio.id],
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setError("Faça login para enviar uma proposta.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const raw = {
      anuncioId: anuncio.id,
      vendedorId: anuncio.userId,
      tipo,
      valorOfertado: data.get("valorOfertado") || undefined,
      vatOfertado: data.get("vatOfertado") || undefined,
      itensOfertados: selected.map((anuncioId) => ({ anuncioId })),
      itensDesejados: selectedDesejados.map((anuncioId) => ({ anuncioId })),
      mensagemInicial: String(data.get("mensagemInicial") ?? "") || undefined,
    };
    const parsed = propostaSchema.safeParse(raw);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Revise os dados da proposta.",
      );
      return;
    }
    const result = createPropostaService(session.userId, parsed.data);
    if (!result.success) setError(result.error);
    else onSuccess?.(result.data);
  }
  return (
    <form onSubmit={submit} className="space-y-4" data-testid="proposta-form">
      <div className="grid grid-cols-3 gap-2">
        {(["COMPRA", "TROCA", "MISTA"] as TipoProposta[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTipo(value)}
            className="rounded-lg border p-2 text-xs font-bold"
            style={{
              color:
                tipo === value
                  ? theme.color.primaryFg
                  : theme.color.textSecondary,
              background:
                tipo === value ? theme.color.primary : theme.color.bgSurface2,
              borderColor:
                tipo === value ? theme.color.primary : theme.color.border,
            }}
          >
            {value}
          </button>
        ))}
      </div>
      {tipo !== "TROCA" && (
        <div>
          <Label htmlFor="proposal-value">Oferta em reais</Label>
          <Input
            id="proposal-value"
            name="valorOfertado"
            type="number"
            min="1"
            step="0.01"
            className="mt-1.5"
            placeholder="0,00"
          />
        </div>
      )}
      <div>
        <Label htmlFor="proposal-vat">Complemento em VAT (opcional)</Label>
        <div className="relative mt-1.5">
          <Input
            id="proposal-vat"
            name="vatOfertado"
            type="number"
            min="1"
            step="1"
            className="pr-14"
          />
          <Coins className="absolute right-3 top-2.5 size-4 text-primary" />
        </div>
      </div>
      {tipo !== "COMPRA" && (
        <div>
          <Label>Peças oferecidas</Label>
          <div className="mt-2 max-h-36 space-y-2 overflow-auto">
            {garage.length ? (
              garage.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm"
                  style={{
                    borderColor: selected.includes(item.id)
                      ? theme.color.borderSwap
                      : theme.color.border,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() =>
                      setSelected((current) =>
                        current.includes(item.id)
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id],
                      )
                    }
                  />
                  <Repeat2
                    className="size-4"
                    style={{ color: theme.color.swap }}
                  />{" "}
                  {item.titulo}
                </label>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Você não tem peças disponíveis para troca.
              </p>
            )}
          </div>
        </div>
      )}
      {tipo !== "COMPRA" && sellerGarage.length > 0 && (
        <div>
          <Label>Mais peças desejadas do vendedor (Opcional)</Label>
          <div className="mt-2 max-h-36 space-y-2 overflow-auto">
            {sellerGarage.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm"
                style={{
                  borderColor: selectedDesejados.includes(item.id)
                    ? theme.color.borderSwap
                    : theme.color.border,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedDesejados.includes(item.id)}
                  onChange={() =>
                    setSelectedDesejados((current) =>
                      current.includes(item.id)
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id],
                    )
                  }
                />
                <Repeat2
                  className="size-4"
                  style={{ color: theme.color.swap }}
                />{" "}
                {item.titulo}
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <Label htmlFor="proposal-message">Mensagem</Label>
        <Textarea
          id="proposal-message"
          name="mensagemInicial"
          maxLength={500}
          className="mt-1.5"
          placeholder="Conte por que esta proposta pode ser um bom acordo."
        />
      </div>
      {error && (
        <p className="text-xs" style={{ color: theme.color.error }}>
          {error}
        </p>
      )}
      <Button type="submit" className="w-full">
        Enviar proposta
      </Button>
    </form>
  );
}
