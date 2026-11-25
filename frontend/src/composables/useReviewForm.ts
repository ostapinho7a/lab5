import { computed, reactive, ref } from 'vue';
import { ApiError } from '@/api/httpClient';
import type { FieldErrors, NewReview } from '@/types';

const emptyForm = () => ({
  author: '',
  is_recommended: true,
  hours_played: '' as number | '',
  text: '',
});

export function useReviewForm(onSubmit: (review: NewReview) => Promise<unknown>) {
  const form = reactive(emptyForm());
  const submitted = ref(false);
  const isSaving = ref(false);
  const serverErrors = ref<FieldErrors>({});

  const errors = computed<FieldErrors>(() => {
    const result: FieldErrors = { ...serverErrors.value };
    if (!form.author.trim()) result.author = "Вкажи ім'я або нікнейм";
    if (form.hours_played === '' || form.hours_played < 0) result.hours_played = 'Скільки годин награно?';
    if (form.text.trim().length < 5) result.text = 'Напиши хоча б кілька слів';
    return result;
  });

  const errorOf = (field: string) => (submitted.value ? errors.value[field] : undefined);

  async function submit() {
    submitted.value = true;
    serverErrors.value = {};
    if (Object.keys(errors.value).length) return;

    isSaving.value = true;
    try {
      await onSubmit({
        author: form.author.trim(),
        is_recommended: form.is_recommended,
        hours_played: Number(form.hours_played),
        text: form.text.trim(),
      });
      Object.assign(form, emptyForm());
      submitted.value = false;
    } catch (error) {
      if (error instanceof ApiError) serverErrors.value = error.errors;
    } finally {
      isSaving.value = false;
    }
  }

  return { form, isSaving, errorOf, submit };
}
