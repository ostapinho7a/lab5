import type { Game, GameWithRating, RatingStatus, Review } from './types.js';

// спрощена версія того, як рахує Steam
export function ratingStatus(count: number, percent: number): RatingStatus {
  if (count === 0) return 'No Reviews';
  if (percent >= 90 && count >= 5) return 'Overwhelmingly Positive';
  if (percent >= 70) return 'Positive';
  if (percent >= 40) return 'Mixed';
  return 'Negative';
}

export function withRating(game: Game, reviews: Review[]): GameWithRating {
  const own = reviews.filter((review) => review.game_id === game.id);
  const positive = own.filter((review) => review.is_recommended).length;
  const percent = own.length ? Math.round((positive / own.length) * 100) : 0;

  return {
    ...game,
    final_price: Math.round(game.price * (100 - game.discount)) / 100,
    reviews_count: own.length,
    positive_percent: percent,
    rating_status: ratingStatus(own.length, percent),
  };
}
