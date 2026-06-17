import { cn } from "@/shared/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Enterprise Boilerplate 2026",
  description:
    "Scalable, feature-sliced, high-performance Next.js application.",
};

import { AuthProvider } from "@/shared/providers/auth-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <NuqsAdapter>
                <AuthProvider>{children}</AuthProvider>
              </NuqsAdapter>
            </Suspense>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
