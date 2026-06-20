"use client";

import type { User, UserRole } from "@entities/user/model/user.types";
import { getCurrentUserService, logoutService } from "@features/auth";
import { ROUTES } from "@shared/config/routes";
import { spring1 } from "@shared/config/animation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shared/components/ui/avatar";
import { Badge } from "@shared/components/ui/badge";
import { Card, CardContent } from "@shared/components/ui/card";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import {
  Coins,
  Loader2,
  LogOut,
  Mail,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ROLE_LABEL: Record<UserRole, string> = {
  AMBOS: "Compra e venda",
  COMPRADOR: "Comprador",
  VENDEDOR: "Vendedor",
};

function ReputationStars({ media }: { media: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${media} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.round(media);
        return (
          <Star
            key={index}
            className={filled ? "size-4 fill-current text-amber-400" : "size-4 text-muted-foreground/30"}
          />
        );
      })}
    </div>
  );
}

export function PerfilPage() {
  const router = useRouter();
  const { session, isAuthenticated, isLoading: isAuthLoading, clearSession } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !session) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    setUser(getCurrentUserService(session.userId));
    setIsLoadingUser(false);
  }, [isAuthLoading, isAuthenticated, session, router]);

  function handleLogout() {
    logoutService();
    clearSession();
    router.push(ROUTES.HOME);
  }

  if (isAuthLoading || isLoadingUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" data-testid="perfil-page">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center" data-testid="perfil-page">
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar seu perfil. Tente entrar novamente.
        </p>
        <Button onClick={() => router.push(ROUTES.LOGIN)}>Ir para o login</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring1}
      className="mx-auto max-w-3xl space-y-6"
      data-testid="perfil-page"
    >
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="-mt-10 flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end">
            <Avatar className="size-20 border-4 border-card shadow-md">
              <AvatarImage src={user.avatar} alt={user.nome} />
              <AvatarFallback className="text-lg">
                {user.nome.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="font-serif text-xl font-medium">{user.nome}</h1>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Mail className="size-3.5" />
                {user.email}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                <Badge variant="secondary">{ROLE_LABEL[user.role]}</Badge>
                <span className="text-xs text-muted-foreground">
                  Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <Button variant="outline" className="gap-2" onClick={handleLogout} data-testid="logout-button">
            <LogOut className="size-4" />
            Sair da conta
          </Button>
        </CardContent>
      </Card>

      {user.bio && (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col gap-2 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="size-4" />
              Reputação
            </div>
            <ReputationStars media={user.avaliacaoMedia} />
            <p className="text-xs text-muted-foreground">
              {user.avaliacaoMedia.toFixed(1)} de 5 · {user.totalAvaliacoes}{" "}
              {user.totalAvaliacoes === 1 ? "avaliação" : "avaliações"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-2 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="size-4" />
              Saldo VAT
            </div>
            <p className="font-serif text-2xl">{user.saldoVAT}</p>
            <p className="text-xs text-muted-foreground">pontos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-2 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="size-4" />
              Função
            </div>
            <p className="font-serif text-2xl">{ROLE_LABEL[user.role]}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="size-3" />
              Você pode mudar isso em breve
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

