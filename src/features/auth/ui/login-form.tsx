"use client";

import { loginSchema, loginService, type LoginFormData } from "@features/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { ROUTES } from "@shared/config/routes";
import { cn } from "@shared/lib/utils";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  function onSubmit(values: LoginFormData) {
    setServerError(null);
    const result = loginService(values.email, values.senha);

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
      data-testid="login-form"
      noValidate
    >
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="senha">Senha</Label>
        </div>
        <Input
          id="senha"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.senha}
          className={cn(
            errors.senha && "border-destructive focus-visible:ring-destructive",
          )}
          {...register("senha")}
        />
        {errors.senha && (
          <p className="text-xs text-destructive">{errors.senha.message}</p>
        )}
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
          <LogIn className="size-4" />
        )}
        Entrar
      </Button>

      <div className="mt-8 space-y-2 text-center text-xs text-muted-foreground">
        <p className="font-medium">Contas de demonstração:</p>

        <p>
          Maria:{" "}
          <span className="font-semibold text-foreground">maria@mail.com</span>{" "}
          / <span className="font-semibold text-foreground">password123</span>
        </p>
        <p>
          João:{" "}
          <span className="font-semibold text-foreground">joao@mail.com</span> /{" "}
          <span className="font-semibold text-foreground">password123</span>
        </p>
      </div>
    </form>
  );
}
