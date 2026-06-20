"use client";

import { ROUTES } from "@shared/config/routes";
import { cn } from "@shared/lib/utils";
import {
  Handshake,
  Shirt,
  ShoppingBag,
  UserRound,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: ROUTES.ANUNCIOS, label: "Anúncios", icon: ShoppingBag },
  { href: ROUTES.GARAGEM, label: "Garagem", icon: Warehouse },
  { href: ROUTES.NEGOCIACOES, label: "Negociações", icon: Handshake },
  { href: ROUTES.PERFIL, label: "Perfil", icon: UserRound },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  function isActiveRoute(href: string) {
    return pathname === href || pathname?.startsWith(`${href}/`);
  }

  return (
    <>
      {/* Sidebar — desktop */}
      <nav
        data-testid="app-sidebar"
        className="hidden w-60 shrink-0 flex-col border-r bg-card/40 px-3 py-6 md:flex"
      >
        <Link href={ROUTES.ANUNCIOS} className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shirt className="size-4" />
          </div>
          <span className="font-serif text-base">Brechó Online</span>
        </Link>

        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = isActiveRoute(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Navegação — mobile (bottom bar) */}
      <nav
        data-testid="app-sidebar-mobile"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t bg-card/95 py-2 backdrop-blur-md md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
