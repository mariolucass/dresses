import { NegociacaoDetailPage } from "@views/negociacoes";

interface NegociacaoDetalheRouteProps {
  params: Promise<{ id: string }>;
}

export default async function NegociacaoDetalheRoute({
  params,
}: NegociacaoDetalheRouteProps) {
  const { id } = await params;
  return <NegociacaoDetailPage key={id} />;
}
