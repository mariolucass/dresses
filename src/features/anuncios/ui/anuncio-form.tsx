"use client";

import { createAnuncioService } from "@features/anuncios/api/create-anuncio";
import {
  anuncioSchema,
  type AnuncioFormData,
} from "@features/anuncios/model/anuncio-schemas";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Textarea } from "@shared/components/ui/textarea";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { Camera, ImagePlus, Info, Loader2, Plus, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useState } from "react";

const defaultValues: AnuncioFormData = {
  titulo: "",
  descricao: "",
  marca: "",
  fotos: [],
  tipo: "VENDA",
  categoria: "ROUPAS_FEMININAS",
  condicao: "SEMINOVO",
  tamanho: "",
};

export function AnuncioForm() {
  const router = useRouter();
  const { session } = useAuth();
  const [values, setValues] = useState<AnuncioFormData>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = <K extends keyof AnuncioFormData>(
    key: K,
    value: AnuncioFormData[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handlePhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(
      0,
      5 - values.fotos.length,
    );
    const previews = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    );
    updateValue("fotos", [...values.fotos, ...previews].slice(0, 5));
  };

  const removePhoto = (photo: string) => {
    updateValue(
      "fotos",
      values.fotos.filter((item) => item !== photo),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const parsed = anuncioSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) nextErrors[String(path)] = issue.message;
      });
      setErrors(nextErrors);
      setIsSubmitting(false);
      return;
    }

    const result = createAnuncioService({
      ...parsed.data,
      marca: parsed.data.marca || undefined,
      userId: session?.userId ?? "demo-user",
    });

    setIsSubmitting(false);
    if (result.success) {
      router.push(ROUTES.ANUNCIO_DETALHE(result.data.id));
    }
  };

  return (
    <form
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"
      onSubmit={handleSubmit}
      data-testid="anuncio-form"
    >
      <section
        className="relative space-y-5 overflow-hidden rounded-2xl border p-5 lg:sticky lg:top-24"
        style={{
          background: theme.gradient.section,
          borderColor: theme.color.border,
          boxShadow: theme.shadow.card,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: theme.gradient.accentLine }}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Camera className="size-4" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold uppercase leading-none">
                Fotos da peça
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Até 5 imagens · {values.fotos.length}/5 adicionadas
              </p>
            </div>
          </div>
          <Label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/15">
            <ImagePlus className="size-4" />
            <span className="hidden sm:inline">Adicionar</span>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handlePhotos}
              disabled={values.fotos.length >= 5}
            />
          </Label>
        </div>
        {errors.fotos ? (
          <p
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              color: theme.color.error,
              background: theme.color.errorBg,
              borderColor: theme.color.errorBorder,
            }}
          >
            {errors.fotos}
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          {values.fotos.map((photo, index) => (
            <div
              key={photo}
              className="group relative overflow-hidden rounded-[10px] border bg-muted"
              style={{ borderColor: theme.color.border }}
            >
              <img
                src={photo}
                alt={`Prévia do anúncio ${index + 1}`}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-primary backdrop-blur">
                  Capa
                </span>
              )}
              <button
                type="button"
                aria-label="Remover foto"
                className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full border bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-destructive/40 hover:text-destructive"
                onClick={() => removePhoto(photo)}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
          {values.fotos.length === 0 ? (
            <label
              className="col-span-2 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed text-center text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
              style={{
                background: theme.color.bgSurface2,
                borderColor: theme.color.borderStrong,
              }}
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ImagePlus className="size-6" />
              </span>
              <strong className="mt-3 font-display text-xl uppercase text-foreground">
                Mostre os detalhes
              </strong>
              <span className="mt-1 text-xs">
                Clique para selecionar suas melhores fotos
              </span>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handlePhotos}
              />
            </label>
          ) : null}
        </div>

        <div
          className="flex gap-2 rounded-lg border p-3 text-xs leading-relaxed text-muted-foreground"
          style={{
            background: theme.color.infoBg,
            borderColor: theme.color.infoBorder,
          }}
        >
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Use luz natural e fotografe possíveis detalhes. A primeira imagem será
          a capa do anúncio.
        </div>
      </section>

      <section
        className="relative space-y-6 overflow-hidden rounded-2xl border p-5 sm:p-6"
        style={{
          background: theme.color.bgSurface,
          borderColor: theme.color.border,
          boxShadow: theme.shadow.card,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: theme.gradient.accentLineFull }}
        />
        <div className="flex items-center gap-3 border-b pb-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Tag className="size-4" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-none">
              Informações do anúncio
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Conte o que torna esta peça especial
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" error={errors.titulo} className="sm:col-span-2">
            <Input
              value={values.titulo}
              onChange={(event) => updateValue("titulo", event.target.value)}
              placeholder="Vestido midi floral"
            />
          </Field>
          <Field label="Marca" error={errors.marca}>
            <Input
              value={values.marca ?? ""}
              onChange={(event) => updateValue("marca", event.target.value)}
              placeholder="Farm, Zara, garimpo..."
            />
          </Field>
          <Field label="Tamanho" error={errors.tamanho}>
            <Input
              value={values.tamanho}
              onChange={(event) => updateValue("tamanho", event.target.value)}
              placeholder="P, M, 38, único"
            />
          </Field>
          <Field label="Categoria" error={errors.categoria}>
            <Select
              value={values.categoria}
              onValueChange={(value) =>
                updateValue("categoria", value as AnuncioFormData["categoria"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROUPAS_FEMININAS">
                  Roupas femininas
                </SelectItem>
                <SelectItem value="ROUPAS_MASCULINAS">
                  Roupas masculinas
                </SelectItem>
                <SelectItem value="INFANTIL">Infantil</SelectItem>
                <SelectItem value="CALCADOS">Calçados</SelectItem>
                <SelectItem value="ACESSORIOS">Acessórios</SelectItem>
                <SelectItem value="BOLSAS">Bolsas</SelectItem>
                <SelectItem value="ESPORTES">Esportes</SelectItem>
                <SelectItem value="FESTA">Festa</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Condição" error={errors.condicao}>
            <Select
              value={values.condicao}
              onValueChange={(value) =>
                updateValue("condicao", value as AnuncioFormData["condicao"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOVO">Novo com etiqueta</SelectItem>
                <SelectItem value="SEMINOVO">Ótimo estado</SelectItem>
                <SelectItem value="USADO_BOM">Bom estado</SelectItem>
                <SelectItem value="USADO_REGULAR">Com detalhes</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tipo" error={errors.tipo}>
            <Select
              value={values.tipo}
              onValueChange={(value) =>
                updateValue("tipo", value as AnuncioFormData["tipo"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VENDA">Venda</SelectItem>
                <SelectItem value="TROCA">Troca</SelectItem>
                <SelectItem value="AMBOS">Venda ou troca</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {values.tipo !== "TROCA" && (
            <Field label="Preço em reais" error={errors.preco}>
              <Input
                type="number"
                min={0}
                value={values.preco ?? ""}
                onChange={(event) =>
                  updateValue(
                    "preco",
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                placeholder="85"
              />
            </Field>
          )}
          <Field label="Valor VAT" error={errors.valorVAT}>
            <Input
              type="number"
              min={0}
              value={values.valorVAT ?? ""}
              onChange={(event) =>
                updateValue(
                  "valorVAT",
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
              placeholder="50"
            />
          </Field>
          <Field
            label="Descrição"
            error={errors.descricao}
            className="sm:col-span-2"
          >
            <Textarea
              value={values.descricao}
              onChange={(event) => updateValue("descricao", event.target.value)}
              placeholder="Conte o estado, caimento, medidas e possibilidades de troca."
              className="min-h-32 resize-none bg-background/60"
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.ANUNCIOS)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            className="gap-2 px-7 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Publicar anúncio
          </Button>
        </div>
      </section>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
