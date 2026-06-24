import { create } from "zustand";

interface VatState {
  saldo: number;
  setSaldo: (saldo: number) => void;
  addSaldo: (valor: number) => void;
  subtractSaldo: (valor: number) => void;
}

export const useVatStore = create<VatState>((set) => ({
  saldo: 0,
  setSaldo: (saldo) => set({ saldo }),
  addSaldo: (valor) => set((state) => ({ saldo: state.saldo + valor })),
  subtractSaldo: (valor) =>
    set((state) => ({ saldo: Math.max(0, state.saldo - valor) })),
}));
