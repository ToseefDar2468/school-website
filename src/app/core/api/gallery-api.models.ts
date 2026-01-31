import { GalleryAlbum } from '../models/gallery-album.model';

export interface GalleryAlbumUpsertDto {
  title: string;
  coverImageUrl: string;
  imageUrls: string[];
  category: string;
}

export type GalleryAlbumApiModel = GalleryAlbum;
