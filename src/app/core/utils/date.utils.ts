export type SortDirection = 'asc' | 'desc';

export function compareDateISO(aISO: string, bISO: string, direction: SortDirection = 'desc'): number {
  const aTime = new Date(aISO).getTime();
  const bTime = new Date(bISO).getTime();

  if (direction === 'asc') {
    return aTime - bTime;
  }

  return bTime - aTime;
}

export function sortByDateISO<T extends { dateISO: string }>(
  items: T[],
  direction: SortDirection = 'desc'
): T[] {
  return items.slice().sort((a, b) => compareDateISO(a.dateISO, b.dateISO, direction));
}
