import { AnuncioDetailPage } from "@views/anuncios";

interface AnuncioDetalheRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AnuncioDetalheRoute({
  params,
}: AnuncioDetalheRouteProps) {
  const { id } = await params;
  return <AnuncioDetailPage key={id} />;
}
