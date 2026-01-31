import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ToastMessage, ToastOptions, ToastType } from './toast.models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  success(message: string, options?: ToastOptions): void {
    this.show('success', message, options);
  }

  error(message: string, options?: ToastOptions): void {
    this.show('error', message, options);
  }

  info(message: string, options?: ToastOptions): void {
    this.show('info', message, options);
  }

  dismiss(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((toast) => toast.id !== id));
  }

  private show(type: ToastType, message: string, options?: ToastOptions): void {
    const toast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      message,
      title: options?.title,
      durationMs: options?.durationMs ?? 4000
    };

    this.toastsSubject.next([toast, ...this.toastsSubject.value]);

    if (toast.durationMs > 0) {
      setTimeout(() => this.dismiss(toast.id), toast.durationMs);
    }
  }
}
