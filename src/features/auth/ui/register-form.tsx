"use client";

import {
  registerSchema,
  registerService,
  type RegisterFormData,
} from "@features/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { ROUTES } from "@shared/config/routes";
import { cn } from "@shared/lib/utils";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const ROLE_OPTIONS = [
  { value: "AMBOS", label: "Comprar e vender" },
  { value: "COMPRADOR", label: "Só comprar" },
  { value: "VENDEDOR", label: "Só vender" },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      role: "AMBOS",
    },
  });

  function onSubmit(values: RegisterFormData) {
    setServerError(null);
    const { confirmarSenha, ...dto } = values;

    const result = registerService(dto);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    setSession(result.data);
    router.push(ROUTES.ANUNCIOS);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      data-testid="register-form"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          autoComplete="name"
          placeholder="Seu nome"
          aria-invalid={!!errors.nome}
          className={cn(
            errors.nome && "border-destructive focus-visible:ring-destructive",
          )}
          {...register("nome")}
        />
        {errors.nome && (
          <p className="text-xs text-destructive">{errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          aria-invalid={!!errors.email}
          className={cn(
            errors.email && "border-destructive focus-visible:ring-destructive",
          )}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.senha}
            className={cn(
              errors.senha &&
                "border-destructive focus-visible:ring-destructive",
            )}
            {...register("senha")}
          />
          {errors.senha && (
            <p className="text-xs text-destructive">{errors.senha.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmarSenha">Confirmar senha</Label>
          <Input
            id="confirmarSenha"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmarSenha}
            className={cn(
              errors.confirmarSenha &&
                "border-destructive focus-visible:ring-destructive",
            )}
            {...register("confirmarSenha")}
          />
          {errors.confirmarSenha && (
            <p className="text-xs text-destructive">
              {errors.confirmarSenha.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">O que você quer fazer no Brechó?</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        className="w-full gap-2"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserPlus className="size-4" />
        )}
        Criar conta
      </Button>
    </form>
  );
}
