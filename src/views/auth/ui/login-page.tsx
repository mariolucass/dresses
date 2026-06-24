"use client";

import { LoginForm } from "@features/auth";
import { spring1 } from "@shared/config/animation";
import { ROUTES } from "@shared/config/routes";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { AuthBrandingPanel } from "./auth-branding-panel";

export function LoginPage() {
  return (
    <div
      className="flex min-h-[640px] w-full max-w-4xl overflow-hidden rounded-2xl border bg-card"
      style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
      data-testid="login-page"
    >
      <AuthBrandingPanel />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring1}
        className="flex w-full flex-col justify-center gap-10 p-6 sm:p-8 md:w-[56%] md:p-14"
      >
        <div className="space-y-4">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Voltar para o início
          </Link>
          <div className="flex items-center gap-3">
            <Image src="/desapeguei_logo.png" alt="Desapeguei" width={32} height={32} className="md:hidden rounded-lg bg-[var(--theme-surface2)] object-contain" />
            <h1 className="font-display text-4xl font-black uppercase leading-none">
              Bem-vindo de volta
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Entre com sua conta para continuar comprando, vendendo e trocando.
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link
            href={ROUTES.CADASTRO}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Criar conta gratuita
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
