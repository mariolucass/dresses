"use client";

import { RegisterForm } from "@features/auth";
import { ROUTES } from "@shared/config/routes";
import { spring1 } from "@shared/config/animation";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { AuthBrandingPanel } from "./auth-branding-panel";

export function RegisterPage() {
  return (
    <div
      className="flex w-full max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-xl"
      data-testid="register-page"
    >
      <AuthBrandingPanel />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring1}
        className="flex w-full flex-col justify-center gap-6 p-8 md:w-[56%] md:p-12"
      >
        <div className="space-y-1.5">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Voltar para o início
          </Link>
          <h1 className="font-serif text-2xl font-medium">Crie sua conta</h1>
          <p className="text-sm text-muted-foreground">
            Leva menos de um minuto. Você já começa com um bônus de boas-vindas em VAT.
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href={ROUTES.LOGIN} className="font-medium text-foreground underline-offset-4 hover:underline">
            Fazer login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
