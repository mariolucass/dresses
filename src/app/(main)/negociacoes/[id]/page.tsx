import { createMetadata } from "@/shared/config/metadata";
import { NegociacaoDetailPage } from "@views/negociacoes";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return createMetadata({
    title: "Detalhes da Negociação",
    description: "Acompanhe os detalhes da sua negociação.",
    path: `/negociacoes/${id}`,
  });
}

interface NegociacaoDetalheRouteProps {
  params: Promise<{ id: string }>;
}

export default async function NegociacaoDetalheRoute({
  params,
}: NegociacaoDetalheRouteProps) {
  const { id } = await params;
  return <NegociacaoDetailPage negociacaoId={id} />;
}
