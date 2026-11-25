import type { RatingStatus } from '@/types';

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

// колір бейджа під статус рейтингу
export const ratingBadge: Record<RatingStatus, string> = {
  'Overwhelmingly Positive': 'badge-success',
  Positive: 'badge-info',
  Mixed: 'badge-warning',
  Negative: 'badge-error',
  'No Reviews': 'badge-ghost',
};
