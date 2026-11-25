import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'crypto';
import { db, withLock } from '../storage.js';
import { withRating } from '../rating.js';
import { validateDiscount, validateGame, validateReview } from '../validation.js';
import type { FieldErrors, Game, Review } from '../types.js';

const router = Router();

function getBody(req: Request) {
  const body = req.body;
  return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
}

function badRequest(res: Response, message: string, errors?: FieldErrors) {
  res.status(400).json({ message, ...(errors ? { errors } : {}) });
}

function gameNotFound(res: Response, id: string) {
  res.status(404).json({ message: `Гру з id «${id}» не знайдено` });
}

// GET /api/games?genre=Roguelike
router.get('/', async (req, res) => {
  const genre = typeof req.query.genre === 'string' ? req.query.genre.trim().toLowerCase() : '';
  const [games, reviews] = await Promise.all([db.getGames(), db.getReviews()]);

  const result = games
    .filter((game) => !genre || game.genre.toLowerCase() === genre)
    .map((game) => withRating(game, reviews));

  res.json(result);
});

router.get('/:id', async (req, res) => {
  const [games, reviews] = await Promise.all([db.getGames(), db.getReviews()]);
  const game = games.find((g) => g.id === req.params.id);
  if (!game) return gameNotFound(res, req.params.id);
  res.json(withRating(game, reviews));
});

router.post('/', async (req, res) => {
  const body = getBody(req);
  if (!body) return badRequest(res, 'Тіло запиту має бути JSON-об’єктом');

  const errors = validateGame(body);
  if (Object.keys(errors).length) return badRequest(res, 'Перевір поля гри', errors);

  const game: Game = {
    id: randomUUID(),
    title: String(body.title).trim(),
    genre: String(body.genre).trim(),
    price: Math.round((body.price as number) * 100) / 100,
    discount: (body.discount as number | undefined) ?? 0,
    developer: typeof body.developer === 'string' ? body.developer.trim() : '',
    image_url: typeof body.image_url === 'string' ? body.image_url.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
  };

  await withLock(async () => {
    const games = await db.getGames();
    games.push(game);
    await db.saveGames(games);
  });

  res.status(201).json(withRating(game, []));
});

router.patch('/:id/discount', async (req, res) => {
  const body = getBody(req);
  const error = validateDiscount(body?.discount);
  if (error) return badRequest(res, error, { discount: error });

  await withLock(async () => {
    const games = await db.getGames();
    const game = games.find((g) => g.id === req.params.id);
    if (!game) return gameNotFound(res, req.params.id);

    game.discount = body!.discount as number;
    await db.saveGames(games);
    res.json(withRating(game, await db.getReviews()));
  });
});

// разом з грою видаляємо всі її відгуки
router.delete('/:id', async (req, res) => {
  await withLock(async () => {
    const games = await db.getGames();
    if (!games.some((g) => g.id === req.params.id)) return gameNotFound(res, req.params.id);

    const reviews = await db.getReviews();
    await db.saveGames(games.filter((g) => g.id !== req.params.id));
    await db.saveReviews(reviews.filter((r) => r.game_id !== req.params.id));
    res.status(204).end();
  });
});

router.get('/:id/reviews', async (req, res) => {
  const games = await db.getGames();
  if (!games.some((g) => g.id === req.params.id)) return gameNotFound(res, req.params.id);

  const reviews = await db.getReviews();
  res.json(
    reviews.filter((r) => r.game_id === req.params.id).sort((a, b) => b.created_at.localeCompare(a.created_at)),
  );
});

router.post('/:id/reviews', async (req, res) => {
  const body = getBody(req);
  if (!body) return badRequest(res, 'Тіло запиту має бути JSON-об’єктом');

  const games = await db.getGames();
  if (!games.some((g) => g.id === req.params.id)) return gameNotFound(res, req.params.id);

  const errors = validateReview(body);
  if (Object.keys(errors).length) return badRequest(res, 'Перевір поля відгуку', errors);

  const review: Review = {
    id: randomUUID(),
    game_id: req.params.id,
    author: String(body.author).trim(),
    is_recommended: body.is_recommended as boolean,
    hours_played: Math.round((body.hours_played as number) * 10) / 10,
    text: String(body.text).trim(),
    created_at: new Date().toISOString(),
  };

  await withLock(async () => {
    const reviews = await db.getReviews();
    reviews.push(review);
    await db.saveReviews(reviews);
  });

  res.status(201).json(review);
});

export default router;
