"use client";

import type { Anuncio } from "@entities/anuncio";
import type { Mensagem } from "@entities/mensagem";
import type { Proposta } from "@entities/proposta";
import theme from "@shared/config/theme";
import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchMessages } from "../api/fetch-messages";
import { sendMessageService } from "../api/send-message";
import { ChatInput } from "./chat-input";
import { Message, MessageBubble } from "./message-bubble";
import { NegotiationSummary } from "./negotiation-summary";

export function ChatPanel({
  negociacaoId,
  currentUserId,
  otherUserName = "Participante",
  disabled = false,
  proposta,
  anuncio,
  offeredItems = [],
  desiredItems = [],
  history,
}: {
  negociacaoId: string;
  currentUserId: string;
  otherUserName?: string;
  disabled?: boolean;
  proposta?: Proposta;
  anuncio?: Anuncio;
  offeredItems?: Array<{ anuncioId: string; anuncio?: Anuncio }>;
  desiredItems?: Array<{ anuncioId: string; anuncio?: Anuncio }>;
  history?: Proposta[];
}) {
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMessages(fetchMessages(negociacaoId)), [negociacaoId]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);
  function handleSend(text: string) {
    const result = sendMessageService({
      negociacaoId,
      remetenteId: currentUserId,
      texto: text,
      tipo: "TEXTO",
    });
    if (result.success) setMessages((current) => [...current, result.data]);
  }
  const initials = otherUserName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const displayMessages = messages.filter(
    (item, index) =>
      !(
        index === 0 &&
        proposta &&
        item.texto ===
          (history?.[0]?.mensagemInicial || proposta.mensagemInicial)
      ),
  );

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: theme.color.bgBase }}
    >
      <header
        className="relative z-10 flex items-center gap-3 px-5 py-3.5"
        style={{
          borderBottom: `1px solid ${theme.color.border}`,
          backgroundColor: theme.color.bgSurface,
        }}
      >
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{
            backgroundColor: theme.brand.terraAlpha12,
            color: theme.brand.terra,
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{otherUserName}</p>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3 text-emerald-400" /> Conversa da
            negociação
          </div>
        </div>
      </header>
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5"
      >
        {proposta ? (
          <NegotiationSummary
            proposta={proposta}
            anuncio={anuncio}
            offeredItems={offeredItems}
            desiredItems={desiredItems}
            history={history}
            currentUserId={currentUserId}
            otherUserName={otherUserName}
          />
        ) : null}
        <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Início da conversa
        </p>
        {displayMessages.length === 0 && (
          <p className="m-auto max-w-xs text-center text-sm text-muted-foreground">
            Envie uma mensagem para combinar os próximos passos.
          </p>
        )}
        {displayMessages.map((item) => {
          const message: Message = {
            id: item.id,
            text: item.texto,
            sender:
              item.tipo === "SISTEMA"
                ? "system"
                : item.remetenteId === currentUserId
                  ? "currentUser"
                  : "otherUser",
            timestamp: new Date(item.createdAt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            systemType: "info",
          };
          return <MessageBubble key={item.id} message={message} />;
        })}
      </div>
      {disabled ? (
        <p className="border-t p-4 text-center text-xs text-muted-foreground">
          A conversa foi encerrada.
        </p>
      ) : (
        <ChatInput onSendMessage={handleSend} />
      )}
    </div>
  );
}
