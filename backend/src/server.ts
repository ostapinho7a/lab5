import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import gamesRouter from './routes/games.js';
import reviewsRouter from './routes/reviews.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// middleware до роутів, інакше req.body буде undefined
app.use(cors());
app.use(express.json());

app.use('/api/games', gamesRouter);
app.use('/api/reviews', reviewsRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Маршрут ${req.method} ${req.originalUrl} не існує` });
});

app.use((err: Error & { type?: string }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Некоректний JSON у тілі запиту' });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Внутрішня помилка сервера' });
});

app.listen(PORT, () => {
  console.log(`API запущено: http://localhost:${PORT}/api`);
});
