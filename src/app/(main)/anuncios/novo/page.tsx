import { createMetadata } from "@/shared/config/metadata";
import { AnuncioCreatePage } from "@views/anuncios/ui/anuncio-create-page";

export const metadata = createMetadata({
  title: "Novo Anúncio",
  description: "Crie um novo anúncio para vender suas roupas.",
  path: "/anuncios/novo",
});

export default function AnuncioNovoRoute() {
  return <AnuncioCreatePage />;
}
