export interface Review {
  author: string;
  area: string;
  rating: number;
  text: string;
  source?: string;
  date?: string;
}

// ВАЖЛИВО: лише РЕАЛЬНІ відгуки (Google Business Profile / скріншоти з джерелом).
// Поки масив порожній — блок «Відгуки» та AggregateRating не показуються.
export const reviews: Review[] = [];
