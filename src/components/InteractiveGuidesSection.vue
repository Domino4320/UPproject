<template>
  <section id="articles" class="section-container scroll-mt-24">
    <div class="section-heading-wrapper">
      <span class="ds-kicker mb-3">Проверенные экспедиции</span>
      <h2 class="ds-h2">Популярные путеводители и отчёты</h2>
      <p class="ds-body mt-3">
        Готовые маршруты с картами, точками стоянок, таймингом и сметой расходов. Выбирайте стихию или ищите по региону:
      </p>
    </div>

    <!-- Панель фильтров, поиска и вида -->
    <div class="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bento-card p-3.5 sm:p-4">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="tag in tags"
          :key="tag.key"
          type="button"
          @click="activeTag = tag.key"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-bold transition-all',
            activeTag === tag.key
              ? 'bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-md shadow-brand-600/20'
              : 'bg-emerald-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-slate-700'
          ]"
        >
          {{ tag.label }}
        </button>
      </div>

      <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
        <div class="relative flex-1 sm:w-64">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Поиск по стране или маршруту..."
            class="ds-input pl-9 py-2 text-xs bg-slate-50 dark:bg-slate-800"
          >
        </div>

        <select v-model="sortBy" class="ds-input py-2 text-xs w-auto font-semibold cursor-pointer bg-slate-50 dark:bg-slate-800">
          <option value="popular">По рейтингу</option>
          <option value="budget-asc">Сначала бюджетные</option>
          <option value="days-asc">По длительности</option>
        </select>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-if="filteredGuides.length === 0" class="text-center py-14 bento-card space-y-3">
      <div class="text-3xl">🗺️</div>
      <h3 class="font-bold text-lg text-slate-900 dark:text-white">Маршруты не найдены</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">Попробуйте изменить запрос или сбросить фильтр стихий.</p>
      <button type="button" @click="resetFilters" class="ds-btn ds-btn-sm ds-btn-primary">Сбросить фильтры</button>
    </div>

    <!-- Сетка путеводителей -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      <article
        v-for="guide in filteredGuides"
        :key="guide.id"
        class="group bento-card flex flex-col justify-between hover:-translate-y-1.5"
      >
        <div>
          <div @click="selectedGuide = guide" class="relative h-56 overflow-hidden cursor-pointer">
            <img
              :src="guide.image"
              :alt="guide.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

            <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span :class="['px-2.5 py-1 rounded-lg text-[11px] font-bold text-white backdrop-blur-md', guide.badgeBg]">
                {{ guide.tagLabel }}
              </span>
              <button
                type="button"
                @click.stop="toggleFavorite(guide)"
                :class="[
                  'w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center text-sm transition',
                  favorites.has(guide.id) ? 'bg-rose-500 text-white' : 'bg-black/45 text-white hover:bg-black/70'
                ]"
                title="Сохранить маршрут"
              >
                {{ favorites.has(guide.id) ? '♥' : '♡' }}
              </button>
            </div>

            <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span class="font-mono font-semibold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">{{ guide.coords }}</span>
              <span class="font-bold text-amber-300">★ {{ guide.rating }}</span>
            </div>
          </div>

          <div class="p-6 space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span class="font-semibold text-brand-600 dark:text-brand-400">{{ guide.region }}</span>
              <span>{{ guide.daysLabel }}</span>
            </div>

            <h3
              @click="selectedGuide = guide"
              class="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer leading-snug"
            >
              {{ guide.title }}
            </h3>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {{ guide.shortDesc }}
            </p>
          </div>
        </div>

        <div class="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <span class="text-[10px] uppercase tracking-wider text-slate-400 block">Бюджет от</span>
            <span class="text-base font-black text-slate-900 dark:text-white">{{ formatPrice(guide.budgetNum) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" @click="selectedGuide = guide" class="ds-btn ds-btn-sm ds-btn-primary">
              Маршрут →
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Модальное окно деталей маршрута -->
    <Transition name="v-fade-slide">
      <div v-if="selectedGuide" @click.self="selectedGuide = null" class="ds-modal-backdrop">
        <div class="ds-modal-content max-w-2xl max-h-[90vh] flex flex-col">
          <div class="relative h-52 sm:h-60 shrink-0 overflow-hidden">
            <img :src="selectedGuide.image" :alt="selectedGuide.title" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"></div>
            <button type="button" @click="selectedGuide = null" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition">✕</button>
            <div class="absolute bottom-4 left-6 right-6 text-white">
              <span class="text-xs font-bold uppercase tracking-wider text-brand-300">{{ selectedGuide.region }}</span>
              <h3 class="text-xl sm:text-2xl font-extrabold leading-tight mt-0.5">{{ selectedGuide.title }}</h3>
            </div>
          </div>

          <div class="p-6 overflow-y-auto space-y-5">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80">
                <div class="text-[11px] text-slate-500 dark:text-slate-400">Дистанция / Дни</div>
                <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{{ selectedGuide.duration }}</div>
              </div>
              <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80">
                <div class="text-[11px] text-slate-500 dark:text-slate-400">Сезон</div>
                <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{{ selectedGuide.season }}</div>
              </div>
              <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80">
                <div class="text-[11px] text-slate-500 dark:text-slate-400">Бюджет</div>
                <div class="text-sm font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">{{ formatPrice(selectedGuide.budgetNum) }}</div>
              </div>
            </div>

            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ selectedGuide.desc }}</p>

            <div class="space-y-2">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Ключевые точки маршрута</div>
              <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <li v-for="pt in selectedGuide.points" :key="pt" class="flex items-start gap-2.5">
                  <span class="text-emerald-500 font-bold mt-0.5">🌲</span>
                  <span>{{ pt }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900">
            <button type="button" @click="downloadGpx(selectedGuide)" class="ds-btn ds-btn-md ds-btn-secondary">
              <span>📥 Скачать GPX-трек</span>
            </button>
            <a href="./pages/kanban.html" class="ds-btn ds-btn-md ds-btn-primary">Открыть в Компасе →</a>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const tags = [
  { key: 'all', label: 'Все маршруты' },
  { key: 'Горы', label: '🏔️ Горы' },
  { key: 'Арктика', label: '❄️ Арктика' },
  { key: 'Вулканы', label: '🌋 Вулканы' },
  { key: 'Тропы', label: '🌲 Тропы' },
];

const GUIDES = [
  {
    id: 'iceland',
    categories: ['Арктика', 'Вулканы'],
    tagLabel: '❄️ Арктика • 4x4',
    badgeBg: 'bg-brand-600/90',
    region: 'Северная Европа • Исландия',
    coords: '64.048° N',
    rating: 4.98,
    daysNum: 12,
    daysLabel: '12 дней • 2 100 км',
    duration: '12 дней • 2 100 км',
    season: 'Июнь — Сентябрь',
    budgetNum: 145000,
    title: 'Исландия: Полное кольцо по F-дорогам и ледникам',
    shortDesc: 'Чёрные пляжи, броды через ледниковые реки на 4x4 и цветные горы Ландманналаугар.',
    desc: 'Автономное путешествие на подготовленном внедорожнике 4x4 через центральное нагорье Ландманналаугар, ледниковую лагуну Йёкюльсаурлоун и дикие фьорды запада.',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=900&q=80',
    points: [
      'День 1-3: Золотое кольцо и долина гейзеров',
      'День 4-6: Цветные риолитовые горы Ландманналаугар и броды F208',
      'День 7-9: Ледник Ватнайёкюдль и чёрные пляжи Вик',
      'День 10-12: Полуостров Снайфедльснес и геотермальные купальни',
    ],
  },
  {
    id: 'dolomites',
    categories: ['Горы'],
    tagLabel: '🏔️ Горы • Альпы',
    badgeBg: 'bg-teal-600/90',
    region: 'Италия • Доломиты',
    coords: '46.618° N',
    rating: 4.95,
    daysNum: 8,
    daysLabel: '8 дней • 115 км',
    duration: '8 дней • 115 км',
    season: 'Июль — Октябрь',
    budgetNum: 98000,
    title: 'Доломиты: 7 лучших виа-феррат и панорамных троп',
    shortDesc: 'Альпийские луга, бирюзовые озёра Брайес и Сорапис, ночёвки в уютных горных приютах.',
    desc: 'Пешеходный треккинг с ночёвками в уютных горных приютах (рифуджио). Идеальный баланс красивейших панорам, доступных троп и альпийской кухни.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    points: [
      'День 1-2: Озеро Брайес и хребет Крода-дель-Бекко',
      'День 3-4: Кольцо вокруг Тре Чиме ди Лаваредо',
      'День 5-6: Панорама Seceda и массив Одле',
      'День 7-8: Бирюзовое озеро Сорапис и спуск в Кортину',
    ],
  },
  {
    id: 'japan',
    categories: ['Тропы'],
    tagLabel: '🌲 Тропы • Азия',
    badgeBg: 'bg-rose-600/90',
    region: 'Восточная Азия • Япония',
    coords: '33.840° N',
    rating: 4.97,
    daysNum: 14,
    daysLabel: '14 дней • 85 км',
    duration: '14 дней • 85 км пешком',
    season: 'Март — Май / Осень',
    budgetNum: 180000,
    title: 'Япония: Древние онсэны и тропы Кумано-Кодо',
    shortDesc: 'Кедровые леса полуострова Кии, ночёвка в буддийском храме на горе Коя-сан и горячие источники.',
    desc: 'Погружение в природную Японию: многовековые кедровые леса полуострова Кии, горные рёканы с горячими источниками и утренние медитации в храмах.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
    points: [
      'День 1-4: Киото, бамбуковые рощи и горная деревня Курама',
      'День 5-8: Тропа Накахэти (Кумано-Кодо) через кедровые перевалы',
      'День 9-11: Монастырь на горе Коя-сан и горячие онсэны Юномине',
      'День 12-14: Японские Альпы и возвращение в Токио',
    ],
  },
  {
    id: 'lofoten',
    categories: ['Арктика', 'Горы'],
    tagLabel: '❄️ Фьорды • Север',
    badgeBg: 'bg-cyan-600/90',
    region: 'Скандинавия • Норвегия',
    coords: '67.932° N',
    rating: 4.94,
    daysNum: 10,
    daysLabel: '10 дней • 95 км',
    duration: '10 дней • 95 км',
    season: 'Июнь — Август',
    budgetNum: 115000,
    title: 'Лофотены: Палатка на краю фьорда и полярное лето',
    shortDesc: 'Незаходящее солнце, бирюзовые пляжи Квалвика и крутые гребни над Норвежским морем.',
    desc: 'Путешествие за Полярный круг в сезон незаходящего солнца. Ночёвки в палатках на диких пляжах с бирюзовой водой и крутые подъёмы на гребни фьордов.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    points: [
      'День 1-3: Пляж Квалвика и восхождение на гору Рютен',
      'День 4-6: Деревня Рейне и ступени Рейнебринген',
      'День 7-8: Пляж Буннес и каякинг по фьорду',
      'День 9-10: Арктический сёрфинг в Унстаде',
    ],
  },
  {
    id: 'patagonia',
    categories: ['Горы', 'Тропы'],
    tagLabel: '🏔️ Патагония',
    badgeBg: 'bg-indigo-600/90',
    region: 'Южная Америка • Чили',
    coords: '50.942° S',
    rating: 4.99,
    daysNum: 16,
    daysLabel: '16 дней • 135 км',
    duration: '16 дней • 135 км',
    season: 'Ноябрь — Март',
    budgetNum: 240000,
    title: 'Патагония: O-Trek вокруг Торрес-дель-Пайне',
    shortDesc: 'Автономный маршрут на краю света: перевал Джон Гарднер, гранитные пики и ледник Грей.',
    desc: 'Серьёзная автономная экспедиция по краю света: перевал Джон Гарднер с видом на Южное Патагонское ледниковое плато, гранитные башни и ветра до 90 км/ч.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    points: [
      'День 1-5: Северная часть кольца O-Trek и перевал Джон Гарднер',
      'День 6-9: Долина Франсес и башни Торрес-дель-Пайне',
      'День 10-13: Переезд в Эль-Чальтен и трек к Фицрою',
      'День 14-16: Ледник Перито-Морено',
    ],
  },
  {
    id: 'kamchatka',
    categories: ['Вулканы'],
    tagLabel: '🌋 Вулканы • Россия',
    badgeBg: 'bg-sunset-600/90',
    region: 'Дальний Восток • Камчатка',
    coords: '55.831° N',
    rating: 4.99,
    daysNum: 11,
    daysLabel: '11 дней • 120 км',
    duration: '11 дней • 120 км',
    season: 'Июль — Сентябрь',
    budgetNum: 165000,
    title: 'Камчатка: Кратеры вулканов и берег Тихого океана',
    shortDesc: 'Лавовые поля Толбачика, фумаролы Мутновского, Халактырский пляж и термальные источники.',
    desc: 'Настоящая экспедиция в край огня и льда: лавовые поля Плоского Толбачика, дымящие фумаролы Мутновского, бурые медведи у рек и океанский прибой.',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=900&q=80',
    points: [
      'День 1-3: Халактырский пляж и выход к косаткам',
      'День 4-6: Вулканы Горелый и Мутновский, Дачные источники',
      'День 7-10: Мёртвый лес и восхождение на Плоский Толбачик',
      'День 11: Купание в термальных источниках Паратунки',
    ],
  },
];

const activeTag = ref('all');
const searchQuery = ref('');
const sortBy = ref('popular');
const selectedGuide = ref(null);
const favorites = ref(new Set());

const filteredGuides = computed(() => {
  const q = searchQuery.value.toLowerCase();
  let list = GUIDES.filter(g => {
    if (activeTag.value !== 'all' && !g.categories.includes(activeTag.value)) return false;
    if (q && !`${g.title} ${g.region} ${g.shortDesc}`.toLowerCase().includes(q)) return false;
    return true;
  });

  if (sortBy.value === 'budget-asc') list = [...list].sort((a, b) => a.budgetNum - b.budgetNum);
  else if (sortBy.value === 'days-asc') list = [...list].sort((a, b) => a.daysNum - b.daysNum);
  else list = [...list].sort((a, b) => b.rating - a.rating);
  return list;
});

function formatPrice(val) {
  return `${Number(val).toLocaleString('ru-RU')} ₽`;
}

function resetFilters() {
  activeTag.value = 'all';
  searchQuery.value = '';
  sortBy.value = 'popular';
}

function toggleFavorite(guide) {
  const next = new Set(favorites.value);
  const saved = !next.has(guide.id);
  if (saved) next.add(guide.id);
  else next.delete(guide.id);
  favorites.value = next;

  if (window.showToast) {
    window.showToast(
      saved ? 'Добавлено в избранное' : 'Удалено из избранного',
      guide.title,
      saved ? 'success' : 'info'
    );
  }
}

function downloadGpx(guide) {
  if (window.showToast) {
    window.showToast('GPX-трек загружен', `Маршрут «${guide.title}» готов для Organic Maps и Garmin.`, 'success');
  }
}
</script>
