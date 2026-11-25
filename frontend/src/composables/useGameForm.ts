import { computed, reactive, ref } from 'vue';
import { ApiError } from '@/api/httpClient';
import type { FieldErrors, NewGame } from '@/types';

const emptyForm = () => ({
  title: '',
  genre: '',
  developer: '',
  price: '' as number | '',
  discount: 0 as number | '',
  image_url: '',
  description: '',
});

export function useGameForm(onSubmit: (game: NewGame) => Promise<unknown>) {
  const form = reactive(emptyForm());
  const submitted = ref(false);
  const isSaving = ref(false);
  const serverErrors = ref<FieldErrors>({});

  const errors = computed<FieldErrors>(() => {
    const result: FieldErrors = { ...serverErrors.value };
    if (!form.title.trim()) result.title = "Назва обов'язкова";
    if (!form.genre.trim()) result.genre = "Жанр обов'язковий";
    if (form.price === '' || form.price <= 0) result.price = 'Ціна має бути більше 0';
    if (form.discount === '' || !Number.isInteger(form.discount) || form.discount < 0 || form.discount > 90) {
      result.discount = 'Знижка від 0 до 90%';
    }
    return result;
  });

  // помилку показуємо тільки після першої спроби відправити
  const errorOf = (field: string) => (submitted.value ? errors.value[field] : undefined);

  function reset() {
    Object.assign(form, emptyForm());
    submitted.value = false;
    serverErrors.value = {};
  }

  async function submit() {
    submitted.value = true;
    serverErrors.value = {};
    if (Object.keys(errors.value).length) return false;

    isSaving.value = true;
    try {
      await onSubmit({
        title: form.title.trim(),
        genre: form.genre.trim(),
        developer: form.developer.trim(),
        price: Number(form.price),
        discount: Number(form.discount),
        image_url: form.image_url.trim(),
        description: form.description.trim(),
      });
      reset();
      return true;
    } catch (error) {
      if (error instanceof ApiError) serverErrors.value = error.errors;
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return { form, isSaving, errorOf, submit, reset };
}
