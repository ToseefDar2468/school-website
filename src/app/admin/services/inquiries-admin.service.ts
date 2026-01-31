import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export type InquiryStatus = 'new' | 'contacted' | 'converted' | 'rejected';

export interface Inquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  className: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiryFilters {
  status?: InquiryStatus;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminInquiriesService {
  private readonly http = inject(HttpClient);

  getInquiries(filters: InquiryFilters): Observable<Inquiry[]> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<Inquiry[]>(`${environment.API_URL}/admin/inquiries`, {
      params
    });
  }

  updateStatus(id: string, status: InquiryStatus): Observable<Inquiry> {
    return this.http.patch<Inquiry>(
      `${environment.API_URL}/admin/inquiries/${id}/status`,
      { status }
    );
  }
}
