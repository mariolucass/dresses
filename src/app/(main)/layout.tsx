// Layout do grupo principal (autenticado) — contém header, sidebar e footer
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* AppHeader — a implementar */}
      <main className="flex-1 container mx-auto py-6">{children}</main>
      {/* AppFooter — a implementar */}
    </div>
  );
}
