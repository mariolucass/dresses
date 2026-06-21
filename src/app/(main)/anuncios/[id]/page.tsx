import { AnuncioDetailPage } from "@views/anuncios/ui/anuncio-detail-page";

interface AnuncioDetalheRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AnuncioDetalheRoute({
  params,
}: AnuncioDetalheRouteProps) {
  const { id } = await params;
  return <AnuncioDetailPage key={id} />;
}
