<template>
  <div 
    v-if="isVisible"
    class="relative w-full rounded-2xl transition-all duration-200 group overflow-hidden select-none border-2 border-dashed border-indigo-200/90 dark:border-indigo-900/60 hover:border-brand-400 dark:hover:border-brand-500 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/60 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-indigo-950/40 shadow-sm hover:shadow-md"
    :class="presetClass"
    :style="customStyle"
    data-ad-slot
  >
    <!-- Фоновый декоративный паттерн -->
    <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>

    <!-- Кнопка закрытия (опциональная) -->
    <button
      v-if="closable"
      @click="isVisible = false"
      type="button"
      class="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition text-xs"
      title="Скрыть блок"
      aria-label="Закрыть"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Вариант 1: Leaderboard / Banner (Широкий горизонтальный для страниц) -->
    <div v-if="size === 'leaderboard' || size === 'banner'" class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="space-y-1.5 max-w-2xl text-left">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z" />
            </svg>
            Партнёрский спецпроект
          </span>
          <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">• 100 000+ IT-аудитории</span>
        </div>
        <h3 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {{ label }}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {{ sublabel }}
        </p>
      </div>

      <div class="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0">
        <a href="#pricing" class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/20 transition whitespace-nowrap">
          Разместить рекламу →
        </a>
      </div>
    </div>

    <!-- Вариант 2: Sidebar (Вертикальный карточный блок) -->
    <div v-else-if="size === 'sidebar'" class="relative z-10 flex flex-col items-center text-center space-y-3">
      <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z" />
        </svg>
      </div>
      <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
        Партнёрский слот
      </span>
      <div>
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ label }}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{{ sublabel }}</p>
      </div>
      <a href="#pricing" class="w-full py-2 px-3 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition text-center shadow-sm">
        Разместить рекламу
      </a>
    </div>

    <!-- Вариант 3: Inline (Компактный для мини-сайдбаров и виджетов) -->
    <div v-else class="relative z-10 flex items-center justify-between gap-3 text-left">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5 mb-0.5">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span class="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Реклама</span>
        </div>
        <div class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ label }}</div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{{ sublabel }}</div>
      </div>
      <a href="#pricing" class="shrink-0 px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition shadow-sm whitespace-nowrap">
        Занять
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  // Предустановленный тип размера: 'banner' | 'leaderboard' | 'sidebar' | 'rectangle' | 'inline' | 'custom'
  size: {
    type: String,
    default: 'banner',
    validator: (val) => ['banner', 'leaderboard', 'sidebar', 'rectangle', 'inline', 'custom'].includes(val),
  },
  // Кастомная ширина (например, '728px', '100%', '300px')
  width: {
    type: String,
    default: '',
  },
  // Кастомная высота (например, '90px', '250px', '100%')
  height: {
    type: String,
    default: '',
  },
  // Текстовый заголовок слота
  label: {
    type: String,
    default: 'Здесь могла бы быть ваша реклама',
  },
  // Дополнительный поясняющий текст
  sublabel: {
    type: String,
    default: 'Привлекайте целевую аудиторию разработчиков и IT-бизнеса. Забронируйте партнёрский слот прямо сейчас.',
  },
  // Возможность закрытия пользователем
  closable: {
    type: Boolean,
    default: false,
  },
});

const isVisible = ref(true);

// Пресеты CSS-классов Tailwind под форматы рекламы (без внешних margins, чтобы не ломать отступы страниц)
const presetClass = computed(() => {
  switch (props.size) {
    case 'leaderboard':
      return 'p-5 sm:p-6 my-0';
    case 'sidebar':
      return 'p-5 my-0';
    case 'rectangle':
      return 'max-w-sm p-5 my-0 mx-auto';
    case 'inline':
      return 'p-3 my-0';
    case 'banner':
    default:
      return 'p-5 sm:p-6 my-0 mx-auto';
  }
});

// Кастомные стили (если переданы width / height)
const customStyle = computed(() => {
  const style = {};
  if (props.width) style.width = props.width;
  if (props.height) style.height = props.height;
  return style;
});
</script>
