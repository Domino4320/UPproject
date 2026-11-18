<template>
  <div
    v-if="isVisible"
    class="relative w-full rounded-2xl transition-all duration-200 group overflow-hidden select-none border-2 border-dashed border-brand-300 dark:border-brand-800 hover:border-brand-500 dark:hover:border-brand-400 bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-amber-50/60 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-teal-950/40 shadow-sm hover:shadow-md"
    :class="presetClass"
    :style="customStyle"
    data-ad-slot
  >

    <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>

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

    <div v-if="size === 'leaderboard' || size === 'banner'" class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6">
      <div class="space-y-1.5 max-w-2xl text-left">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sunset-500/10 text-sunset-700 dark:text-sunset-400 border border-sunset-500/20">
            <svg class="w-3 h-3 text-sunset-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
            Партнёрский спецпроект
          </span>
          <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">• Проверено TerraNova Expedition</span>
        </div>
        <h3 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {{ label }}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {{ sublabel }}
        </p>
      </div>

      <div class="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0">
        <a href="#club" class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white shadow-md shadow-brand-600/20 transition whitespace-nowrap">
          Активировать промокод →
        </a>
      </div>
    </div>

    <div v-else-if="size === 'sidebar'" class="relative z-10 flex flex-col items-center text-center space-y-3 p-5">
      <div class="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sunset-500/10 text-sunset-700 dark:text-sunset-400 border border-sunset-500/20">
        Спецпредложение
      </span>
      <div>
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ label }}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{{ sublabel }}</p>
      </div>
      <a href="#club" class="w-full py-2 px-3 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition text-center shadow-sm">
        Узнать подробности
      </a>
    </div>

    <div v-else class="relative z-10 flex items-center justify-between gap-3 text-left p-3.5">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5 mb-0.5">
          <span class="w-1.5 h-1.5 rounded-full bg-sunset-500"></span>
          <span class="text-[10px] font-bold uppercase tracking-wider text-sunset-600 dark:text-sunset-400">Экспедиционный партнёр</span>
        </div>
        <div class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ label }}</div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{{ sublabel }}</div>
      </div>
      <a href="#club" class="shrink-0 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
        Подробнее →
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdSlot',
  props: {
    size: {
      type: String,
      default: 'banner',
      validator: (val) => ['banner', 'leaderboard', 'sidebar', 'inline'].includes(val),
    },
    width: {
      type: [String, Number],
      default: '',
    },
    height: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: 'Снаряжение для экспедиций со скидкой 25%',
    },
    sublabel: {
      type: String,
      default: 'Топовые мембраны, треккинговая обувь и спутниковая связь от проверенных брендов для подписчиков блога.',
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isVisible: true,
    };
  },
  computed: {
    presetClass() {
      switch (this.size) {
        case 'leaderboard':
          return 'min-h-[110px] sm:min-h-[90px]';
        case 'sidebar':
          return 'max-w-[340px] w-full';
        case 'inline':
          return 'py-2 px-3';
        case 'banner':
        default:
          return 'min-h-[90px]';
      }
    },
    customStyle() {
      const style = {};
      if (this.width) {
        style.width = typeof this.width === 'number' ? `${this.width}px` : this.width;
      }
      if (this.height) {
        style.minHeight = typeof this.height === 'number' ? `${this.height}px` : this.height;
      }
      return style;
    },
  },
};
</script>
