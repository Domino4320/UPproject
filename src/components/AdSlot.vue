<template>
  <div 
    v-if="isVisible"
    class="relative flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/60 rounded-2xl transition-all duration-200 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 group overflow-hidden select-none shadow-sm"
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
      class="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition text-xs"
      title="Скрыть рекламу"
      aria-label="Закрыть"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Иконка и бейдж -->
    <div class="relative z-10 flex items-center gap-2 mb-1.5">
      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
        <svg class="w-3 h-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z" />
        </svg>
        Реклама
      </span>
      <span class="text-[11px] font-mono text-slate-400 dark:text-slate-500">
        {{ computedDimensions }}
      </span>
    </div>

    <!-- Основной текстовый идентификатор -->
    <div class="relative z-10 px-4">
      <div class="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {{ label }}
      </div>
      <div class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
        {{ sublabel }}
      </div>
    </div>

    <!-- Нижняя полоска с мета-информацией -->
    <div class="relative z-10 mt-2 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-2">
      <span>Формат: {{ size }}</span>
      <span>•</span>
      <span>Google AdSense / Sponsor Friendly</span>
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
    default: 'Рекламное место',
  },
  // Дополнительный поясняющий текст
  sublabel: {
    type: String,
    default: 'Место зарезервировано под баннер партнёра',
  },
  // Возможность закрытия пользователем
  closable: {
    type: Boolean,
    default: false,
  },
});

const isVisible = ref(true);

// Пресеты CSS-классов Tailwind под стандартные форматы рекламы
const presetClass = computed(() => {
  switch (props.size) {
    case 'leaderboard':
      return 'w-full max-w-5xl min-h-[110px] p-5 my-8';
    case 'sidebar':
      return 'w-full min-h-[260px] p-6 my-4';
    case 'rectangle':
      return 'w-full max-w-sm min-h-[250px] p-6 my-6 mx-auto';
    case 'inline':
      return 'w-full min-h-[80px] p-4 my-4';
    case 'banner':
    default:
      return 'w-full max-w-4xl min-h-[100px] p-4 my-6 mx-auto';
  }
});

// Кастомные стили (если переданы width / height)
const customStyle = computed(() => {
  const style = {};
  if (props.width) style.width = props.width;
  if (props.height) style.height = props.height;
  return style;
});

// Вычисление отображаемого размера
const computedDimensions = computed(() => {
  if (props.width && props.height) {
    return `${props.width} × ${props.height}`;
  }
  switch (props.size) {
    case 'leaderboard':
      return '728 × 90 / Auto';
    case 'sidebar':
      return '300 × 250 / Sticky';
    case 'rectangle':
      return '336 × 280 / M-Rect';
    case 'inline':
      return 'Fluid × 80px';
    case 'banner':
    default:
      return 'Responsive Leaderboard';
  }
});
</script>
