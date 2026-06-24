"use client";

import theme from "@/shared/config/theme";

export type MessageSender = "currentUser" | "otherUser" | "system";

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: string;
  systemType?: "success" | "warning" | "info";
}

interface MessageBubbleProps {
  message: Message;
}

/**
 * Mensagem de sistema - faixa horizontal sutil, sem ícone genérico.
 * Usa apenas uma linha fina colorida na borda esquerda pra dar contexto
 * sem parecer um alerta corporativo.
 */
function SystemMessage({ message }: { message: Message }) {
  const { text, systemType } = message;

  const accentMap = {
    success: { line: theme.color.success, fg: theme.color.success },
    warning: { line: theme.color.warning, fg: theme.color.warning },
    info: { line: theme.color.textMuted, fg: theme.color.textSecondary },
  };

  const accent = accentMap[systemType ?? "info"];

  return (
    <div className="flex justify-center px-2 py-3">
      <div
        className="relative max-w-md text-center text-[13px] leading-snug"
        style={{ color: accent.fg }}
      >
        {/* Linhas decorativas laterais */}
        <span
          className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-8 -translate-x-full sm:block"
          style={{ backgroundColor: accent.line, opacity: 0.25 }}
        />
        <span
          className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-8 translate-x-full sm:block"
          style={{ backgroundColor: accent.line, opacity: 0.25 }}
        />

        {text}
      </div>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { sender, text, timestamp } = message;

  if (sender === "system") return <SystemMessage message={message} />;

  const mine = sender === "currentUser";

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className="group relative max-w-[72%]"
        style={{ padding: "10px 14px" }}
      >
        {/* Fundo com opacidade sutil - nada de cores gritantes */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: mine
              ? theme.brand.limeAlpha10
              : theme.color.bgSurface2,
            borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            border: mine
              ? `1px solid ${theme.brand.limeAlpha15}`
              : `1px solid ${theme.color.border}`,
          }}
        />

        {/* Conteúdo */}
        <div className="relative">
          <p
            className="text-[14px] leading-[1.55]"
            style={{
              color: mine ? theme.color.textPrimary : theme.color.textPrimary,
            }}
          >
            {text}
          </p>
          <span
            className="mt-1 block text-right text-[10px] tabular-nums"
            style={{
              color: mine ? theme.brand.limeAlpha30 : theme.color.textSubtle,
            }}
          >
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}
