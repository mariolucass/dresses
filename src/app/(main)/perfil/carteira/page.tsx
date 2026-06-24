import { createMetadata } from "@/shared/config/metadata";
import { CarteiraPage } from "@views/carteira";

export const metadata = createMetadata({
  title: "Carteira",
  description: "Acompanhe seu saldo e transações.",
  path: "/perfil/carteira",
});

export default function Page() {
  return <CarteiraPage />;
}
