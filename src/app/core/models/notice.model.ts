export interface Notice {
  id: string;
  title: string;
  description: string;
  dateISO: string;
  isPinned: boolean;
  attachmentUrl?: string;
}
