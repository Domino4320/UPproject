<template>
  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">

    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="space-y-2">
        <span class="ds-kicker">GPS & Field Logbook</span>
        <h1 class="ds-h1 text-3xl sm:text-4xl">Экспедиционный бортжурнал</h1>
        <p class="ds-body text-sm sm:text-base max-w-2xl">
          Личная телеметрия путешествий: штампы регионов, профиль набора высоты, бюджеты в BYN и живой журнал маршрутов.
        </p>
      </div>

      <div class="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          @click="addModalOpen = true"
          class="ds-btn ds-btn-md ds-btn-sunset shadow-lg shadow-sunset-500/20"
        >
          + Добавить маршрут
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

      <section class="lg:col-span-7 bento-card p-6 sm:p-7 flex flex-col justify-between gap-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=160&h=160&q=80"
              alt="Максим Ветров"
              class="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500 shadow-md"
            >
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Паспорт исследователя</div>
              <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Максим Ветров</h2>
              <div class="text-xs text-slate-500 dark:text-slate-400">54 / 195 стран • 142 автономных трека</div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-[11px] uppercase font-bold text-slate-400">Пройдено по земле</div>
            <div class="text-2xl font-black bg-gradient-to-r from-brand-600 to-sunset-500 bg-clip-text text-transparent">
              280 450 км
            </div>
          </div>
        </div>

        <div class="space-y-2.5">
          <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Фильтр по регионам мира</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="reg in regions"
              :key="reg.key"
              type="button"
              @click="activeRegion = reg.key"
              :class="[
                'px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border',
                activeRegion === reg.key
                  ? 'bg-gradient-to-r from-brand-600 to-teal-600 text-white border-transparent shadow-md shadow-brand-600/20'
                  : 'bg-emerald-50/60 dark:bg-slate-800/80 border-emerald-900/10 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-500'
              ]"
            >
              <span>{{ reg.icon }}</span>
              <span>{{ reg.label }}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-forest-800 via-brand-800 to-slate-900 text-white shadow-xl flex flex-col justify-between gap-5 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-brand-400/20 blur-2xl pointer-events-none"></div>

        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span class="text-xs font-mono uppercase tracking-widest text-emerald-200">Iridium Beacon • Online</span>
          </div>
          <span class="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-lg">64.048° N</span>
        </div>

        <div class="relative z-10 space-y-1">
          <div class="text-xs text-emerald-200/80">Текущая цель экспедиции</div>
          <div class="text-xl font-black leading-snug">Исландия: Перевал F208 & Ватнайёкюдль</div>
        </div>

        <div class="grid grid-cols-3 gap-2.5 relative z-10 pt-2 border-t border-white/15">
          <div>
            <div class="text-[10px] uppercase text-emerald-200/70">Набор высоты</div>
            <div class="text-base font-extrabold">18 400 м</div>
          </div>
          <div>
            <div class="text-[10px] uppercase text-emerald-200/70">Ср. бюджет</div>
            <div class="text-base font-extrabold">5 100 BYN</div>
          </div>
          <div>
            <div class="text-[10px] uppercase text-emerald-200/70">Команда</div>
            <div class="text-base font-extrabold">12 чел.</div>
          </div>
        </div>
      </section>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

      <section class="lg:col-span-8 bento-card p-6 sm:p-7 flex flex-col justify-between gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Сезонная динамика</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Нажмите на столбец месяца для детальной сводки</p>
          </div>
          <div class="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              type="button"
              @click="chartMetric = 'elevation'"
              :class="['px-3 py-1.5 rounded-lg transition', chartMetric === 'elevation' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300']"
            >
              Высота (м)
            </button>
            <button
              type="button"
              @click="chartMetric = 'distance'"
              :class="['px-3 py-1.5 rounded-lg transition', chartMetric === 'distance' ? 'bg-sunset-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300']"
            >
              Дистанция (км)
            </button>
          </div>
        </div>

        <div class="h-48 flex items-end justify-between gap-2 sm:gap-3 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            v-for="(m, idx) in monthlyStats"
            :key="m.month"
            type="button"
            @click="selectedMonthIdx = idx"
            class="flex-1 h-full flex flex-col items-center justify-end gap-2 group cursor-pointer"
          >
            <span class="text-[10px] font-mono font-bold text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              {{ chartMetric === 'elevation' ? m.elev : m.dist }}
            </span>
            <div class="w-full flex items-end justify-center h-32">
              <div
                :class="[
                  'w-full max-w-[34px] rounded-t-xl transition-all duration-500',
                  selectedMonthIdx === idx
                    ? (chartMetric === 'elevation' ? 'bg-brand-600 shadow-lg shadow-brand-600/30' : 'bg-sunset-500 shadow-lg shadow-sunset-500/30')
                    : (chartMetric === 'elevation' ? 'bg-brand-500/40 group-hover:bg-brand-500/75' : 'bg-sunset-500/40 group-hover:bg-sunset-500/75')
                ]"
                :style="{ height: `${chartMetric === 'elevation' ? m.elevPct : m.distPct}%` }"
              ></div>
            </div>
            <span :class="['text-[11px] font-bold', selectedMonthIdx === idx ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400']">
              {{ m.month }}
            </span>
          </button>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="text-slate-500 dark:text-slate-400">
            Выбран месяц: <strong class="text-slate-900 dark:text-white">{{ monthlyStats[selectedMonthIdx].full }}</strong> — {{ monthlyStats[selectedMonthIdx].note }}
          </span>
          <span class="font-bold text-brand-600 dark:text-brand-400">
            {{ monthlyStats[selectedMonthIdx].elev }} м набора • {{ monthlyStats[selectedMonthIdx].dist }} км
          </span>
        </div>
      </section>

      <section class="lg:col-span-4 bento-card p-6 sm:p-7 flex flex-col justify-between gap-5">
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Смета сезона</h3>
            <span class="text-sm font-black text-brand-600 dark:text-brand-400">11 300 BYN</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Среднее распределение расходов</p>
        </div>

        <div class="space-y-4">
          <div v-for="b in budgetBreakdown" :key="b.label" class="space-y-1.5">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-slate-700 dark:text-slate-300">{{ b.label }}</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white">{{ b.amount }} BYN ({{ b.pct }}%)</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div :class="['h-full rounded-full transition-all duration-500', b.color]" :style="{ width: `${b.pct}%` }"></div>
            </div>
          </div>
        </div>

        <a href="./ecommerce.html" class="ds-btn ds-btn-sm ds-btn-secondary w-full text-center">
          Оптимизировать в магазине →
        </a>
      </section>
    </div>

    <section class="bento-card overflow-hidden">
      <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Журнал маршрутов и треков</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Найдено записей: {{ filteredRoutes.length }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <div class="flex gap-1.5">
            <button
              v-for="st in statusTabs"
              :key="st.key"
              type="button"
              @click="activeStatus = st.key"
              :class="[
                'px-3 py-1.5 rounded-xl text-xs font-bold transition',
                activeStatus === st.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              ]"
            >
              {{ st.label }}
            </button>
          </div>
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Поиск по маршруту..."
            class="ds-input py-1.5 px-3 text-xs w-48 bg-slate-50 dark:bg-slate-800"
          >
        </div>
      </div>

      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <div
          v-for="route in filteredRoutes"
          :key="route.id"
          class="p-5 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition"
        >
          <div class="space-y-1 max-w-xl">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">{{ route.title }}</span>
              <span :class="['ds-badge', statusBadgeClass(route.status)]">{{ route.statusLabel }}</span>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3">
              <span>📅 {{ route.dates }}</span>
              <span>📍 {{ route.regionLabel }}</span>
              <span>⛰️ {{ route.elevation }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between md:justify-end gap-5 shrink-0">
            <div class="text-left md:text-right">
              <div class="text-[10px] uppercase font-bold text-slate-400">Бюджет</div>
              <div class="text-sm font-black text-slate-900 dark:text-white">{{ route.budget.toLocaleString('ru-RU') }} BYN</div>
            </div>
            <a href="./kanban.html" class="ds-btn ds-btn-sm ds-btn-secondary">Компас →</a>
          </div>
        </div>

        <div v-if="filteredRoutes.length === 0" class="p-10 text-center text-sm text-slate-400">
          По выбранным фильтрам записей пока нет.
        </div>
      </div>
    </section>

    <Transition name="v-fade-slide">
      <div v-if="addModalOpen" @click.self="addModalOpen = false" class="ds-modal-backdrop">
        <div class="ds-modal-content max-w-md p-6 space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Новая запись в журнал</h3>
            <button type="button" @click="addModalOpen = false" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
          </div>
          <form @submit.prevent="addRoute" class="space-y-3.5">
            <div>
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Название маршрута *</label>
              <input v-model.trim="newRoute.title" type="text" required minlength="3" placeholder="Напр. Алтай: Озеро Аккем" class="ds-input text-sm">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Регион</label>
                <select v-model="newRoute.region" class="ds-input text-sm">
                  <option value="arctic">Арктика</option>
                  <option value="alps">Альпы</option>
                  <option value="asia">Азия</option>
                  <option value="patagonia">Юж. Америка</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Бюджет (BYN) *</label>
                <input v-model.number="newRoute.budget" type="number" min="100" required placeholder="2500" class="ds-input text-sm">
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Даты</label>
              <input v-model.trim="newRoute.dates" type="text" required placeholder="15 — 25 июля 2026" class="ds-input text-sm">
            </div>
            <button type="submit" class="w-full ds-btn ds-btn-md ds-btn-primary">Сохранить в бортжурнал</button>
          </form>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';

const regions = [
  { key: 'all', icon: '🌍', label: 'Все регионы' },
  { key: 'arctic', icon: '❄️', label: 'Арктика' },
  { key: 'alps', icon: '🏔️', label: 'Альпы' },
  { key: 'asia', icon: '⛩️', label: 'Азия' },
  { key: 'patagonia', icon: '🧭', label: 'Юж. Америка' },
];

const statusTabs = [
  { key: 'all', label: 'Все' },
  { key: 'planned', label: 'В плане' },
  { key: 'recruiting', label: 'Набор группы' },
  { key: 'done', label: 'Завершён' },
];

const monthlyStats = [
  { month: 'Апр', full: 'Апрель', elev: 1450, dist: 120, elevPct: 35, distPct: 32, note: 'Кумано-Кодо и весенний Непал' },
  { month: 'Май', full: 'Май', elev: 2100, dist: 185, elevPct: 50, distPct: 48, note: 'Тренировочные выходы в горах' },
  { month: 'Июн', full: 'Июнь', elev: 3200, dist: 290, elevPct: 72, distPct: 75, note: 'Открытие F-дорог в Исландии' },
  { month: 'Июл', full: 'Июль', elev: 4450, dist: 380, elevPct: 100, distPct: 95, note: 'Пик сезона: Доломиты и Лофотены' },
  { month: 'Авг', full: 'Август', elev: 4100, dist: 410, elevPct: 92, distPct: 100, note: 'Экспедиция на вулканы Камчатки' },
  { month: 'Сен', full: 'Сентябрь', elev: 3100, dist: 245, elevPct: 68, distPct: 62, note: 'Золотая осень на Байкале' },
];

const budgetBreakdown = [
  { label: 'Перелёты и трансферы', amount: '4 300', pct: 38, color: 'bg-brand-500' },
  { label: 'Аренда 4x4 / Кемперов', amount: '3 160', pct: 28, color: 'bg-sunset-500' },
  { label: 'Снаряжение и питание', amount: '2 030', pct: 18, color: 'bg-teal-500' },
  { label: 'Пермиты и страховка SAR', amount: '1 810', pct: 16, color: 'bg-indigo-500' },
];

const routes = ref([
  { id: 1, title: 'Исландия: Кольцо по F-дорогам 4x4', region: 'arctic', regionLabel: 'Арктика', dates: '12 — 24 декабря 2026', elevation: '1 150 м', budget: 4800, status: 'recruiting', statusLabel: 'Набор группы' },
  { id: 2, title: 'Доломиты: Панорамные виа-ферраты', region: 'alps', regionLabel: 'Альпы', dates: '10 — 18 сентября 2026', elevation: '2 950 м', budget: 3900, status: 'planned', statusLabel: 'В плане' },
  { id: 3, title: 'Лофотены: Кемпер и полярное лето', region: 'arctic', regionLabel: 'Арктика', dates: '4 — 14 июля 2026', elevation: '543 м', budget: 3800, status: 'done', statusLabel: 'Завершён' },
  { id: 4, title: 'Патагония: Автоном O-Trek Торрес-дель-Пайне', region: 'patagonia', regionLabel: 'Юж. Америка', dates: '3 — 19 февраля 2026', elevation: '1 241 м', budget: 7900, status: 'done', statusLabel: 'Завершён' },
  { id: 5, title: 'Япония: Кедровые тропы Кумано-Кодо', region: 'asia', regionLabel: 'Азия', dates: '14 — 28 апреля 2026', elevation: '960 м', budget: 5900, status: 'done', statusLabel: 'Завершён' },
]);

const activeRegion = ref('all');
const activeStatus = ref('all');
const searchQuery = ref('');
const chartMetric = ref('elevation');
const selectedMonthIdx = ref(3);
const addModalOpen = ref(false);
const newRoute = ref({ title: '', region: 'arctic', budget: 2500, dates: '' });

const filteredRoutes = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return routes.value.filter(r => {
    if (activeRegion.value !== 'all' && r.region !== activeRegion.value) return false;
    if (activeStatus.value !== 'all' && r.status !== activeStatus.value) return false;
    if (q && !`${r.title} ${r.regionLabel}`.toLowerCase().includes(q)) return false;
    return true;
  });
});

function statusBadgeClass(st) {
  if (st === 'recruiting') return 'ds-badge-sunset';
  if (st === 'planned') return 'ds-badge-brand';
  return 'ds-badge-success';
}

function addRoute() {
  const regionMap = { arctic: 'Арктика', alps: 'Альпы', asia: 'Азия', patagonia: 'Юж. Америка' };
  routes.value.unshift({
    id: Date.now(),
    title: newRoute.value.title,
    region: newRoute.value.region,
    regionLabel: regionMap[newRoute.value.region] || 'Арктика',
    dates: newRoute.value.dates,
    elevation: '1 500 м',
    budget: Number(newRoute.value.budget) || 2500,
    status: 'planned',
    statusLabel: 'В плане',
  });
  newRoute.value = { title: '', region: 'arctic', budget: 2500, dates: '' };
  addModalOpen.value = false;
  if (window.showToast) {
    window.showToast('Маршрут добавлен', 'Новая запись появилась в бортжурнале.', 'success');
  }
}
</script>
