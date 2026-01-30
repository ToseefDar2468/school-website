import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map, startWith } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { StaffMember } from '../../core/models/staff-member.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './faculty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacultyComponent {
  private readonly dataService = inject(DataService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly departmentControl = new FormControl<string>('All', { nonNullable: true });

  private readonly staff$ = this.dataService.getStaff();
  private readonly search$ = this.searchControl.valueChanges.pipe(startWith(this.searchControl.value));
  private readonly department$ = this.departmentControl.valueChanges.pipe(
    startWith(this.departmentControl.value)
  );

  readonly view$ = combineLatest([this.staff$, this.search$, this.department$]).pipe(
    map(([staff, search, department]) => {
      const departments = this.buildDepartments(staff);
      const filtered = this.applyFilters(staff, search, department);
      return { staff: filtered, departments, department };
    })
  );

  selectedStaff: StaffMember | null = null;
  private lastFocusedElement: HTMLElement | null = null;

  @ViewChild('modal') modalRef?: ElementRef<HTMLDivElement>;

  trackById(_: number, staff: StaffMember): string {
    return staff.id;
  }

  openDetails(member: StaffMember): void {
    this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.selectedStaff = member;
    setTimeout(() => this.modalRef?.nativeElement.focus(), 0);
  }

  closeDetails(): void {
    this.selectedStaff = null;
    if (this.lastFocusedElement) {
      const element = this.lastFocusedElement;
      this.lastFocusedElement = null;
      element.focus();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.selectedStaff) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDetails();
    }
  }

  private applyFilters(staff: StaffMember[], search: string, department: string): StaffMember[] {
    const term = search.trim().toLowerCase();
    let filtered = staff;

    if (department !== 'All') {
      filtered = filtered.filter((member) => member.subjectOrDept === department);
    }

    if (term) {
      filtered = filtered.filter((member) => {
        const haystack = `${member.name} ${member.designation} ${member.subjectOrDept}`.toLowerCase();
        return haystack.includes(term);
      });
    }

    return filtered;
  }

  private buildDepartments(staff: StaffMember[]): string[] {
    const unique = Array.from(new Set(staff.map((member) => member.subjectOrDept)));
    return ['All', ...unique];
  }
}
