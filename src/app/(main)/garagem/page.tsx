import { createMetadata } from "@/shared/config/metadata";
import { GaragemPage } from "@views/garagem";

export const metadata = createMetadata({
  title: "Garagem",
  description: "Visualize e gerencie as roupas na sua garagem.",
  path: "/garagem",
});

export default function GaragemRoute() {
  return <GaragemPage />;
}
