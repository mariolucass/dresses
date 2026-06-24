import { Schibsted_Grotesk, Space_Grotesk } from "next/font/google";

export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const fontSans = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

// Compatibilidade temporária com componentes que ainda usam `font-serif`.
export const fontSerif = fontDisplay;
