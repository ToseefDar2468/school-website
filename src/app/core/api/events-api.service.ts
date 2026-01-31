import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EventApiModel, EventUpsertDto } from './events-api.models';

@Injectable({ providedIn: 'root' })
export class EventsApiService {
  private readonly http = inject(HttpClient);

  getEvents(upcoming?: boolean): Observable<EventApiModel[]> {
    let params = new HttpParams();
    if (upcoming !== undefined) {
      params = params.set('upcoming', String(upcoming));
    }

    return this.http.get<EventApiModel[]>(`${environment.apiUrl}/events`, {
      params
    });
  }

  getEvent(id: string): Observable<EventApiModel> {
    return this.http.get<EventApiModel>(`${environment.apiUrl}/events/${id}`);
  }

  adminCreateEvent(dto: EventUpsertDto): Observable<EventApiModel> {
    return this.http.post<EventApiModel>(`${environment.apiUrl}/admin/events`, dto);
  }

  adminUpdateEvent(id: string, dto: EventUpsertDto): Observable<EventApiModel> {
    return this.http.patch<EventApiModel>(`${environment.apiUrl}/admin/events/${id}`, dto);
  }

  adminDeleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/events/${id}`);
  }
}
