"use client";

import type { Anuncio } from "@entities/anuncio";
import { deleteAnuncioService, updateAnuncioService } from "@features/anuncios";
import {
  fetchGaragem,
  GaragemEmptyState,
  GaragemItemCard,
  GaragemTabs,
  type GaragemTab,
} from "@features/garagem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@shared/config/animation";

export function GaragemPage() {
  const { session, isLoading } = useAuth();
  const [items, setItems] = useState<Anuncio[]>([]);
  const [tab, setTab] = useState<GaragemTab>("TODOS");
  const [editing, setEditing] = useState<Anuncio | null>(null);
  const [error, setError] = useState("");
  const refresh = useCallback(() => {
    if (session) setItems(fetchGaragem(session.userId));
  }, [session]);
  useEffect(refresh, [refresh]);
  const visible =
    tab === "TODOS" ? items : items.filter((item) => item.status === tab);
  const counts = useMemo(
    () => ({
      TODOS: items.length,
      DISPONIVEL: items.filter((i) => i.status === "DISPONIVEL").length,
      EM_NEGOCIACAO: items.filter((i) => i.status === "EM_NEGOCIACAO").length,
      FINALIZADO: items.filter((i) => i.status === "FINALIZADO").length,
    }),
    [items],
  );

  function remove(anuncio: Anuncio) {
    if (!session || !window.confirm(`Excluir “${anuncio.titulo}”?`)) return;
    const result = deleteAnuncioService(anuncio.id, session.userId);
    if (!result.success) setError(result.error);
    else refresh();
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    const result = updateAnuncioService(editing.id, {
      titulo: String(data.get("titulo") ?? "").trim(),
      descricao: String(data.get("descricao") ?? "").trim(),
      marca: String(data.get("marca") ?? "").trim() || undefined,
      preco: data.get("preco") ? Number(data.get("preco")) : undefined,
      valorVAT: data.get("valorVAT") ? Number(data.get("valorVAT")) : undefined,
    });
    if (!result.success) setError(result.error);
    else {
      setEditing(null);
      setError("");
      refresh();
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-6xl py-6 sm:py-10"
      data-testid="garagem-page"
    >
      <motion.div variants={staggerItem} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
            Sua coleção
          </span>
          <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
            Garagem
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Gerencie suas peças publicadas e acompanhe o andamento de cada
            anúncio.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href={ROUTES.ANUNCIO_NOVO}>
            <Plus className="size-4" /> Nova peça
          </Link>
        </Button>
      </motion.div>
      {error && (
        <motion.p
          variants={staggerItem}
          className="mt-5 rounded-xl border p-3 text-sm"
          style={{
            color: theme.color.error,
            background: theme.color.errorBg,
            borderColor: theme.color.errorBorder,
          }}
        >
          {error}
        </motion.p>
      )}
      <motion.div variants={staggerItem} className="mt-7">
        <GaragemTabs value={tab} onChange={setTab} counts={counts} />
      </motion.div>
      {!isLoading && session && visible.length ? (
        <motion.div variants={staggerItem} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <GaragemItemCard
              key={item.id}
              anuncio={item}
              onEdit={setEditing}
              onDelete={remove}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div variants={staggerItem} className="mt-6">
          <GaragemEmptyState />
        </motion.div>
      )}
      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        {editing && (
          <DialogContent
            className="rounded-2xl"
            style={{
              background: theme.color.bgSurface,
              borderColor: theme.color.border,
            }}
          >
            <DialogHeader>
              <DialogTitle className="font-display text-3xl font-black uppercase">
                Editar peça
              </DialogTitle>
              <DialogDescription>
                Atualize os dados principais do seu anúncio.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  name="titulo"
                  required
                  minLength={3}
                  defaultValue={editing.titulo}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  name="descricao"
                  required
                  minLength={10}
                  defaultValue={editing.descricao}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="edit-brand">Marca</Label>
                <Input
                  id="edit-brand"
                  name="marca"
                  defaultValue={editing.marca}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-price">Preço (R$)</Label>
                  <Input
                    id="edit-price"
                    name="preco"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={editing.preco}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-vat">Valor VAT</Label>
                  <Input
                    id="edit-vat"
                    name="valorVAT"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={editing.valorVAT}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar alterações</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </motion.div>
  );
}
