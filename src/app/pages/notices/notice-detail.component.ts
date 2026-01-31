import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-notice-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './notice-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);

  readonly notice$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => (id ? this.dataService.getNoticeById(id) : of(undefined))),
    map((notice) => notice ?? null)
  );
}
