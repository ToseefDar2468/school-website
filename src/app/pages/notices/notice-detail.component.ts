import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { NoticesApiService } from '../../core/api/notices-api.service';

@Component({
  selector: 'app-notice-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './notice-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly noticesApi = inject(NoticesApiService);

  readonly notice$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => (id ? this.noticesApi.getNotice(id) : of(null))),
    catchError(() => of(null))
  );
}
