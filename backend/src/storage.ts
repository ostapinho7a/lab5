import fs from 'fs/promises';
import path from 'path';
import type { Game, Review } from './types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

async function readJson<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    // файлу ще нема — значить і даних нема
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeJson<T>(filePath: string, data: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// записи по черзі, щоб два одночасні запити не затерли файл
let queue: Promise<unknown> = Promise.resolve();

export function withLock<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task);
  queue = result.catch(() => {});
  return result;
}

export const db = {
  getGames: () => readJson<Game>(GAMES_FILE),
  saveGames: (games: Game[]) => writeJson(GAMES_FILE, games),
  getReviews: () => readJson<Review>(REVIEWS_FILE),
  saveReviews: (reviews: Review[]) => writeJson(REVIEWS_FILE, reviews),
};
