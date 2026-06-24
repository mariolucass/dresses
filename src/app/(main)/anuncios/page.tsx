import { createMetadata } from "@/shared/config/metadata";
import { AnunciosListPage } from "@views/anuncios/ui/anuncios-list-page";

export const metadata = createMetadata({
  title: "Explorar Anúncios",
  description: "Explore os melhores anúncios de roupas e vestidos.",
  path: "/anuncios",
});

export default function AnunciosRoute() {
  return <AnunciosListPage />;
}
