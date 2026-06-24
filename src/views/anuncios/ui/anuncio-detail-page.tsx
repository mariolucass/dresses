"use client";

import { AnuncioDetail } from "@features/anuncios/ui/anuncio-detail";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { spring1 } from "@shared/config/animation";

export function AnuncioDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring1}
      data-testid="anuncio-detail-page"
    >
      <AnuncioDetail id={params.id} />
    </motion.div>
  );
}
