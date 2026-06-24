import type { Anuncio } from "@entities/anuncio";
import type { Proposta } from "@entities/proposta";
import theme from "@shared/config/theme";
import {
  Clock3,
  Coins,
  HandCoins,
  MessageSquareText,
  Repeat2,
  Shirt,
} from "lucide-react";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const TYPE_LABEL: Record<Proposta["tipo"], string> = {
  COMPRA: "Compra",
  TROCA: "Troca",
  MISTA: "Oferta mista",
};

const STATUS_LABEL: Record<Proposta["status"], string> = {
  PENDENTE: "Aguardando resposta",
  ACEITA: "Proposta aceita",
  RECUSADA: "Proposta recusada",
  CONTRAPROPOSTA: "Contraproposta",
  CANCELADA: "Negociação cancelada",
  SUBSTITUIDA: "Proposta substituída",
  CONCLUIDA: "Negociação concluída",
};

export function NegotiationSummary({
  proposta,
  anuncio,
  offeredItems,
  desiredItems = [],
  history = [proposta],
  currentUserId,
  otherUserName,
}: {
  proposta: Proposta;
  anuncio?: Anuncio;
  offeredItems: Array<{ anuncioId: string; anuncio?: Anuncio }>;
  desiredItems?: Array<{ anuncioId: string; anuncio?: Anuncio }>;
  history?: Proposta[];
  currentUserId?: string;
  otherUserName?: string;
}) {
  return (
    <section
      className="mb-5 shrink-0 overflow-hidden rounded-xl border flex flex-col"
      style={{
        background: theme.gradient.section,
        borderColor: theme.color.borderSell,
      }}
      aria-label="Resumo da proposta"
    >
      <div
        className="h-0.5"
        style={{ background: theme.gradient.accentLineFull }}
      />
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Acordo em negociação
            </p>
            <h2 className="mt-1 truncate font-display text-2xl font-black uppercase">
              {anuncio?.titulo ?? "Anúncio removido"}
            </h2>
          </div>
          <span
            className="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
            style={{
              color: theme.color.warning,
              background: theme.color.warningBg,
              borderColor: theme.color.warningBorder,
            }}
          >
            {STATUS_LABEL[proposta.status]}
          </span>
        </div>

        {history && history.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Clock3 className="size-3.5" /> Histórico de ofertas
            </div>
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {history.map((item, index) => (
                <ProposalRevisionCard
                  key={item.id}
                  proposta={item}
                  index={index}
                  active={item.id === proposta.id}
                  currentUserId={currentUserId}
                  otherUserName={otherUserName}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Detail
            icon={HandCoins}
            label="Modalidade"
            value={TYPE_LABEL[proposta.tipo]}
          />
          <Detail
            icon={HandCoins}
            label="Oferta em reais"
            value={
              proposta.valorOfertado
                ? currency.format(Number(proposta.valorOfertado))
                : "Não incluída"
            }
            highlight={Boolean(proposta.valorOfertado)}
          />
          <Detail
            icon={Coins}
            label="Complemento VAT"
            value={
              proposta.vatOfertado
                ? `${proposta.vatOfertado} VAT`
                : "Não incluído"
            }
            highlight={Boolean(proposta.vatOfertado)}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Repeat2 className="size-3.5" /> Peças oferecidas
          </div>
          {offeredItems.length ? (
            <div className="space-y-2">
              {offeredItems.map(({ anuncioId, anuncio: offered }) => (
                <div
                  key={anuncioId}
                  className="flex items-center gap-3 rounded-lg border p-2.5"
                  style={{
                    background: theme.color.bgSurface2,
                    borderColor: theme.color.borderSwap,
                  }}
                >
                  {offered?.fotos[0] ? (
                    <img
                      src={offered.fotos[0]}
                      alt=""
                      className="size-10 rounded-md object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-md bg-[var(--theme-surface3)]">
                      <Shirt className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {offered?.titulo ?? "Peça indisponível"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {offered?.marca ||
                        offered?.tamanho ||
                        "Item oferecido na troca"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Nenhuma peça incluída.
            </p>
          )}
        </div>

        {desiredItems.length > 0 && (
          <div className="pt-3 border-t" style={{ borderColor: theme.color.border }}>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Repeat2 className="size-3.5" /> Peças extras desejadas
            </div>
            <div className="space-y-2">
              {desiredItems.map(({ anuncioId, anuncio: desired }) => (
                <div
                  key={anuncioId}
                  className="flex items-center gap-3 rounded-lg border p-2.5"
                  style={{
                    background: theme.color.bgSurface2,
                    borderColor: theme.color.borderSwap,
                  }}
                >
                  {desired?.fotos[0] ? (
                    <img
                      src={desired.fotos[0]}
                      alt=""
                      className="size-10 rounded-md object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-md bg-[var(--theme-surface3)]">
                      <Shirt className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {desired?.titulo ?? "Peça indisponível"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {desired?.marca ||
                        desired?.tamanho ||
                        "Item desejado na troca"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="border-t pt-3"
          style={{ borderColor: theme.color.border }}
        >
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <MessageSquareText className="size-3.5" /> Mensagem da proposta
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {proposta.mensagemInicial ||
              "Nenhuma mensagem adicionada à proposta."}
          </p>
        </div>
      </div>
    </section>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof HandCoins;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: theme.color.bgSurface2,
        borderColor: theme.color.border,
      }}
    >
      <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <p
        className="mt-1.5 text-sm font-bold"
        style={highlight ? { color: theme.color.primary } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function ProposalRevisionCard({
  proposta,
  index,
  active,
  currentUserId,
  otherUserName,
}: {
  proposta: Proposta;
  index: number;
  active: boolean;
  currentUserId?: string;
  otherUserName?: string;
}) {
  const authorName =
    proposta.autorId && currentUserId && proposta.autorId === currentUserId
      ? "Você"
      : otherUserName || "Participante";

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border p-3 transition-all ${
        active ? "ring-1" : "opacity-80 hover:opacity-100 cursor-default"
      }`}
      style={{
        background: theme.color.bgSurface2,
        borderColor: active ? theme.color.primary : theme.color.borderSwap,
        boxShadow: active ? `0 0 0 1px ${theme.color.primary}` : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: active ? theme.color.textPrimary : theme.color.textMuted }}
          >
            {index === 0 ? "Proposta Original" : `Revisão #${index}`}
          </span>
          {proposta.autorId && (
            <span className="text-[9px] text-muted-foreground">
              por <span className="font-medium text-foreground">{authorName}</span>
            </span>
          )}
        </div>
        <span
          className="rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide"
          style={{
            color: active ? theme.color.warning : theme.color.textMuted,
            background: active ? theme.color.warningBg : theme.color.bgSurface,
            borderColor: active ? theme.color.warningBorder : theme.color.border,
          }}
        >
          {STATUS_LABEL[proposta.status]}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <HandCoins className="size-3" />
          <span className="font-medium">{TYPE_LABEL[proposta.tipo]}</span>
        </div>
        {proposta.valorOfertado ? (
          <div className="flex items-center gap-1.5">
            <span
              className="font-bold"
              style={{ color: active ? theme.color.primary : theme.color.textPrimary }}
            >
              {currency.format(Number(proposta.valorOfertado))}
            </span>
          </div>
        ) : null}
        {proposta.vatOfertado ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Coins className="size-3" />
            <span className="font-medium">{proposta.vatOfertado} VAT</span>
          </div>
        ) : null}
        {proposta.itensOfertados?.length ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shirt className="size-3" />
            <span className="font-medium">
              {proposta.itensOfertados.length} peça(s)
            </span>
          </div>
        ) : null}
      </div>
      {proposta.mensagemInicial && (
        <p className="mt-1 line-clamp-2 text-[11px] italic leading-relaxed text-muted-foreground">
          "{proposta.mensagemInicial}"
        </p>
      )}
    </div>
  );
}
