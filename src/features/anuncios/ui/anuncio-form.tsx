"use client";

import { createAnuncioService } from "@features/anuncios/api/create-anuncio";
import { anuncioSchema, type AnuncioFormData } from "@features/anuncios/model/anuncio-schemas";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
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
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
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
    const files = Array.from(event.target.files ?? []).slice(0, 5 - values.fotos.length);
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
    <form className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" onSubmit={handleSubmit} data-testid="anuncio-form">
      <section className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Fotos</h2>
            <p className="text-sm text-muted-foreground">Ate 5 imagens da peca.</p>
          </div>
          <Label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border px-4 text-sm transition hover:bg-accent">
            <ImagePlus className="h-4 w-4" />
            Adicionar
            <Input type="file" accept="image/*" multiple className="sr-only" onChange={handlePhotos} />
          </Label>
        </div>
        {errors.fotos ? <p className="text-sm text-destructive">{errors.fotos}</p> : null}
        <div className="grid grid-cols-2 gap-3">
          {values.fotos.map((photo) => (
            <div key={photo} className="relative overflow-hidden rounded-lg border bg-muted">
              <img src={photo} alt="Preview do anuncio" className="aspect-square w-full object-cover" />
              <button
                type="button"
                aria-label="Remover foto"
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm"
                onClick={() => removePhoto(photo)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {values.fotos.length === 0 ? (
            <div className="col-span-2 flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 text-center text-sm text-muted-foreground">
              <ImagePlus className="mb-2 h-8 w-8" />
              Upload simulado de fotos
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-5 rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titulo" error={errors.titulo} className="sm:col-span-2">
            <Input value={values.titulo} onChange={(event) => updateValue("titulo", event.target.value)} placeholder="Vestido midi floral" />
          </Field>
          <Field label="Marca" error={errors.marca}>
            <Input value={values.marca ?? ""} onChange={(event) => updateValue("marca", event.target.value)} placeholder="Farm, Zara, garimpo..." />
          </Field>
          <Field label="Tamanho" error={errors.tamanho}>
            <Input value={values.tamanho} onChange={(event) => updateValue("tamanho", event.target.value)} placeholder="P, M, 38, unico" />
          </Field>
          <Field label="Categoria" error={errors.categoria}>
            <Select value={values.categoria} onValueChange={(value) => updateValue("categoria", value as AnuncioFormData["categoria"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ROUPAS_FEMININAS">Roupas femininas</SelectItem>
                <SelectItem value="ROUPAS_MASCULINAS">Roupas masculinas</SelectItem>
                <SelectItem value="INFANTIL">Infantil</SelectItem>
                <SelectItem value="CALCADOS">Calcados</SelectItem>
                <SelectItem value="ACESSORIOS">Acessorios</SelectItem>
                <SelectItem value="BOLSAS">Bolsas</SelectItem>
                <SelectItem value="ESPORTES">Esportes</SelectItem>
                <SelectItem value="FESTA">Festa</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Condicao" error={errors.condicao}>
            <Select value={values.condicao} onValueChange={(value) => updateValue("condicao", value as AnuncioFormData["condicao"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NOVO">Novo</SelectItem>
                <SelectItem value="SEMINOVO">Seminovo</SelectItem>
                <SelectItem value="USADO_BOM">Usado bom</SelectItem>
                <SelectItem value="USADO_REGULAR">Usado regular</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tipo" error={errors.tipo}>
            <Select value={values.tipo} onValueChange={(value) => updateValue("tipo", value as AnuncioFormData["tipo"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="VENDA">Venda</SelectItem>
                <SelectItem value="TROCA">Troca</SelectItem>
                <SelectItem value="AMBOS">Venda ou troca</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Preco" error={errors.preco}>
            <Input type="number" min={0} value={values.preco ?? ""} onChange={(event) => updateValue("preco", event.target.value ? Number(event.target.value) : undefined)} placeholder="85" />
          </Field>
          <Field label="Valor VAT" error={errors.valorVAT}>
            <Input type="number" min={0} value={values.valorVAT ?? ""} onChange={(event) => updateValue("valorVAT", event.target.value ? Number(event.target.value) : undefined)} placeholder="50" />
          </Field>
          <Field label="Descricao" error={errors.descricao} className="sm:col-span-2">
            <Textarea value={values.descricao} onChange={(event) => updateValue("descricao", event.target.value)} placeholder="Conte estado, caimento, medidas e possibilidades de troca." className="min-h-32" />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push(ROUTES.ANUNCIOS)}>
            Cancelar
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Publicar anuncio
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
      <Label className="mb-2 block">{label}</Label>
      {children}
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
