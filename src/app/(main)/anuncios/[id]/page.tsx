import { createMetadata } from "@/shared/config/metadata";
import { AnuncioDetailPage } from "@views/anuncios/ui/anuncio-detail-page";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return createMetadata({
    title: "Detalhes do Anúncio",
    description: "Confira todos os detalhes deste anúncio.",
    path: `/anuncios/${id}`,
  });
}

interface AnuncioDetalheRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AnuncioDetalheRoute({
  params,
}: AnuncioDetalheRouteProps) {
  const { id } = await params;
  return <AnuncioDetailPage key={id} />;
}
