import type { Proposta } from "@entities/proposta/model/proposta.types";
import { create } from "zustand";

interface NegociacaoState {
  propostaAtiva: Proposta | null;
  setPropostaAtiva: (proposta: Proposta | null) => void;
}

export const useNegociacaoStore = create<NegociacaoState>((set) => ({
  propostaAtiva: null,
  setPropostaAtiva: (proposta) => set({ propostaAtiva: proposta }),
}));
