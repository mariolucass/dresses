"use client";

import { AnuncioDetail } from "@features/anuncios/ui/anuncio-detail";
import { useParams } from "next/navigation";

export function AnuncioDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <div data-testid="anuncio-detail-page">
      <AnuncioDetail id={params.id} />
    </div>
  );
}
