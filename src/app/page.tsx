import { createMetadata } from "@/shared/config/metadata";
import { LandingPage } from "@views/landing";

export const metadata = createMetadata({
  title: "Início",
  description: "Página inicial da Dresses, sua loja de roupas.",
  path: "/",
});

export default function HomeRoute() {
  return <LandingPage />;
}
