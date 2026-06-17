/** Direção de ordenação */
export type SortOrder = "asc" | "desc";

/** Parâmetros de paginação */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Resposta paginada genérica */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/** Estado assíncrono genérico */
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

/** Campos de auditoria (timestamps) */
export interface WithTimestamps {
  createdAt: string;
  updatedAt: string;
}

/** Entidade com ID */
export interface WithId {
  id: string;
}

/** Resultado de operação com feedback */
export type OperationResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
