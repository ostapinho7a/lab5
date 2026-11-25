import { ref, watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { gamesService } from '@/services/games.service';
import { reviewsService } from '@/services/reviews.service';
import { useToastStore } from '@/stores/toast.store';
import { ApiError } from '@/api/httpClient';
import type { Game, NewReview, Review } from '@/types';

export function useGameDetails(id: Ref<string>) {
  const router = useRouter();
  const toast = useToastStore();

  const game = ref<Game | null>(null);
  const reviews = ref<Review[]>([]);
  const isLoading = ref(true);
  const notFound = ref(false);

  async function load() {
    isLoading.value = true;
    notFound.value = false;
    try {
      [game.value, reviews.value] = await Promise.all([
        gamesService.getById(id.value),
        reviewsService.getForGame(id.value),
      ]);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) notFound.value = true;
      game.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  // оновлюємо гру (рейтинг) і відгуки без перезавантаження сторінки
  async function refresh() {
    [game.value, reviews.value] = await Promise.all([
      gamesService.getById(id.value),
      reviewsService.getForGame(id.value),
    ]);
  }

  watch(id, load, { immediate: true });

  async function addReview(review: NewReview) {
    await reviewsService.create(id.value, review);
    toast.success('Відгук опубліковано');
    await refresh();
  }

  async function deleteReview(reviewId: string) {
    try {
      await reviewsService.remove(reviewId);
      toast.success('Відгук видалено');
      await refresh();
    } catch {
      // інтерцептор вже показав помилку
    }
  }

  async function setDiscount(discount: number) {
    try {
      game.value = await gamesService.setDiscount(id.value, discount);
      toast.success(discount ? `Знижка ${discount}% встановлена` : 'Знижку прибрано');
    } catch {
      // інтерцептор вже показав помилку
    }
  }

  async function deleteGame() {
    if (!game.value) return;
    const title = game.value.title;
    try {
      await gamesService.remove(id.value);
      toast.success(`Гру «${title}» видалено разом з відгуками`);
      router.replace({ name: 'catalog' });
    } catch {
      // інтерцептор вже показав помилку
    }
  }

  return { game, reviews, isLoading, notFound, addReview, deleteReview, setDiscount, deleteGame };
}
