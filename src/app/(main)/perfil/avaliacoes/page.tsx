import { createMetadata } from "@/shared/config/metadata";
import { AvaliacoesPage } from "@views/perfil/ui/avaliacoes-page";

export const metadata = createMetadata({
  title: "Avaliações",
  description: "Veja todas as suas avaliações.",
  path: "/perfil/avaliacoes",
});

export default function PerfilRoute() {
  return <AvaliacoesPage />;
}
