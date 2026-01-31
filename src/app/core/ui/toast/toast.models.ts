export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  durationMs: number;
}

export interface ToastOptions {
  title?: string;
  durationMs?: number;
}
