import type { Proposta } from "@entities/proposta";
import theme from "@shared/config/theme";
import { Check, Clock3, X } from "lucide-react";

export function NegociacaoTimeline({ propostas }: { propostas: Proposta[] }) {
  const sorted = [...propostas].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  return (
    <ol className="space-y-4" data-testid="negociacao-timeline">
      {sorted.map((item, index) => {
        const done = item.status === "CONCLUIDA" || item.status === "ACEITA";
        const rejected = ["RECUSADA", "CANCELADA"].includes(item.status);
        const Icon = done ? Check : rejected ? X : Clock3;
        const color = done
          ? theme.color.success
          : rejected
            ? theme.color.error
            : theme.color.warning;
        return (
          <li key={item.id} className="relative flex gap-3">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full border"
              style={{
                color,
                borderColor: `${color}55`,
                background: theme.color.bgSurface2,
              }}
            >
              <Icon className="size-3.5" />
            </span>
            <div
              className="min-w-0 rounded-xl border p-3 flex-1"
              style={{
                borderColor: theme.color.border,
                background: theme.color.bgSurface2,
              }}
            >
              <div className="flex justify-between gap-3">
                <p className="text-sm font-semibold">
                  {index === 0 ? "Proposta inicial" : "Contraproposta"}
                </p>
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color }}
                >
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.valorOfertado ? `R$ ${item.valorOfertado}` : ""}
                {item.vatOfertado ? ` · ${item.vatOfertado} VAT` : ""}
                {item.itensOfertados.length
                  ? ` · ${item.itensOfertados.length} peça(s) oferecida(s)`
                  : ""}
                {item.itensDesejados && item.itensDesejados.length > 0
                  ? ` · ${item.itensDesejados.length} peça(s) desejada(s)`
                  : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
