import { createMetadata } from "@/shared/config/metadata";
import { PerfilPage } from "@views/perfil";

export const metadata = createMetadata({
  title: "Meu Perfil",
  description: "Gerencie seu perfil e informações pessoais.",
  path: "/perfil",
});

export default function PerfilRoute() {
  return <PerfilPage />;
}
