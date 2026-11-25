import type { FieldErrors } from './types.js';

type Body = Record<string, unknown>;

const isText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export function validateDiscount(value: unknown): string | null {
  if (!isNumber(value) || !Number.isInteger(value)) return 'Знижка має бути цілим числом';
  if (value < 0 || value > 90) return 'Знижка може бути від 0 до 90%';
  return null;
}

export function validateGame(data: Body): FieldErrors {
  const errors: FieldErrors = {};

  if (!isText(data.title)) errors.title = "Назва обов'язкова";
  else if ((data.title as string).trim().length > 100) errors.title = 'Назва задовга (до 100 символів)';

  if (!isText(data.genre)) errors.genre = "Жанр обов'язковий";

  if (!isNumber(data.price) || data.price <= 0) errors.price = 'Ціна має бути більше 0';

  if (data.discount !== undefined) {
    const discountError = validateDiscount(data.discount);
    if (discountError) errors.discount = discountError;
  }

  for (const field of ['developer', 'image_url', 'description']) {
    if (data[field] !== undefined && typeof data[field] !== 'string') errors[field] = 'Має бути рядком';
  }

  return errors;
}

export function validateReview(data: Body): FieldErrors {
  const errors: FieldErrors = {};

  if (!isText(data.author)) errors.author = "Ім'я автора обов'язкове";
  else if ((data.author as string).trim().length > 40) errors.author = "Ім'я задовге (до 40 символів)";

  if (!isText(data.text) || (data.text as string).trim().length < 5) errors.text = 'Відгук має бути хоча б з 5 символів';

  if (typeof data.is_recommended !== 'boolean') errors.is_recommended = 'Обери: рекомендуєш чи ні';

  if (!isNumber(data.hours_played) || data.hours_played < 0) errors.hours_played = 'Години — невід’ємне число';

  return errors;
}
