import type { Metadata } from "next";

const BASE_URL = "https://dresses.com.br";
const OG_IMAGE = "/images/og-dresses.jpg";

export const metadata: Metadata = {
  // ─── Base ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),

  // ─── Título com template (páginas filhas herdam automaticamente) ───────────
  title: {
    default: "Dresses | Venda de roupas online",
    template: "%s | Dresses",
  },

  // ─── Descrição ─────────────────────────────────────────────────────────────
  description:
    "Encontre o melhor da moda na Dresses. Venda de roupas online de alta qualidade, vestidos exclusivos e coleções modernas com o melhor preço.",

  // ─── Keywords ──────────────────────────────────────────────────────────────
  keywords: [
    "Venda de roupas",
    "Moda feminina",
    "Dresses",
    "Vestidos",
    "Roupas online",
    "Comprar roupas",
    "Moda Dresses",
    "Coleção 2026",
    "Loja de roupas",
    "Dresses Moda",
  ],

  // ─── Canonical & Autores ───────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
    languages: {
      "pt-BR": BASE_URL,
    },
  },
  authors: [{ name: "Dresses", url: BASE_URL }],
  creator: "Dresses",
  publisher: "Dresses",
  category: "shopping",

  // ─── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: "Dresses | Venda de roupas online",
    description:
      "As melhores roupas e vestidos estão na Dresses. Compre online com entrega rápida e segura.",
    url: BASE_URL,
    siteName: "Dresses",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Coleção de roupas e vestidos da Dresses",
        type: "image/jpeg",
      },
    ],
  },

  // ─── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@dresses", // ← coloque o @ real se tiver
    creator: "@dresses",
    title: "Dresses | Venda de roupas online",
    description: "Venda de roupas online. Confira nossa nova coleção 2026.",
    images: [
      {
        url: OG_IMAGE,
        alt: "Loja Dresses",
      },
    ],
  },

  // ─── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Verificação (adicione as chaves reais quando tiver) ───────────────────
  verification: {
    google: "SEU_GOOGLE_SEARCH_CONSOLE_TOKEN",
    // other: { "facebook-domain-verification": "SEU_TOKEN" },
  },

  // ─── App / PWA (bônus) ─────────────────────────────────────────────────────
  applicationName: "Dresses",
  appleWebApp: {
    capable: true,
    title: "Dresses",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

interface PageMetadataProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function createMetadata({
  title,
  description,
  path,
  image = OG_IMAGE,
}: PageMetadataProps): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${path}`,
    },
    openGraph: {
      title: `${title} | Dresses`,
      description,
      url: `${BASE_URL}${path}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      title: `${title} | Dresses`,
      description,
      images: [image],
    },
  };
}
