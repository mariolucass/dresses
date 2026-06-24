import { createMetadata } from "@/shared/config/metadata";
import { AvaliacaoDetailPage } from "@/views/perfil";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return createMetadata({
    title: "Detalhes da Avaliação",
    description: "Detalhes da avaliação.",
    path: `/perfil/avaliacoes/${id}`,
  });
}

interface AvaliacaoDetalheRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AvaliacaoDetalheRoute({
  params,
}: AvaliacaoDetalheRouteProps) {
  const { id } = await params;
  return <AvaliacaoDetailPage avaliacaoId={id} />;
}
