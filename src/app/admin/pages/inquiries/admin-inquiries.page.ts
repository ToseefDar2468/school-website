import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, finalize, map, startWith, switchMap, tap } from 'rxjs';

import {
  AdminInquiriesService,
  Inquiry,
  InquiryStatus
} from '../../services/inquiries-admin.service';

interface StatusOption {
  label: string;
  value: InquiryStatus | 'all';
}

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgClass, ReactiveFormsModule],
  templateUrl: './admin-inquiries.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminInquiriesPage {
  private readonly inquiriesService = inject(AdminInquiriesService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly statusControl = new FormControl<InquiryStatus | 'all'>('all', { nonNullable: true });

  readonly statusOptions: StatusOption[] = [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Converted', value: 'converted' },
    { label: 'Rejected', value: 'rejected' }
  ];

  readonly pendingIds = signal<Set<string>>(new Set());
  readonly errorMessage = signal<string | null>(null);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  private readonly filters$ = combineLatest([
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    this.statusControl.valueChanges.pipe(startWith(this.statusControl.value)),
    this.refresh$
  ]).pipe(
    map(([search, status]) => ({
      search: search.trim(),
      status: status === 'all' ? undefined : status
    }))
  );

  readonly inquiries$ = this.filters$.pipe(
    switchMap((filters) =>
      this.inquiriesService.getInquiries(filters).pipe(
        tap(() => this.errorMessage.set(null))
      )
    )
  );

  updateStatus(inquiry: Inquiry, nextStatus: InquiryStatus): void {
    if (inquiry.status === nextStatus) {
      return;
    }

    this.errorMessage.set(null);
    this.setPending(inquiry.id, true);

    this.inquiriesService
      .updateStatus(inquiry.id, nextStatus)
      .pipe(finalize(() => this.setPending(inquiry.id, false)))
      .subscribe({
        next: () => this.refresh$.next(),
        error: () => {
          this.errorMessage.set('Unable to update status. Please try again.');
          this.refresh$.next();
        }
      });
  }

  isPending(id: string): boolean {
    return this.pendingIds().has(id);
  }

  badgeClass(status: InquiryStatus): string {
    switch (status) {
      case 'new':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40';
      case 'contacted':
        return 'bg-sky-500/20 text-sky-200 border-sky-500/40';
      case 'converted':
        return 'bg-purple-500/20 text-purple-200 border-purple-500/40';
      case 'rejected':
        return 'bg-rose-500/20 text-rose-200 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-200 border-slate-500/40';
    }
  }

  private setPending(id: string, isPending: boolean): void {
    this.pendingIds.update((set) => {
      const next = new Set(set);
      if (isPending) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }
}
