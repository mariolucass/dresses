import { ROUTES } from "@shared/config/routes";
import theme from "@shared/config/theme";
import { Button } from "@shared/ui/button";
import { Plus, Warehouse } from "lucide-react";
import Link from "next/link";

export function GaragemEmptyState() {
  return (
    <div
      className="rounded-2xl border p-10 text-center"
      style={{
        background: theme.gradient.swapCard,
        borderColor: theme.color.borderSwap,
      }}
      data-testid="garagem-empty-state"
    >
      <Warehouse
        className="mx-auto size-9"
        style={{ color: theme.color.swap }}
      />
      <h2 className="mt-4 font-display text-2xl font-black uppercase">
        Nenhuma peça nesta seção
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Publique uma peça para começar a organizar sua garagem.
      </p>
      <Button asChild className="mt-5 gap-2">
        <Link href={ROUTES.ANUNCIO_NOVO}>
          <Plus className="size-4" /> Publicar peça
        </Link>
      </Button>
    </div>
  );
}
