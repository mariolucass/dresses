"use client";

import type { StatusAnuncio } from "@entities/anuncio";
import theme from "@shared/config/theme";

export type GaragemTab = "TODOS" | StatusAnuncio;

const TABS: Array<{ value: GaragemTab; label: string }> = [
  { value: "TODOS", label: "Todos" },
  { value: "DISPONIVEL", label: "Disponíveis" },
  { value: "EM_NEGOCIACAO", label: "Em negociação" },
  { value: "FINALIZADO", label: "Finalizados" },
];

export function GaragemTabs({
  value,
  onChange,
  counts,
}: {
  value: GaragemTab;
  onChange: (value: GaragemTab) => void;
  counts: Record<GaragemTab, number>;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      role="tablist"
      aria-label="Filtrar garagem"
      data-testid="garagem-tabs"
    >
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className="shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition"
          style={{
            color:
              value === tab.value
                ? theme.color.primaryFg
                : theme.color.textSecondary,
            background:
              value === tab.value
                ? theme.color.primary
                : theme.color.bgSurface2,
            borderColor:
              value === tab.value ? theme.color.primary : theme.color.border,
          }}
        >
          {tab.label}{" "}
          <span className="ml-1 opacity-70">{counts[tab.value]}</span>
        </button>
      ))}
    </div>
  );
}
