import { createMetadata } from "@/shared/config/metadata";
import { NegociacoesListPage } from '@views/negociacoes';

export const metadata = createMetadata({
  title: "Minhas Negociações",
  description: "Gerencie suas negociações em andamento e concluídas.",
  path: "/negociacoes",
});

export default function NegociacoesRoute() {
  return <NegociacoesListPage />;
}
