"use client";

import theme from "@/shared/config/theme";
import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = text.trim().length > 0;

  const handleSend = () => {
    if (hasText) {
      onSendMessage(text.trim());
      setText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [text]);

  return (
    <div
      className="flex items-end gap-3 px-4 py-3"
      style={{
        borderTop: `1px solid ${theme.color.border}`,
        backgroundColor: theme.color.bgBase,
      }}
    >
      {/* Input container - borda única, sem duplo fundo */}
      <div
        className="flex flex-1 items-end overflow-hidden rounded-2xl px-4 py-2.5"
        style={{
          backgroundColor: theme.color.bgSurface,
          border: `1px solid ${theme.color.border}`,
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            theme.color.borderHover;
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            theme.color.border;
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mensagem"
          rows={1}
          className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
          style={{
            color: theme.color.textPrimary,
            maxHeight: 128,
          }}
        />
      </div>

      {/* Botão de envio - aparece com presença quando ativo */}
      <button
        onClick={handleSend}
        disabled={!hasText}
        aria-label="Enviar mensagem"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: hasText ? theme.color.primary : "transparent",
          color: hasText ? theme.color.primaryFg : theme.color.textSubtle,
          cursor: hasText ? "pointer" : "default",
          transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hasText ? "scale(1)" : "scale(0.85)",
          opacity: hasText ? 1 : 0.5,
        }}
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
