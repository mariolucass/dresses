/**
 * ─────────────────────────────────────────────────────────────────
 *  Dresses — Design System Tokens
 *  src/lib/theme.ts
 *
 *  Altere aqui para refletir em TODA a aplicação automaticamente.
 *  Nunca use valores de cor ou espaçamento hard-coded nos componentes.
 * ─────────────────────────────────────────────────────────────────
 */

// ─── 1. BRAND PALETTE ────────────────────────────────────────────────────────
// Cores institucionais Dresses. Não altere sem aprovação de identidade visual.

export const brand = {
  // Primárias
  orange: "#F18903", // Laranja principal — CTAs, destaques
  orangeLight: "#F5A835", // Hover / variante clara
  orangeDark: "#C46F02", // Active / pressed state
  orangeAlpha10: "#F1890318", // Fundo transparente de badges/pills
  orangeAlpha20: "#F1890333", // Hover de itens com fundo laranja
  orangeAlpha40: "#F1890366", // Bordas visíveis em fundo escuro

  // Navy (fundo principal)
  navy: "#151152", // Fundo base, header dark, seções primárias
  navyMid: "#1D1870", // Gradiente médio, cards dark
  navyLight: "#232296", // Gradiente claro, bordas suaves
  navyDeep: "#0A0930", // Fundo de seções alternadas (mais escuro)
  navyAlpha80: "rgba(21,17,82,0.8)",
  navyAlpha60: "rgba(21,17,82,0.6)",

  // Sky (azul celeste — acento secundário)
  sky: "#006CC4", // Acento secundário, ícones, links ativos
  skyLight: "#0084EE", // Hover
  skyDark: "#0058A0", // Active / pressed
  skyAlpha10: "#006CC418",
  skyAlpha20: "#006CC433",
  skyAlpha40: "#006CC466",

  // Neutros
  white: "#FFFFFF",
  systemGray: "#F5F5F7",
  offWhite: "#F4F6FB", // Fundo de seções claras
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
} as const;

// ─── 2. SEMANTIC COLOR ALIASES ───────────────────────────────────────────────
// Use esses aliases nos componentes — nunca os valores brutos do brand acima.

export const color = {
  // Interface
  primary: brand.orange,
  primaryHover: brand.orangeLight,
  primaryActive: brand.orangeDark,
  primaryFg: brand.navy, // texto sobre fundo primário

  secondary: brand.sky,
  secondaryHover: brand.skyLight,
  secondaryActive: brand.skyDark,
  secondaryFg: brand.white,

  // Backgrounds
  bgBase: brand.navy,
  bgMid: brand.navyMid,
  bgDeep: brand.navyDeep,
  bgSurface: "rgba(255,255,255,0.03)",
  bgSurfaceHover: "rgba(255,255,255,0.06)",
  bgLight: brand.offWhite, // páginas claras (ex: landing pública)

  // Texto
  textPrimary: brand.white,
  textSecondary: "rgba(255,255,255,0.70)",
  textMuted: "rgba(255,255,255,0.45)",
  textSubtle: "rgba(255,255,255,0.25)",
  textInverted: brand.navy, // texto escuro sobre fundo claro

  // Bordas
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  borderStrong: "rgba(255,255,255,0.24)",
  borderPrimary: brand.orangeAlpha40,
  borderSecondary: brand.skyAlpha40,

  // Estados de feedback
  success: "#10b981",
  successBg: "rgba(16,185,129,0.10)",
  successBorder: "rgba(16,185,129,0.25)",

  warning: "#f59e0b",
  warningBg: "rgba(245,158,11,0.10)",
  warningBorder: "rgba(245,158,11,0.25)",

  error: "#f43f5e",
  errorBg: "rgba(244,63,94,0.10)",
  errorBorder: "rgba(244,63,94,0.25)",

  info: "#06b6d4",
  infoBg: "rgba(6,182,212,0.10)",
  infoBorder: "rgba(6,182,212,0.25)",
} as const;

// ─── 3. GRADIENTS ─────────────────────────────────────────────────────────────

export const gradient = {
  // Backgrounds de página/seção
  hero: `linear-gradient(160deg, ${brand.navy} 0%, ${brand.navyMid} 60%, ${brand.navy} 100%)`,
  heroDeep: `linear-gradient(160deg, ${brand.navyDeep} 0%, ${brand.navy} 40%, ${brand.navyMid} 70%, ${brand.navyDeep} 100%)`,
  section: `linear-gradient(160deg, ${brand.navyMid} 0%, ${brand.navy} 100%)`,
  sectionAlt: `linear-gradient(160deg, ${brand.navy} 0%, ${brand.navyDeep} 100%)`,

  // Elementos de UI
  cta: `linear-gradient(135deg, ${brand.orange}, ${brand.orangeLight})`,
  ctaHover: `linear-gradient(135deg, ${brand.orangeLight}, ${brand.orange})`,
  navy: `linear-gradient(135deg, ${brand.navy}, ${brand.navyMid})`,
  sky: `linear-gradient(135deg, ${brand.sky}, ${brand.skyLight})`,

  // Decorativos
  topBar: `linear-gradient(90deg, ${brand.navy} 0%, ${brand.navyMid} 60%, ${brand.navy} 100%)`,
  accentLine: `linear-gradient(90deg, ${brand.orange} 0%, ${brand.sky} 50%, transparent 100%)`,
  orangeFade: `linear-gradient(90deg, ${brand.orange}, transparent)`,
  glowOrange: `radial-gradient(circle, ${brand.orange}, transparent)`,
  glowSky: `radial-gradient(circle, ${brand.sky}, transparent)`,
} as const;

// ─── 4. TYPOGRAPHY ────────────────────────────────────────────────────────────
// Use `font-serif` e `font-sans` via Tailwind classes.
// Defina as famílias reais em tailwind.config.ts → theme.fontFamily.
// Nunca injete fontFamily diretamente em style={{}}.

export const typography = {
  // Sizes — use via Tailwind (text-xs, text-sm, text-base…)
  // Weights — use via Tailwind (font-normal, font-semibold, font-bold, font-black)

  // Tracking presets para headings (aplique via className)
  trackingDisplay: "tracking-tight", // para títulos grandes
  trackingLabel: "tracking-widest", // para labels/eyebrows uppercase
  trackingBody: "tracking-normal",

  // Leading presets
  leadingDisplay: "leading-[0.9]", // hero titles
  leadingHeading: "leading-snug",
  leadingBody: "leading-relaxed",
} as const;

// ─── 5. SPACING ───────────────────────────────────────────────────────────────

export const spacing = {
  sectionY: "py-20",
  sectionYLg: "py-28",
  containerX: "px-6",
  maxWidth: "max-w-7xl",
  cardPadding: "p-6",
  cardPaddingLg: "p-8",
} as const;

// ─── 6. BORDER RADIUS ─────────────────────────────────────────────────────────

export const radius = {
  sm: "rounded-lg", // inputs, small elements
  md: "rounded-xl", // buttons, badges
  lg: "rounded-2xl", // cards
  xl: "rounded-3xl", // hero sections, feature cards
  full: "rounded-full", // pills, avatars, FABs
} as const;

// ─── 7. SHADOWS ───────────────────────────────────────────────────────────────

export const shadow = {
  card: "0 4px 24px rgba(0,0,0,0.25)",
  cardHover: "0 8px 32px rgba(0,0,0,0.35)",
  cardFeatured: `0 0 0 1px ${brand.orangeAlpha20}, 0 16px 48px rgba(0,0,0,0.4)`,
  button: "0 4px 16px rgba(0,0,0,0.2)",
  buttonHover: "0 8px 24px rgba(0,0,0,0.3)",
  header: `0 4px 24px rgba(${brand.navy}, 0.14)`,

  // Glows coloridos para cards de curso
  glow: (hex: string, opacity = 0.25): string => {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");
    return `0 0 48px ${hex}${alpha}`;
  },
} as const;

// ─── 8. TRANSITIONS ───────────────────────────────────────────────────────────

export const transition = {
  fast: "transition-all duration-150",
  base: "transition-all duration-200",
  slow: "transition-all duration-300",
  slower: "transition-all duration-500",
} as const;

// ─── 9. CLOTHES CATEGORY COLORS ──────────────────────────────────────────────
// Cores por categoria de roupas.

export const categoryColor = {
  casual: brand.sky, // Roupas casuais
  festa: "#06b6d4", // Vestidos de festa
  acessorios: brand.orangeLight, // Acessórios
  promocao: "#f43f5e", // Itens em promoção
  lancamentos: brand.sky, // Lançamentos
} as const;

// ─── 10. PRODUCT STATUS COLORS ───────────────────────────────────────────────

export const statusColor: Record<string, string> = {
  Novidade: brand.orange,
  Tendência: brand.sky,
  Exclusivo: "#10b981",
  "Últimas Peças": "#a78bfa",
  Promoção: brand.orange,
} as const;

// ─── 11. Z-INDEX ──────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  fab: 50, // floating action button (WhatsApp)
} as const;

// ─── 12. BREAKPOINTS (referência — use classes Tailwind no JSX) ───────────────
// sm: 640px | md: 768px | lg: 1024px | xl: 1280px | 2xl: 1536px

export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ─── 13. ANIMATION DELAYS (staggered reveals) ────────────────────────────────
// Use como style={{ animationDelay: animDelay.item(index) }}

export const animDelay = {
  item: (i: number): string => `${i * 100}ms`,
  fast: (i: number): string => `${i * 60}ms`,
  slow: (i: number): string => `${i * 160}ms`,
} as const;

// ─── 14. BACKGROUND TEXTURE HELPERS ──────────────────────────────────────────
// Objetos style={{}} prontos para usar em divs decorativos.

export const texture = {
  grid: (color = "#ffffff", opacity = 0.05): React.CSSProperties => ({
    backgroundImage: `
      linear-gradient(${color} 1px, transparent 1px),
      linear-gradient(90deg, ${color} 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    opacity,
  }),

  gridFine: (color = "#ffffff", opacity = 0.04): React.CSSProperties => ({
    backgroundImage: `
      linear-gradient(${color} 1px, transparent 1px),
      linear-gradient(90deg, ${color} 1px, transparent 1px)
    `,
    backgroundSize: "24px 24px",
    opacity,
  }),

  dots: (color = "#ffffff", opacity = 0.04): React.CSSProperties => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: "30px 30px",
    opacity,
  }),

  diagonal: (opacity = 0.04): React.CSSProperties => ({
    backgroundImage:
      "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
    backgroundSize: "8px 8px",
    opacity,
  }),
} as const;

// ─── 15. WHATSAPP ─────────────────────────────────────────────────────────────
// Número e mensagens padrão para CTAs de WhatsApp.

export const whatsapp = {
  number: "5588999999999", // ← altere para o número real
  baseUrl: "https://wa.me/",
  defaultMsg: "Olá! Gostaria de mais informações sobre as roupas da Dresses.",
  roupaMsg: (roupa: string) =>
    `Olá! Tenho interesse na peça ${roupa} da Dresses.`,
  colecaoMsg: (colecao: string) =>
    `Olá! Gostaria de obter mais informações sobre a coleção ${colecao}.`,
  url: (msg: string): string =>
    `https://wa.me/5588999999999?text=${encodeURIComponent(msg)}`,
} as const;

// ─── 16. CONTACT ──────────────────────────────────────────────────────────────

export const contact = {
  phone: "(88) 0000-0000",
  email: "contato@dresses.com.br",
  address: "Juazeiro do Norte, CE",
  maps: "https://maps.google.com",
} as const;

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────
// Úteis para tipar props de componentes que recebem cores do tema.

export type BrandColor = keyof typeof brand;
export type SemanticColor = keyof typeof color;
export type CategoryColor = keyof typeof categoryColor;
export type CourseStatus = keyof typeof statusColor;

// ─── Re-export padrão (barrel) ────────────────────────────────────────────────
// Permite: import theme from "@/lib/theme"
//          theme.brand.orange / theme.gradient.hero / etc.

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
  categoryColor,
  statusColor,
  zIndex,
  breakpoint,
  animDelay,
  texture,
  whatsapp,
  contact,
} as const;

export default theme;
