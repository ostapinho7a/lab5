import { Router } from 'express';
import { db, withLock } from '../storage.js';

const router = Router();

router.delete('/:reviewId', async (req, res) => {
  await withLock(async () => {
    const reviews = await db.getReviews();
    if (!reviews.some((r) => r.id === req.params.reviewId)) {
      res.status(404).json({ message: 'Відгук не знайдено' });
      return;
    }
    await db.saveReviews(reviews.filter((r) => r.id !== req.params.reviewId));
    res.status(204).end();
  });
});

export default router;
