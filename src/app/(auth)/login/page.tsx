import { createMetadata } from "@/shared/config/metadata";
import { LoginPage } from "@views/auth";

export const metadata = createMetadata({
  title: "Login",
  description: "Faça login na sua conta Dresses.",
  path: "/login",
});

export default function LoginRoute() {
  return <LoginPage />;
}
