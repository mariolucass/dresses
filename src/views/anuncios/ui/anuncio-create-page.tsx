import { AnuncioForm } from "@features/anuncios/ui/anuncio-form";

export function AnuncioCreatePage() {
  return (
    <div className="space-y-6" data-testid="anuncio-create-page">
      <header>
        <p className="text-sm font-medium text-primary">Novo anuncio</p>
        <h1 className="text-3xl font-bold tracking-tight">Publique uma peca</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Cadastre fotos, descricao, categoria, marca e valores para venda ou troca.
        </p>
      </header>
      <AnuncioForm />
    </div>
  );
}
