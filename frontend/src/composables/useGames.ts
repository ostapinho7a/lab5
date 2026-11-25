import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gamesService } from '@/services/games.service';
import { useToastStore } from '@/stores/toast.store';
import type { Game, NewGame } from '@/types';

export function useGames() {
  const route = useRoute();
  const router = useRouter();
  const toast = useToastStore();

  const games = ref<Game[]>([]);
  const genres = ref<string[]>([]);
  const isLoading = ref(false);
  const loadError = ref('');

  // жанр тримаємо в адресі, щоб фільтр не злітав після F5
  const genre = computed(() => (typeof route.query.genre === 'string' ? route.query.genre : ''));

  function setGenre(value: string) {
    router.replace({ query: value ? { genre: value } : {} });
  }

  async function load() {
    isLoading.value = true;
    loadError.value = '';
    try {
      games.value = await gamesService.getAll(genre.value);
    } catch (error) {
      loadError.value = (error as Error).message;
    } finally {
      isLoading.value = false;
    }
  }

  // список жанрів беремо з повного каталогу
  async function loadGenres() {
    try {
      const all = await gamesService.getAll();
      genres.value = [...new Set(all.map((game) => game.genre))].sort();
    } catch {
      genres.value = [];
    }
  }

  watch(genre, load, { immediate: true });
  loadGenres();

  async function createGame(data: NewGame) {
    const game = await gamesService.create(data);
    toast.success(`Гру «${game.title}» додано`);
    await Promise.all([load(), loadGenres()]);
    return game;
  }

  async function setDiscount(id: string, discount: number) {
    try {
      const updated = await gamesService.setDiscount(id, discount);
      games.value = games.value.map((game) => (game.id === id ? updated : game));
      toast.success(discount ? `Знижка ${discount}% на «${updated.title}»` : `Знижку з «${updated.title}» прибрано`);
    } catch {
      // помилку вже показав інтерцептор
    }
  }

  return { games, genres, genre, isLoading, loadError, setGenre, load, createGame, setDiscount };
}
