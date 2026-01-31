import { Event } from '../models/event.model';

export interface EventUpsertDto {
  title: string;
  description: string;
  dateISO: string;
  venue: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
}

export type EventApiModel = Event;
