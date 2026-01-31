import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GalleryAlbumApiModel, GalleryAlbumUpsertDto } from './gallery-api.models';

@Injectable({ providedIn: 'root' })
export class GalleryApiService {
  private readonly http = inject(HttpClient);

  getAlbums(): Observable<GalleryAlbumApiModel[]> {
    return this.http.get<GalleryAlbumApiModel[]>(`${environment.apiUrl}/gallery/albums`);
  }

  getAlbum(id: string): Observable<GalleryAlbumApiModel> {
    return this.http.get<GalleryAlbumApiModel>(`${environment.apiUrl}/gallery/albums/${id}`);
  }

  adminCreateAlbum(dto: GalleryAlbumUpsertDto): Observable<GalleryAlbumApiModel> {
    return this.http.post<GalleryAlbumApiModel>(`${environment.apiUrl}/admin/gallery/albums`, dto);
  }

  adminUpdateAlbum(id: string, dto: GalleryAlbumUpsertDto): Observable<GalleryAlbumApiModel> {
    return this.http.patch<GalleryAlbumApiModel>(`${environment.apiUrl}/admin/gallery/albums/${id}`, dto);
  }

  adminDeleteAlbum(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/gallery/albums/${id}`);
  }
}
