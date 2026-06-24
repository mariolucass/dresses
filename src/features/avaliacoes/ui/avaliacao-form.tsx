"use client";

import type { Avaliacao, NotaAvaliacao } from "@entities/avaliacao";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { Loader2, Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { createAvaliacaoService } from "../api/create-avaliacao";
import { avaliacaoSchema } from "../model/avaliacao-schemas";
import { AvaliacaoStars } from "./avaliacao-stars";

interface AvaliacaoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  negociacaoId: string;
  avaliadoId: string;
  avaliadoNome?: string;
  onSuccess?: (avaliacao: Avaliacao) => void;
}

export function AvaliacaoForm({
  open,
  onOpenChange,
  negociacaoId,
  avaliadoId,
  avaliadoNome = "a outra pessoa",
  onSuccess,
}: AvaliacaoFormProps) {
  const { session } = useAuth();
  const [nota, setNota] = useState<NotaAvaliacao | 0>(0);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNota(0);
    setComentario("");
    setError(null);
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!session) {
      setError("Você precisa estar autenticado para avaliar.");
      return;
    }

    const parsed = avaliacaoSchema.safeParse({
      negociacaoId,
      avaliadoId,
      nota,
      comentario: comentario.trim() || undefined,
    });

    if (!parsed.success) {
      setError(
        nota === 0
          ? "Escolha uma nota de 1 a 5 estrelas."
          : (parsed.error.issues[0]?.message ??
              "Revise os dados da avaliação."),
      );
      return;
    }

    setIsSubmitting(true);
    const result = createAvaliacaoService(session.userId, parsed.data);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onSuccess?.(result.data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md rounded-2xl border"
        style={{
          background: theme.color.bgSurface,
          borderColor: theme.color.borderPrimary,
          boxShadow: theme.shadow.modal,
        }}
        data-testid="avaliacao-form"
      >
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <DialogTitle className="font-display text-3xl font-black uppercase">
            Como foi a negociação?
          </DialogTitle>
          <DialogDescription>
            Sua avaliação sobre {avaliadoNome} ajuda a manter a comunidade
            segura e transparente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center gap-2">
            <AvaliacaoStars value={nota} onChange={setNota} size="lg" />
            <span className="text-xs text-muted-foreground">
              {nota === 0 ? "Selecione uma nota" : `${nota} de 5 estrelas`}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="avaliacao-comentario">Comentário opcional</Label>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {comentario.length}/500
              </span>
            </div>
            <Textarea
              id="avaliacao-comentario"
              value={comentario}
              onChange={(event) => setComentario(event.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Conte como foi comprar, vender ou trocar com essa pessoa..."
              className="min-h-28 resize-none bg-background"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border px-3 py-2 text-sm"
              style={{
                color: theme.color.error,
                background: theme.color.errorBg,
                borderColor: theme.color.errorBorder,
              }}
            >
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 sm:space-x-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Agora não
            </Button>
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Enviar avaliação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
