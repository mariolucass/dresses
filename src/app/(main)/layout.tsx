import { AppFooter } from "@widgets/footer";
import { AppHeader } from "@widgets/header";

// Layout do grupo principal (autenticado) - contém header, sidebar e footer
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 min-h-[calc(100vh-73px)]">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
