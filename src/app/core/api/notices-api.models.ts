import { Notice } from '../models/notice.model';

export interface NoticeUpsertDto {
  title: string;
  description: string;
  dateISO: string;
  isPinned?: boolean;
  attachmentUrl?: string;
}

export type NoticeApiModel = Notice;
