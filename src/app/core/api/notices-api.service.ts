import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NoticeApiModel, NoticeUpsertDto } from './notices-api.models';

@Injectable({ providedIn: 'root' })
export class NoticesApiService {
  private readonly http = inject(HttpClient);

  getNotices(pinnedFirst?: boolean): Observable<NoticeApiModel[]> {
    let params = new HttpParams();
    if (pinnedFirst !== undefined) {
      params = params.set('pinnedFirst', String(pinnedFirst));
    }

    return this.http.get<NoticeApiModel[]>(`${environment.apiUrl}/notices`, {
      params
    });
  }

  getNotice(id: string): Observable<NoticeApiModel> {
    return this.http.get<NoticeApiModel>(`${environment.apiUrl}/notices/${id}`);
  }

  adminCreateNotice(dto: NoticeUpsertDto): Observable<NoticeApiModel> {
    return this.http.post<NoticeApiModel>(`${environment.apiUrl}/admin/notices`, dto);
  }

  adminUpdateNotice(id: string, dto: NoticeUpsertDto): Observable<NoticeApiModel> {
    return this.http.patch<NoticeApiModel>(`${environment.apiUrl}/admin/notices/${id}`, dto);
  }

  adminDeleteNotice(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/notices/${id}`);
  }
}
