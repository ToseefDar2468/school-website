import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lightbox-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './lightbox-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxModalComponent {
  private _isOpen = false;

  @Input({ required: true })
  set isOpen(value: boolean) {
    this._isOpen = value;
    this.handleFocusChange();
  }

  get isOpen(): boolean {
    return this._isOpen;
  }
  @Input() imageUrl: string | null = null;
  @Input() imageAlt = 'Event image';
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialog') dialogRef?: ElementRef<HTMLDivElement>;

  private lastFocusedElement: HTMLElement | null = null;

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  onOverlayClick(): void {
    this.close();
  }

  close(): void {
    this.closed.emit();
  }

  private handleFocusChange(): void {
    if (this.isOpen) {
      this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setTimeout(() => this.dialogRef?.nativeElement.focus(), 0);
    } else if (this.lastFocusedElement) {
      const element = this.lastFocusedElement;
      this.lastFocusedElement = null;
      element.focus();
    }
  }
}
