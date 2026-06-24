/**
 * ─────────────────────────────────────────────────────────────────
 *  Brechó - Design System Tokens
 *  src/lib/theme.ts
 *
 *  Direção visual: "Mercado Noturno Urbano"
 *  Grafite profundo + lime elétrico + terracota de negociação.
 *  A assinatura é a etiqueta de preço física nos cards de produto.
 *
 *  Fontes necessárias (em globals.css ou <head>):
 *  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Inter:wght@400;500;600&display=swap');
 *
 *  tailwind.config.ts:
 *    fontFamily: {
 *      display: ['Barlow Condensed', 'sans-serif'],
 *      sans:    ['Inter', 'sans-serif'],
 *    }
 * ─────────────────────────────────────────────────────────────────
 */

// ─── 1. BRAND PALETTE ────────────────────────────────────────────────────────
// Cores institucionais do Brechó. Não altere sem revisão de identidade visual.

export const brand = {
  // Lime - primária (CTA, preços, destaques positivos)
  lime: "#C8F135",
  limeLight: "#D6F55C",
  limeDark: "#A8CE1F",
  limeAlpha10: "rgba(200,241,53,0.10)",
  limeAlpha15: "rgba(200,241,53,0.15)",
  limeAlpha30: "rgba(200,241,53,0.30)",

  // Terra - secundária (venda, oferta, ação de negociação)
  terra: "#E8694A",
  terraLight: "#ED8066",
  terraDark: "#C44F32",
  terraAlpha10: "rgba(232,105,74,0.10)",
  terraAlpha12: "rgba(232,105,74,0.12)",
  terraAlpha30: "rgba(232,105,74,0.30)",

  // Violet - troca direta (modalidade exclusiva de troca)
  violet: "#A78BFA",
  violetLight: "#BBA7FB",
  violetDark: "#8B6CF7",
  violetAlpha10: "rgba(167,139,250,0.10)",
  violetAlpha12: "rgba(167,139,250,0.12)",
  violetAlpha30: "rgba(167,139,250,0.30)",

  // Ink - fundos (escala de grafite)
  ink: "#141414", // fundo base (mais escuro)
  surface: "#1C1C1C", // cards, modais, painéis
  surface2: "#242424", // inputs, listrows alternados
  surface3: "#2C2C2C", // hover states de surface

  // Texto
  text: "#F0F0EE", // texto principal (quase branco, não branco puro)

  // Utilitários
  white: "#FFFFFF",
} as const;

// ─── 2. SEMANTIC COLOR ALIASES ───────────────────────────────────────────────
// Use esses aliases nos componentes - nunca os valores brutos do brand acima.

export const color = {
  // ── Primária (CTA, preços, confirmação)
  primary: brand.lime,
  primaryHover: brand.limeLight,
  primaryActive: brand.limeDark,
  primaryFg: "#111111", // texto escuro sobre fundo lime

  // ── Venda (modalidade de venda com negociação de preço)
  sell: brand.terra,
  sellHover: brand.terraLight,
  sellActive: brand.terraDark,
  sellFg: brand.white,
  sellBg: brand.terraAlpha12,
  sellBorder: brand.terraAlpha30,

  // ── Troca (modalidade de troca direta sem dinheiro)
  swap: brand.violet,
  swapHover: brand.violetLight,
  swapActive: brand.violetDark,
  swapFg: brand.white,
  swapBg: brand.violetAlpha12,
  swapBorder: brand.violetAlpha30,

  // ── Backgrounds
  bgBase: "var(--theme-ink)",
  bgSurface: "var(--theme-surface)",
  bgSurface2: "var(--theme-surface2)",
  bgSurface3: "var(--theme-surface3)",
  bgOverlay: "var(--theme-bg-overlay)", // modal backdrop
  bgSurfaceHover: "var(--theme-bg-surface-hover)",

  // ── Texto
  textPrimary: "var(--theme-text-primary)",
  textSecondary: "var(--theme-text-secondary)",
  textMuted: "var(--theme-text-muted)",
  textSubtle: "var(--theme-text-subtle)",
  textInverted: "var(--theme-text-inverted)", // texto escuro sobre fundos lime/claros

  // ── Bordas
  border: "var(--theme-border)",
  borderHover: "var(--theme-border-hover)",
  borderStrong: "var(--theme-border-strong)",
  borderPrimary: brand.limeAlpha30,
  borderSell: brand.terraAlpha30,
  borderSwap: brand.violetAlpha30,

  // ── Feedback semântico
  success: "#4ECDC4",
  successBg: "rgba(78,205,196,0.10)",
  successBorder: "rgba(78,205,196,0.28)",

  warning: "#FFD166",
  warningBg: "rgba(255,209,102,0.10)",
  warningBorder: "rgba(255,209,102,0.28)",

  error: "#FF6B6B",
  errorBg: "rgba(255,107,107,0.10)",
  errorBorder: "rgba(255,107,107,0.28)",

  info: "#A0A0A0", // slate - neutro informativo
  infoBg: "rgba(160,160,160,0.10)",
  infoBorder: "rgba(160,160,160,0.25)",
} as const;

// ─── 3. GRADIENTS ─────────────────────────────────────────────────────────────

export const gradient = {
  // Linha decorativa de topo (hero, header)
  accentLine: `linear-gradient(90deg, ${brand.lime} 0%, ${brand.terra} 55%, transparent 100%)`,
  accentLineFull: `linear-gradient(90deg, ${brand.lime}, ${brand.violet}, ${brand.terra})`,

  // Fundo de seções
  section: `linear-gradient(160deg, var(--theme-surface) 0%, var(--theme-ink) 100%)`,
  sectionAlt: `linear-gradient(160deg, var(--theme-ink) 0%, var(--theme-surface) 100%)`,
  hero: `linear-gradient(160deg, var(--theme-ink) 0%, var(--theme-surface2) 60%, var(--theme-ink) 100%)`,

  // Botão CTA
  cta: `linear-gradient(135deg, ${brand.lime}, ${brand.limeLight})`,
  ctaHover: `linear-gradient(135deg, ${brand.limeLight}, ${brand.lime})`,

  // Cards de modalidade
  sellCard: `linear-gradient(135deg, ${brand.terraAlpha10}, transparent)`,
  swapCard: `linear-gradient(135deg, ${brand.violetAlpha10}, transparent)`,

  // Overlay de imagem nos cards de produto
  cardImageOverlay: `linear-gradient(to top, var(--theme-surface) 0%, transparent 60%)`,

  // Glows (usar como box-shadow, não background)
  glowLime: `0 0 48px rgba(200,241,53,0.18)`,
  glowTerra: `0 0 48px rgba(232,105,74,0.18)`,
  glowViolet: `0 0 48px rgba(167,139,250,0.18)`,
} as const;

// ─── 4. TYPOGRAPHY ────────────────────────────────────────────────────────────
// `font-display` → Barlow Condensed (headings, preços, CTAs)
// `font-sans`    → Inter (corpo, labels, UI)
// Configure em tailwind.config.ts → theme.fontFamily

export const typography = {
  // Famílias (referência - defina no Tailwind config)
  familyDisplay: "'Barlow Condensed', sans-serif",
  familyBody: "'Inter', sans-serif",

  // Pesos - use via Tailwind (font-normal, font-semibold, font-bold, font-black)
  // Sizes - use via Tailwind (text-xs … text-7xl)

  // Tracking
  trackingDisplay: "tracking-tight", // -0.01em - grandes títulos
  trackingHeading: "tracking-normal", // headings médios
  trackingLabel: "tracking-widest", // labels uppercase, eyebrows
  trackingButton: "tracking-wide", // botões uppercase (font-display)

  // Leading
  leadingDisplay: "leading-[0.92]", // hero gigante
  leadingHeading: "leading-none", // H1, H2 (Barlow Condensed)
  leadingBody: "leading-relaxed", // parágrafos (Inter)

  // Regras de uso:
  // - Títulos de página → font-display font-black text-5xl+ uppercase
  // - Seção / card title → font-display font-bold text-xl text-2xl
  // - Preços → font-display font-black text-2xl+ text-primary
  // - Labels / eyebrows → font-sans font-semibold text-[10px] uppercase tracking-widest
  // - Corpo → font-sans font-normal text-sm leading-relaxed
  // - Metadados → font-mono text-xs (Courier New / system-ui mono)
} as const;

// ─── 5. SPACING ───────────────────────────────────────────────────────────────

export const spacing = {
  sectionY: "py-16",
  sectionYLg: "py-24",
  containerX: "px-4",
  maxWidth: "max-w-6xl",
  cardPadding: "p-4", // cards compactos
  cardPaddingMd: "p-5", // cards padrão
  cardPaddingLg: "p-6", // modais, painéis
} as const;

// ─── 6. BORDER RADIUS ─────────────────────────────────────────────────────────

export const radius = {
  sm: "rounded-md", // 6px - inputs, campos pequenos
  md: "rounded-lg", // 8px - botões, badges
  lg: "rounded-[10px]", // 10px - cards padrão
  xl: "rounded-2xl", // 20px - cards hero, modais
  pill: "rounded-full", // pills, avatars, FABs
} as const;

// ─── 7. SHADOWS ───────────────────────────────────────────────────────────────

export const shadow = {
  card: "0 4px 16px rgba(0,0,0,0.4)",
  cardHover: "0 8px 28px rgba(0,0,0,0.5)",
  button: "0 2px 12px rgba(0,0,0,0.3)",
  modal: "0 24px 64px rgba(0,0,0,0.6)",

  // Focus rings (acessibilidade)
  focusLime: `0 0 0 3px ${brand.limeAlpha30}`,
  focusTerra: `0 0 0 3px ${brand.terraAlpha30}`,
  focusViolet: `0 0 0 3px ${brand.violetAlpha30}`,

  // Glows coloridos (cards em destaque)
  glowLime: `0 0 48px rgba(200,241,53,0.18)`,
  glowTerra: `0 0 48px rgba(232,105,74,0.18)`,
  glowViolet: `0 0 48px rgba(167,139,250,0.18)`,

  // Glow genérico por hex + opacidade
  glow: (hex: string, opacity = 0.2): string => {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");
    return `0 0 48px ${hex}${alpha}`;
  },
} as const;

// ─── 8. TRANSITIONS ───────────────────────────────────────────────────────────

export const transition = {
  fast: "transition-all duration-100",
  base: "transition-all duration-200",
  slow: "transition-all duration-300",
  slower: "transition-all duration-500",
  spring: "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
} as const;

// ─── 9. LISTING MODE COLORS ──────────────────────────────────────────────────
// Cores por modalidade de anúncio.

export const modeColor = {
  /** Venda com negociação de preço */
  sell: {
    text: brand.terra,
    bg: brand.terraAlpha12,
    border: brand.terraAlpha30,
    label: "Venda",
  },
  /** Troca direta (sem dinheiro) */
  swap: {
    text: brand.violet,
    bg: brand.violetAlpha12,
    border: brand.violetAlpha30,
    label: "Troca direta",
  },
  /** Aceita venda ou troca */
  both: {
    text: brand.lime,
    bg: brand.limeAlpha10,
    border: brand.limeAlpha30,
    label: "Venda ou troca",
  },
} as const;

// ─── 10. CLOTHING CONDITION ──────────────────────────────────────────────────
// Estado de conservação da peça.

export const conditionColor: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  "Novo com etiqueta": {
    text: color.success,
    bg: color.successBg,
    border: color.successBorder,
  },
  "Ótimo estado": {
    text: color.success,
    bg: color.successBg,
    border: color.successBorder,
  },
  "Bom estado": {
    text: color.warning,
    bg: color.warningBg,
    border: color.warningBorder,
  },
  "Com detalhes": {
    text: color.error,
    bg: color.errorBg,
    border: color.errorBorder,
  },
} as const;

// ─── 11. PROPOSAL STATUS COLORS ──────────────────────────────────────────────

export const proposalStatus: Record<
  string,
  { text: string; bg: string; border: string; label: string }
> = {
  pending: {
    text: color.warning,
    bg: color.warningBg,
    border: color.warningBorder,
    label: "Aguardando resposta",
  },
  accepted: {
    text: color.success,
    bg: color.successBg,
    border: color.successBorder,
    label: "Proposta aceita",
  },
  declined: {
    text: color.error,
    bg: color.errorBg,
    border: color.errorBorder,
    label: "Proposta recusada",
  },
  countered: {
    text: brand.violet,
    bg: brand.violetAlpha12,
    border: brand.violetAlpha30,
    label: "Contraproposta enviada",
  },
  completed: {
    text: color.info,
    bg: color.infoBg,
    border: color.infoBorder,
    label: "Negociação concluída",
  },
} as const;

// ─── 12. Z-INDEX ──────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  fab: 50, // botão flutuante
} as const;

// ─── 13. BREAKPOINTS (referência - use classes Tailwind no JSX) ───────────────

export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ─── 14. ANIMATION DELAYS (staggered reveals) ────────────────────────────────
// Use como style={{ animationDelay: animDelay.item(index) }}

export const animDelay = {
  item: (i: number): string => `${i * 80}ms`,
  fast: (i: number): string => `${i * 50}ms`,
  slow: (i: number): string => `${i * 130}ms`,
} as const;

// ─── 15. PRICE TAG SIGNATURE ─────────────────────────────────────────────────
// Assinatura visual do sistema: etiqueta de preço física nos cards.
// Aplique via componente <PriceTag mode="sell|swap|both" price={...} />.
// Os valores abaixo alimentam os estilos do componente.

export const priceTag = {
  sell: {
    label: "venda",
    color: brand.terra,
    bg: brand.terraAlpha12,
    border: brand.terraAlpha30,
  },
  swap: {
    label: "troca",
    color: brand.violet,
    bg: brand.violetAlpha12,
    border: brand.violetAlpha30,
  },
  both: {
    label: "ou troca",
    color: brand.lime,
    bg: brand.limeAlpha10,
    border: brand.limeAlpha30,
  },
} as const;

// ─── 16. BACKGROUND TEXTURE HELPERS ──────────────────────────────────────────
// Objetos style={{}} prontos para usar em divs decorativos.
// Use em conjunto com um fundo sólido e position: relative.

export const texture = {
  grid: (color = "#ffffff", opacity = 0.04): React.CSSProperties => ({
    backgroundImage: `
      linear-gradient(${color} 1px, transparent 1px),
      linear-gradient(90deg, ${color} 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    opacity,
  }),

  gridFine: (color = "#ffffff", opacity = 0.03): React.CSSProperties => ({
    backgroundImage: `
      linear-gradient(${color} 1px, transparent 1px),
      linear-gradient(90deg, ${color} 1px, transparent 1px)
    `,
    backgroundSize: "24px 24px",
    opacity,
  }),

  dots: (color = "#ffffff", opacity = 0.035): React.CSSProperties => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: "28px 28px",
    opacity,
  }),
} as const;

// ─── 17. CONTACT ──────────────────────────────────────────────────────────────

export const contact = {
  supportEmail: "suporte@brechoonline.com.br",
} as const;

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────

export type BrandColor = keyof typeof brand;
export type SemanticColor = keyof typeof color;
export type ListingMode = keyof typeof modeColor;
export type ProposalStatus = keyof typeof proposalStatus;
export type ClothingCondition = keyof typeof conditionColor;

// ─── Re-export padrão (barrel) ────────────────────────────────────────────────
// import theme from "@/lib/theme"
// theme.brand.lime / theme.color.sell / theme.modeColor.swap / etc.

import type React from "react";

const theme = {
  brand,
  color,
  gradient,
  typography,
  spacing,
  radius,
  shadow,
  transition,
  modeColor,
  conditionColor,
  proposalStatus,
  priceTag,
  zIndex,
  breakpoint,
  animDelay,
  texture,
  contact,
} as const;

export default theme;
