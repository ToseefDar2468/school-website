export interface ConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  intent?: 'default' | 'danger';
}

export interface ConfirmDialogState extends ConfirmDialogOptions {
  open: boolean;
}
