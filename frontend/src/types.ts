export type RatingStatus = 'Overwhelmingly Positive' | 'Positive' | 'Mixed' | 'Negative' | 'No Reviews';

export interface Game {
  id: string;
  title: string;
  genre: string;
  price: number;
  discount: number;
  developer: string;
  image_url: string;
  description: string;
  // рахує сервер
  final_price: number;
  reviews_count: number;
  positive_percent: number;
  rating_status: RatingStatus;
}

export interface NewGame {
  title: string;
  genre: string;
  price: number;
  discount: number;
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

export type NewReview = Omit<Review, 'id' | 'game_id' | 'created_at'>;

export type FieldErrors = Record<string, string>;
