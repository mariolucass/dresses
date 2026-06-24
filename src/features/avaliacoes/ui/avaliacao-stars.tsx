"use client";

import type { NotaAvaliacao } from "@entities/avaliacao";
import theme from "@shared/config/theme";
import { cn } from "@shared/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface AvaliacaoStarsProps {
  value: number;
  onChange?: (value: NotaAvaliacao) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

const STAR_VALUES: NotaAvaliacao[] = [1, 2, 3, 4, 5];

export function AvaliacaoStars({
  value,
  onChange,
  readOnly = false,
  size = "md",
  className,
}: AvaliacaoStarsProps) {
  const [hovered, setHovered] = useState<NotaAvaliacao | null>(null);
  const visibleValue = hovered ?? value;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Avaliação: ${value} de 5 estrelas`}
      data-testid="avaliacao-stars"
      onMouseLeave={() => setHovered(null)}
    >
      {STAR_VALUES.map((star) => {
        const filled = star <= visibleValue;
        const icon = (
          <Star
            className={cn(
              SIZE_CLASS[size],
              "transition-transform duration-150",
              filled && "fill-current",
            )}
            style={{
              color: filled ? theme.color.warning : theme.color.textSubtle,
            }}
          />
        );

        if (readOnly) return <span key={star}>{icon}</span>;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
            className="rounded-sm p-0.5 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(null)}
            onClick={() => onChange?.(star)}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
