import { createMetadata } from "@/shared/config/metadata";
import { RegisterPage } from "@views/auth";

export const metadata = createMetadata({
  title: "Cadastro",
  description: "Crie sua conta na Dresses e comece a comprar e vender.",
  path: "/cadastro",
});

export default function CadastroRoute() {
  return <RegisterPage />;
}
