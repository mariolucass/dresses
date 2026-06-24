export const VAT_UPDATED_EVENT = "brecho:vat-updated";

export interface VatUpdatedEventDetail {
  userId: string;
  saldo: number;
}

export function emitVatUpdated(detail: VatUpdatedEventDetail) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<VatUpdatedEventDetail>(VAT_UPDATED_EVENT, { detail }),
  );
}
