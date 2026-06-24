import { Badge } from "@shared/components/ui/badge";
import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";
import { Github, Mail, Plus, Recycle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FOOTER_NAV = [
  {
    title: "Explorar",
    links: [
      { href: ROUTES.ANUNCIOS, label: "Todos os anúncios" },
      { href: ROUTES.GARAGEM, label: "Minha garagem" },
    ],
  },
  {
    title: "Minha conta",
    links: [
      { href: ROUTES.NEGOCIACOES, label: "Negociações" },
      { href: ROUTES.PERFIL, label: "Meu perfil" },
    ],
  },
] as const;

export function AppFooter() {
  return (
    <footer
      data-testid="app-footer"
      className="relative overflow-hidden border-t bg-background/40 backdrop-blur-md"
      style={{ borderColor: theme.color.border }}
    >
      {/* Decorative gradient blur */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-full max-w-3xl -translate-x-1/2 rounded-[100%] bg-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top row: brand + nav */}
        <div
          className="flex flex-col gap-16 border-b pb-12 md:flex-row md:items-start md:justify-between"
          style={{ borderColor: theme.color.border }}
        >
          {/* Brand */}
          <div className="flex-1 max-w-sm">
            <Link
              href={ROUTES.ANUNCIOS}
              className="group inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-10 items-center justify-center overflow-hidden rounded-xl border bg-muted/50 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                <Image
                  src="/desapeguei_logo.png"
                  alt="Desapeguei"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                Desapeguei
              </span>
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Compre, venda e troque de um jeito mais consciente, direto e
              humano. Transforme seu guarda-roupa em um ciclo infinito de moda.
            </p>

            <Badge
              variant="secondary"
              className="mt-6 gap-1.5 rounded-full border-none bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary transition-colors hover:bg-primary/20"
            >
              <Recycle className="size-3.5" />
              Moda circular
            </Badge>
          </div>

          {/* Nav grid */}
          <nav
            className="grid grid-cols-2 gap-x-16 gap-y-10 md:gap-x-24"
            aria-label="Navegação do rodapé"
          >
            {FOOTER_NAV.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold tracking-wider text-foreground">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {section.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <span className="relative overflow-hidden pb-0.5">
                          {item.label}
                          <span className="absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Mid row: CTA */}
        <div
          className="flex flex-col gap-6 border-b py-10 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: theme.color.border }}
        >
          <div className="max-w-md space-y-1.5">
            <h4 className="text-base font-semibold text-foreground">
              Faça a moda circular acontecer
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tem uma peça parada no armário? Dê uma nova história a ela
              colocando-a de volta em circulação.
            </p>
          </div>
          <Button
            asChild
            size="default"
            className="w-fit gap-2 rounded-full px-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Link href={ROUTES.ANUNCIO_NOVO}>
              <Plus className="size-4" />
              <span className="font-semibold">Criar anúncio</span>
            </Link>
          </Button>
        </div>

        {/* Bottom row: legal + email + social */}
        <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="order-3 text-xs text-muted-foreground md:order-1">
            © 2026 Desapeguei. Feito para circular. Todos os direitos
            reservados.
          </p>

          <div className="order-1 flex items-center gap-6 md:order-2">
            <a
              href={`mailto:${theme.contact.supportEmail}`}
              className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-primary/10">
                <Mail className="size-4 transition-colors group-hover:text-primary" />
              </span>
              <span>{theme.contact.supportEmail}</span>
            </a>
          </div>

          <div className="order-2 flex items-center gap-4 md:order-3">
            {[
              {
                icon: Github,
                href: "https://github.com/mariolucass/dresses",
                label: "GitHub",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-muted-foreground/70 transition-colors duration-200 hover:-translate-y-0.5 hover:text-primary"
              >
                <social.icon className="size-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
