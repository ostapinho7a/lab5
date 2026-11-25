export interface Game {
  id: string;
  title: string;
  genre: string;
  price: number;
  discount: number; // відсотки 0..90
  developer: string;
  image_url: string;
  description: string;
}

export interface Review {
  id: string;
  game_id: string;
  author: string;
  is_recommended: boolean;
  hours_played: number;
  text: string;
  created_at: string;
}

export type RatingStatus = 'Overwhelmingly Positive' | 'Positive' | 'Mixed' | 'Negative' | 'No Reviews';

// гра разом з тим, що сервер рахує на льоту
export interface GameWithRating extends Game {
  final_price: number;
  reviews_count: number;
  positive_percent: number;
  rating_status: RatingStatus;
}

export type FieldErrors = Record<string, string>;
