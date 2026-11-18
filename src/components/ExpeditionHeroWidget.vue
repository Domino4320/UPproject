<template>
  <div class="mt-14 max-w-5xl mx-auto">
    <div class="bento-card p-4 sm:p-6 text-left">
      <!-- Верхняя панель переключателей экспедиций -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-900/10 dark:border-slate-800">
        <div class="flex items-center gap-2.5">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span class="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Ближайшие выходы • Live-сводка
          </span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="exp in expeditions"
            :key="exp.id"
            type="button"
            @click="activeId = exp.id"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              activeId === exp.id
                ? 'bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-md shadow-brand-600/20'
                : 'bg-emerald-50/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-slate-700'
            ]"
          >
            {{ exp.tab }}
          </button>
        </div>
      </div>

      <!-- Контент выбранной экспедиции с Vue Transition -->
      <Transition name="v-fade-slide" mode="out-in">
        <div :key="current.id" class="grid grid-cols-1 md:grid-cols-12 gap-5 pt-5 items-stretch">
          <!-- Фото с наложением -->
          <div class="md:col-span-5 relative rounded-2xl overflow-hidden min-h-[210px] group">
            <img
              :src="current.image"
              :alt="current.title"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div class="relative z-10 h-full p-4 flex flex-col justify-between text-white">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg bg-black/45 backdrop-blur-md text-[11px] font-mono font-bold">
                  {{ current.coords }}
                </span>
                <button
                  type="button"
                  @click="toggleLike(current.id)"
                  :class="[
                    'px-2.5 py-1 rounded-lg backdrop-blur-md text-xs font-bold transition flex items-center gap-1',
                    likedIds.has(current.id) ? 'bg-rose-500 text-white' : 'bg-black/45 text-white hover:bg-black/65'
                  ]"
                >
                  <span>{{ likedIds.has(current.id) ? '♥' : '♡' }}</span>
                  <span>{{ current.likes + (likedIds.has(current.id) ? 1 : 0) }}</span>
                </button>
              </div>
              <div>
                <div class="text-[11px] uppercase tracking-wider text-brand-300 font-bold">{{ current.date }}</div>
                <div class="text-lg font-extrabold leading-snug mt-0.5">{{ current.title }}</div>
              </div>
            </div>
          </div>

          <!-- Бенто-метрики справа -->
          <div class="md:col-span-7 flex flex-col justify-between gap-4">
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ current.desc }}
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/70 border border-emerald-900/5 dark:border-slate-700/60">
                <div class="text-[10px] uppercase font-bold text-slate-400">Погода</div>
                <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{{ current.weather }}</div>
              </div>
              <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/70 border border-emerald-900/5 dark:border-slate-700/60">
                <div class="text-[10px] uppercase font-bold text-slate-400">Высота</div>
                <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{{ current.elevation }}</div>
              </div>
              <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/70 border border-emerald-900/5 dark:border-slate-700/60">
                <div class="text-[10px] uppercase font-bold text-slate-400">Свободно мест</div>
                <div class="text-sm font-extrabold text-sunset-600 dark:text-sunset-400 mt-0.5">{{ current.spots }}</div>
              </div>
              <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/70 border border-emerald-900/5 dark:border-slate-700/60">
                <div class="text-[10px] uppercase font-bold text-slate-400">Сложность</div>
                <div class="mt-1.5 w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-brand-500 to-sunset-500 transition-all duration-500"
                    :style="{ width: `${current.difficulty}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <img :src="current.guideAvatar" :alt="current.guide" class="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/60">
                <span>Лидер группы: <strong class="text-slate-800 dark:text-slate-200">{{ current.guide }}</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <a href="./pages/kanban.html" class="ds-btn ds-btn-sm ds-btn-secondary">Компас маршрута</a>
                <a href="./pages/multistep.html" class="ds-btn ds-btn-sm ds-btn-primary">Забронировать →</a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const expeditions = [
  {
    id: 'iceland',
    tab: '❄️ Исландия F208',
    title: 'Зимняя Исландия: Аврора & Ледяные пещеры',
    coords: '64.048° N',
    date: '12 — 24 декабря',
    desc: 'Автономный выезд на подготовленных Super-Jeep 4x4 через чёрные пляжи, ледниковую лагуну Йёкюльсаурлоун и геотермальные источники.',
    weather: '-2°C • Ясно',
    elevation: '1 150 м',
    spots: '3 места',
    difficulty: 68,
    likes: 142,
    guide: 'Максим Ветров',
    guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'kamchatka',
    tab: '🌋 Камчатка',
    title: 'Камчатка: Кратеры Толбачика и Тихий океан',
    coords: '55.831° N',
    date: '10 — 21 августа',
    desc: 'Восхождение на дымящие конусы вулканов, ночёвки среди лавовых полей Мёртвого леса и выход в океан на встречу с косатками.',
    weather: '+11°C • Бриз',
    elevation: '3 085 м',
    spots: '4 места',
    difficulty: 84,
    likes: 198,
    guide: 'Артём Мельников',
    guideAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'patagonia',
    tab: '🏔️ Патагония O-Trek',
    title: 'Патагония: Полное кольцо Торрес-дель-Пайне',
    coords: '50.942° S',
    date: '3 — 19 февраля',
    desc: 'Легендарный автономный трек вокруг гранитных башен на краю света: перевал Джон Гарднер и панорама Южного ледникового плато.',
    weather: '+7°C • Ветер',
    elevation: '1 241 м',
    spots: '2 места',
    difficulty: 92,
    likes: 215,
    guide: 'Алина Соколова',
    guideAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
  },
];

const activeId = ref('iceland');
const likedIds = ref(new Set());

const current = computed(() => expeditions.find(e => e.id === activeId.value) || expeditions[0]);

function toggleLike(id) {
  const next = new Set(likedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  likedIds.value = next;
}
</script>
