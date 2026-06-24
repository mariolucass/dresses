"use client";

import { logoutService } from "@features/auth";
import { SaldoBadge } from "@features/vat";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { cn } from "@shared/lib/utils";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ChevronDown,
  Handshake,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Shirt,
  Sparkles,
  Star,
  Sun,
  UserRound,
  WalletCards,
  Warehouse,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface HeaderMenuItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accent?: "lime" | "terra" | "violet";
}

interface HeaderMenu {
  label: string;
  eyebrow: string;
  description: string;
  activeWhen: (pathname: string) => boolean;
  items: HeaderMenuItem[];
}

const DESKTOP_MENUS: HeaderMenu[] = [
  {
    label: "Explorar",
    eyebrow: "Marketplace",
    description: "Descubra peças únicas e novos garimpos da comunidade.",
    activeWhen: (pathname) =>
      pathname === ROUTES.ANUNCIOS ||
      (pathname.startsWith(`${ROUTES.ANUNCIOS}/`) &&
        pathname !== ROUTES.ANUNCIO_NOVO),
    items: [
      {
        href: ROUTES.ANUNCIOS,
        label: "Todos os anúncios",
        description: "Explore o catálogo completo",
        icon: Search,
        accent: "lime",
      },
      {
        href: ROUTES.GARAGEM,
        label: "Minha garagem",
        description: "Peças salvas e seu acervo",
        icon: Warehouse,
        accent: "violet",
      },
    ],
  },
  {
    label: "Circular",
    eyebrow: "Venda & troca",
    description: "Abra espaço no armário e coloque boas peças em movimento.",
    activeWhen: (pathname) =>
      pathname === ROUTES.ANUNCIO_NOVO || pathname.startsWith(ROUTES.GARAGEM),
    items: [
      {
        href: ROUTES.ANUNCIO_NOVO,
        label: "Publicar uma peça",
        description: "Crie um anúncio em poucos passos",
        icon: Plus,
        accent: "terra",
      },
      {
        href: ROUTES.GARAGEM,
        label: "Gerenciar garagem",
        description: "Organize anúncios e favoritos",
        icon: Shirt,
        accent: "violet",
      },
    ],
  },
  {
    label: "Negociar",
    eyebrow: "Acordos & reputação",
    description: "Acompanhe propostas, conversas e sua presença na comunidade.",
    activeWhen: (pathname) =>
      pathname.startsWith(ROUTES.NEGOCIACOES) ||
      pathname.startsWith(ROUTES.PERFIL),
    items: [
      {
        href: ROUTES.NEGOCIACOES,
        label: "Negociações",
        description: "Propostas e conversas ativas",
        icon: Handshake,
        accent: "terra",
      },
      {
        href: ROUTES.PERFIL,
        label: "Perfil e reputação",
        description: "Veja avaliações e seus dados",
        icon: UserRound,
        accent: "lime",
      },
      {
        href: ROUTES.CARTEIRA,
        label: "Carteira VAT",
        description: "Saldo, compra, resgate e extrato",
        icon: WalletCards,
        accent: "lime",
      },
      {
        href: ROUTES.PERFIL_AVALIACOES,
        label: "Minhas avaliações",
        description: "Experiências compartilhadas",
        icon: Star,
        accent: "violet",
      },
    ],
  },
];

const ACCENT_STYLE = {
  lime: {
    color: theme.color.primary,
    background: theme.brand.limeAlpha10,
    border: theme.color.borderPrimary,
  },
  terra: {
    color: theme.color.sell,
    background: theme.color.sellBg,
    border: theme.color.borderSell,
  },
  violet: {
    color: theme.color.swap,
    background: theme.color.swapBg,
    border: theme.color.borderSwap,
  },
} as const;

interface AppHeaderProps {
  /** Área reservada para a marca. Aceita uma imagem, SVG ou componente de logo. */
  logo?: ReactNode;
}

function getInitials(name?: string) {
  if (!name) return "BO";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AppHeader({ logo }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isAuthenticated, isLoading, clearSession } = useAuth();

  function isActiveRoute(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    logoutService();
    clearSession();
    router.push(ROUTES.HOME);
  }

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-30 border-b backdrop-blur-2xl"
      style={{
        background: "var(--theme-header-bg)",
        borderColor: theme.color.border,
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: theme.gradient.accentLineFull }}
      />

      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8 lg:gap-6">
        <BrandLogo logo={logo} />

        <nav
          className="hidden h-full items-center gap-1 lg:flex"
          aria-label="Navegação principal"
        >
          {DESKTOP_MENUS.map((menu) => (
            <HoverNavigationMenu
              key={menu.label}
              menu={menu}
              active={menu.activeWhen(pathname)}
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <SaldoBadge />

          <Button
            asChild
            size="sm"
            className="hidden h-10 gap-2 rounded-lg px-4 font-semibold xl:inline-flex"
          >
            <Link href={ROUTES.ANUNCIO_NOVO}>
              <Plus className="size-4" />
              Novo anúncio
            </Link>
          </Button>

          <MobileNavigation isActiveRoute={isActiveRoute} />

          {isLoading ? (
            <div
              className="size-10 animate-pulse rounded-full bg-muted"
              aria-label="Carregando usuário"
            />
          ) : isAuthenticated && session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-11 gap-2 rounded-xl px-1.5 hover:bg-[var(--theme-bg-surface-hover)] sm:px-2"
                  aria-label="Abrir menu do usuário"
                >
                  <Avatar
                    className="size-9 border"
                    style={{ borderColor: theme.color.borderPrimary }}
                  >
                    <AvatarImage src={session.avatar} alt={session.nome} />
                    <AvatarFallback className="bg-primary font-display font-bold text-primary-foreground">
                      {getInitials(session.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 text-left sm:block">
                    <span className="block truncate text-xs font-semibold">
                      {session.nome}
                    </span>
                    <span className="block text-[9px] uppercase tracking-widest text-muted-foreground">
                      Minha conta
                    </span>
                  </span>
                  <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-72 rounded-xl p-2"
              >
                <DropdownMenuLabel className="p-3 font-normal">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {session.nome}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {session.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg p-3">
                  <Link href={ROUTES.PERFIL} className="cursor-pointer">
                    <UserRound className="size-4 text-primary" />
                    <span>
                      <strong className="block text-sm">Meu perfil</strong>
                      <span className="text-[11px] text-muted-foreground">
                        Reputação e dados pessoais
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg p-3">
                  <Link
                    href={ROUTES.PERFIL_AVALIACOES}
                    className="cursor-pointer"
                  >
                    <Star className="size-4 text-[#A78BFA]" />
                    <span>
                      <strong className="block text-sm">
                        Minhas avaliações
                      </strong>
                      <span className="text-[11px] text-muted-foreground">
                        Veja sua reputação completa
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="cursor-pointer rounded-lg p-3 text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="h-10 gap-2">
              <Link href={ROUTES.LOGIN}>
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function BrandLogo({ logo }: { logo?: ReactNode }) {
  return (
    <Link
      href={ROUTES.ANUNCIOS}
      className="group flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Desapeguei - página inicial dos anúncios"
    >
      <span
        className="flex size-11 items-center justify-center overflow-hidden rounded-xl border transition-transform duration-200 group-hover:scale-[1.03]"
        style={{
          background: theme.color.bgSurface2,
          borderColor: theme.color.border,
          boxShadow: theme.shadow.button,
        }}
        data-slot="brand-logo"
      >
        {logo ?? (
          <Image
            src="/desapeguei_logo.png"
            alt="Desapeguei"
            width={44}
            height={44}
            className="object-contain"
          />
        )}
      </span>
      <span className="hidden sm:block">
        <span className="block font-display text-xl font-black uppercase leading-none tracking-wide">
          Desapeguei
        </span>
        <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Mercado circular
        </span>
      </span>
    </Link>
  );
}

function HoverNavigationMenu({
  menu,
  active,
}: {
  menu: HeaderMenu;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => cancelClose(), []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-10 gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-[var(--theme-bg-surface-hover)] hover:text-foreground data-[state=open]:bg-[var(--theme-bg-surface-hover)] data-[state=open]:text-foreground",
            active && "text-foreground",
          )}
          onMouseEnter={() => {
            cancelClose();
            setOpen(true);
          }}
          onMouseLeave={scheduleClose}
        >
          {menu.label}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
          {active && (
            <span className="absolute inset-x-3 -bottom-4 h-0.5 rounded-full bg-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="w-[340px] rounded-xl p-2"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuLabel className="p-3 font-normal">
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">
            {menu.eyebrow}
          </span>
          <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
            {menu.description}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-1 py-1">
          {menu.items.map((item) => {
            const accent = ACCENT_STYLE[item.accent ?? "lime"];

            return (
              <DropdownMenuItem
                key={`${menu.label}-${item.label}`}
                asChild
                className="group/item rounded-lg p-3 focus:bg-[var(--theme-bg-surface-hover)]"
              >
                <Link href={item.href} className="cursor-pointer">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg border"
                    style={{
                      color: accent.color,
                      background: accent.background,
                      borderColor: accent.border,
                    }}
                  >
                    <item.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm font-semibold text-foreground">
                      {item.label}
                    </strong>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-primary" />
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavigation({
  isActiveRoute,
}: {
  isActiveRoute: (href: string) => boolean;
}) {
  const allItems = DESKTOP_MENUS.flatMap((menu) => menu.items).filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.href === item.href) === index,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 rounded-lg lg:hidden"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72 rounded-xl p-2"
      >
        <DropdownMenuLabel className="px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Navegação
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allItems.map((item) => (
          <DropdownMenuItem
            key={item.href}
            asChild
            className={cn(
              "rounded-lg p-3",
              isActiveRoute(item.href) && "bg-[var(--theme-bg-surface-hover)] text-primary",
            )}
          >
            <Link href={item.href} className="cursor-pointer">
              <item.icon className="size-4" />
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="rounded-lg p-3 text-primary xl:hidden"
        >
          <Link
            href={ROUTES.ANUNCIO_NOVO}
            className="cursor-pointer font-semibold"
          >
            <Sparkles className="size-4" />
            Publicar nova peça
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="size-10 rounded-xl"
      aria-label="Alternar tema"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
