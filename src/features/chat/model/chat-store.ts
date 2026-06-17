import type { Mensagem } from "@entities/mensagem/model/mensagem.types";
import { create } from "zustand";

interface ChatState {
  mensagens: Mensagem[];
  setMensagens: (msgs: Mensagem[]) => void;
  addMensagem: (msg: Mensagem) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  mensagens: [],
  setMensagens: (mensagens) => set({ mensagens }),
  addMensagem: (msg) =>
    set((state) => ({ mensagens: [...state.mensagens, msg] })),
}));
