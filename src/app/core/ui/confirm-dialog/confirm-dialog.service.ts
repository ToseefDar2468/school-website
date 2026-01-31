import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ConfirmDialogOptions, ConfirmDialogState } from './confirm-dialog.models';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly stateSubject = new BehaviorSubject<ConfirmDialogState | null>(null);
  private pendingSubject: Subject<boolean> | null = null;

  readonly state$ = this.stateSubject.asObservable();

  confirm(options: ConfirmDialogOptions): Observable<boolean> {
    if (this.pendingSubject) {
      this.pendingSubject.next(false);
      this.pendingSubject.complete();
    }

    const subject = new Subject<boolean>();
    this.pendingSubject = subject;

    this.stateSubject.next({
      open: true,
      title: options.title ?? 'Confirm action',
      message: options.message ?? 'Are you sure you want to continue?',
      confirmText: options.confirmText ?? 'Confirm',
      cancelText: options.cancelText ?? 'Cancel',
      intent: options.intent ?? 'default'
    });

    return subject.asObservable();
  }

  resolve(result: boolean): void {
    if (!this.pendingSubject) {
      return;
    }

    this.pendingSubject.next(result);
    this.pendingSubject.complete();
    this.pendingSubject = null;
    this.stateSubject.next(null);
  }
}
