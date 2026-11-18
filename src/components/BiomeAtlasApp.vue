<template>
  <div class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex gap-8">

    <aside class="w-60 shrink-0 hidden lg:block sticky top-28 self-start space-y-6">
      <div class="bento-card p-4 space-y-4">
        <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Разделы атласа</div>
        <nav class="space-y-1">
          <a href="#biomes" class="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-brand-600 transition">1. Природные биомы</a>
          <a href="#season-compass" class="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-brand-600 transition">2. Сезонный компас</a>
          <a href="#pack-calculator" class="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-brand-600 transition">3. Вес рюкзака</a>
          <a href="#leave-no-trace" class="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-brand-600 transition">4. Кодекс природы</a>
        </nav>
      </div>
    </aside>

    <main class="flex-1 min-w-0 space-y-16">

      <section class="relative overflow-hidden bento-card p-7 sm:p-10">
        <div class="relative z-10 max-w-3xl space-y-3">
          <span class="ds-kicker">Полевой справочник исследователя</span>
          <h1 class="ds-h1">Атлас природы и биомов TerraNova</h1>
          <p class="ds-body">
            Изучайте климатические зоны нашей планеты, подбирайте идеальный месяц для экспедиции и рассчитывайте вес снаряжения перед выходом на маршрут.
          </p>
        </div>
        <svg class="absolute bottom-0 right-0 w-64 sm:w-80 h-32 text-emerald-600/10 dark:text-emerald-400/10 pointer-events-none" viewBox="0 0 300 120" fill="currentColor">
          <path d="M20,120 L85,35 L135,85 L195,15 L265,95 L300,65 L300,120 Z"/>
        </svg>
      </section>

      <section id="biomes" class="space-y-6 scroll-mt-24">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 class="ds-h2">1. Природные зоны экспедиций</h2>
            <p class="ds-body-sm mt-1">Нажмите на любую зону, чтобы открыть полевую памятку по климату и экипировке.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tab in biomeTabs"
              :key="tab.key"
              type="button"
              @click="activeBiomeTab = tab.key"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition',
                activeBiomeTab === tab.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-emerald-900/10 dark:border-slate-700 hover:border-brand-500'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article
            v-for="biome in filteredBiomes"
            :key="biome.id"
            @click="selectedBiome = biome"
            class="bento-card overflow-hidden cursor-pointer group flex flex-col hover:-translate-y-1"
          >
            <div class="relative h-48 overflow-hidden">
              <img :src="biome.image" :alt="biome.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <span :class="['absolute top-3 left-3 ds-badge text-white border-0', biome.badgeBg]">
                {{ biome.badge }}
              </span>
              <div class="absolute bottom-3 left-4 right-4 text-white flex justify-between items-end">
                <h3 class="text-lg font-extrabold">{{ biome.title }}</h3>
                <span class="text-xs font-mono opacity-85">{{ biome.temp }}</span>
              </div>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ biome.shortDesc }}</p>
              <div class="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <span class="text-slate-500">{{ biome.season }}</span>
                <span class="font-bold text-brand-600 dark:text-brand-400">Открыть гид →</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="season-compass" class="bento-card p-6 sm:p-8 space-y-6 scroll-mt-24">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="ds-kicker mb-2">Интерактивный календарь</span>
            <h2 class="ds-h2">2. Сезонный компас путешествий</h2>
            <p class="ds-body-sm mt-1">Выберите месяц, чтобы узнать лучшие направления без штормов и толп.</p>
          </div>
          <div class="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-900/10 dark:border-slate-700 text-sm font-bold text-brand-700 dark:text-brand-300">
            {{ MONTHS[activeMonthIdx].name }}
          </div>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          <button
            v-for="(m, idx) in MONTHS"
            :key="m.short"
            type="button"
            @click="activeMonthIdx = idx"
            :class="[
              'py-2 rounded-xl text-xs font-bold transition',
              activeMonthIdx === idx
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white'
            ]"
          >
            {{ m.short }}
          </button>
        </div>

        <Transition name="v-fade-slide" mode="out-in">
          <div :key="activeMonthIdx" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 space-y-1">
              <div class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Идеальный сезон</div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">{{ MONTHS[activeMonthIdx].best }}</div>
            </div>
            <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 space-y-1">
              <div class="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Климатическая заметка</div>
              <div class="text-sm text-slate-700 dark:text-slate-300">{{ MONTHS[activeMonthIdx].warn }}</div>
            </div>
          </div>
        </Transition>
      </section>

      <section id="pack-calculator" class="bento-card p-6 sm:p-8 space-y-6 scroll-mt-24">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="ds-kicker mb-2">Снаряжение и вес</span>
            <h2 class="ds-h2">3. Калькулятор веса рюкзака</h2>
            <p class="ds-body-sm mt-1">Отмечайте снаряжение, которое берёте в поход — система рассчитает базовый вес (Base Weight).</p>
          </div>
          <div class="text-right p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-900/10 dark:border-slate-700 shrink-0">
            <div class="text-xs text-slate-500 dark:text-slate-400">Общий вес</div>
            <div class="text-3xl font-black text-brand-600 dark:text-brand-400">{{ totalWeight.toFixed(2) }} кг</div>
            <div :class="['text-[11px] font-bold mt-0.5', weightStatus.color]">{{ weightStatus.label }}</div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button type="button" @click="applyPackPreset('ultralight')" class="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-xs font-bold transition">🪶 Ультралайт (&lt;5 кг)</button>
          <button type="button" @click="applyPackPreset('expedition')" class="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-xs font-bold transition">⛺ Полная экспедиция</button>
          <button type="button" @click="applyPackPreset('clear')" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-xs font-bold transition">Снять всё</button>
        </div>

        <div class="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-emerald-500 via-brand-500 to-sunset-500 transition-all duration-300"
            :style="{ width: `${Math.min(100, (totalWeight / 14) * 100)}%` }"
          ></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            v-for="item in gearItems"
            :key="item.name"
            :class="[
              'flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition',
              item.checked
                ? 'bg-emerald-50/70 dark:bg-brand-950/30 border-brand-500/40'
                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60 hover:border-brand-500'
            ]"
          >
            <div class="flex items-center gap-3">
              <input type="checkbox" v-model="item.checked" class="ds-checkbox">
              <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.name }}</span>
            </div>
            <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">{{ item.weight.toFixed(2) }} кг</span>
          </label>
        </div>

        <form @submit.prevent="addCustomGear" class="flex flex-col sm:flex-row gap-3 pt-2">
          <input v-model.trim="customName" type="text" placeholder="Добавить своё снаряжение (напр. Штатив)" class="ds-input flex-1 text-sm" required>
          <input v-model.number="customWeight" type="number" step="0.05" min="0.05" max="20" placeholder="Вес (кг)" class="ds-input sm:w-32 text-sm" required>
          <button type="submit" class="ds-btn ds-btn-md ds-btn-primary shrink-0">+ Добавить</button>
        </form>
      </section>

      <section id="leave-no-trace" class="bento-card p-6 sm:p-8 space-y-5 scroll-mt-24">
        <h2 class="ds-h2">4. Кодекс дикой природы (Leave No Trace)</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 space-y-1.5">
            <div class="font-bold text-sm">🏕️ Стоянки только на твёрдом</div>
            <p class="text-xs text-slate-600 dark:text-slate-400">Ставьте палатку на уже утоптанных площадках, не повреждая хрупкий мох тундры.</p>
          </div>
          <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 space-y-1.5">
            <div class="font-bold text-sm">🔥 Горелка вместо костра</div>
            <p class="text-xs text-slate-600 dark:text-slate-400">Газовая или мультитопливная горелка не оставляет кострищ и спасает леса от пожаров.</p>
          </div>
          <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 space-y-1.5">
            <div class="font-bold text-sm">🎒 Всё принесённое — с собой</div>
            <p class="text-xs text-slate-600 dark:text-slate-400">Даже органические отходы в холодном климате разлагаются годами. Уносите всё до города.</p>
          </div>
        </div>
      </section>
    </main>

    <Transition name="v-fade-slide">
      <div v-if="selectedBiome" @click.self="selectedBiome = null" class="ds-modal-backdrop">
        <div class="ds-modal-content max-w-xl p-6 sm:p-8 space-y-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span :class="['ds-badge mb-2 text-white border-0', selectedBiome.badgeBg]">{{ selectedBiome.badge }}</span>
              <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ selectedBiome.title }}</h3>
            </div>
            <button type="button" @click="selectedBiome = null" class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">✕</button>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ selectedBiome.desc }}</p>
          <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 space-y-2">
            <div class="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">Обязательно в рюкзаке</div>
            <ul class="space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
              <li v-for="it in selectedBiome.items" :key="it" class="flex items-start gap-2">
                <span class="text-emerald-500 font-bold">✓</span>
                <span>{{ it }}</span>
              </li>
            </ul>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <a href="./kanban.html" class="ds-btn ds-btn-md ds-btn-primary">Открыть компас маршрута →</a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const biomeTabs = [
  { key: 'all', label: 'Все биомы' },
  { key: 'mountains', label: '🏔️ Горы' },
  { key: 'arctic', label: '❄️ Арктика' },
  { key: 'forest', label: '🌲 Леса' },
];

const BIOMES = [
  {
    id: 'volcanic',
    type: 'mountains',
    badge: '🌋 Вулканические плато',
    badgeBg: 'bg-sunset-600/90',
    title: 'Камчатка и Исландия',
    temp: '+4°C … +15°C',
    shortDesc: 'Острые лавовые поля, дымящиеся фумаролы, резкая смена тумана и сильный ветер.',
    season: 'Сезон: Июль — Сентябрь',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80',
    desc: 'Вулканические плато отличаются острым шлаком, который быстро стирает мягкую подошву, а также сильным ветром и сернистыми газами возле кратеров.',
    items: [
      'Ботинки с высоким рантом и жёсткой подошвой Vibram',
      'Защитные очки и бафф от пепла при сильном ветре',
      'Треккинговые палки для спуска по сыпучему шлаку',
      'Запас воды минимум 2.5 л на день (на лаве нет ручьёв)',
    ],
  },
  {
    id: 'alpine',
    type: 'mountains',
    badge: '🏔️ Альпийские хребты',
    badgeBg: 'bg-brand-600/90',
    title: 'Доломиты и Патагония',
    temp: '-5°C … +18°C',
    shortDesc: 'Перепады высот до 1500 м за день, виа-ферраты, ледниковые озёра и ночной мороз.',
    season: 'Сезон: Июнь — Октябрь',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    desc: 'В высокогорье температура падает на 6°C каждые 1000 м подъёма. Днём вы идёте в футболке, а на закате на перевале уже около нуля.',
    items: [
      'Трёхслойная одежда: термобельё, флис, мембрана 20 000 мм',
      'Пуховка для вечерних стоянок на высоте >2000 м',
      'Крем SPF 50+ и солнцезащитные очки категории 3',
      'Офлайн-карта высот и запасной пауэрбанк',
    ],
  },
  {
    id: 'arctic',
    type: 'arctic',
    badge: '❄️ Арктика и фьорды',
    badgeBg: 'bg-cyan-600/90',
    title: 'Лофотены и Шпицберген',
    temp: '-15°C … +10°C',
    shortDesc: 'Штормовые ветра с океана, полярная ночь или незаходящее солнце, высокая влажность.',
    season: 'Сезон: Круглый год',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    desc: 'Высокая влажность у Северного Ледовитого океана делает холод пронизывающим. Главный враг — мокрый ветер, а не сам минус на термометре.',
    items: [
      'Ветроустойчивая палатка с внешними дугами (геодезическая)',
      'Спальник с гидрофобным пухом на -10°C и коврик R-Value 4+',
      'Гермомешки для всей электроники и запасной одежды',
      'Налобный фонарь (зимой) или маска для сна (в полярный день)',
    ],
  },
  {
    id: 'taiga',
    type: 'forest',
    badge: '🌲 Тайга и озёра',
    badgeBg: 'bg-forest-600/90',
    title: 'Байкал, Алтай и Япония',
    temp: '+5°C … +24°C',
    shortDesc: 'Густые кедровые леса, броды горных рек, ночёвки у чистых озёр и дикая фауна.',
    season: 'Сезон: Май — Октябрь',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    desc: 'Сибирская тайга и кедровые тропы Японии дарят тень и мягкую тропу, но требуют внимания к влажности и фауне.',
    items: [
      'Репелленты и противоклещевая обработка одежды',
      'Фальшфейер или перцовый спрей в медвежьих регионах',
      'Лёгкий тент над лагерем на случай затяжного дождя',
      'Фильтр для воды или таблетки для обеззараживания',
    ],
  },
];

const MONTHS = [
  { short: 'Янв', name: 'Январь', best: 'Патагония (Южная Америка), Новая Зеландия, Зимний Байкал', warn: 'В Европе и Гималаях разгар зимы и снежных заносов.' },
  { short: 'Фев', name: 'Февраль', best: 'Лёд Байкала, Патагония O-Trek, Северное сияние в Исландии', warn: 'Сильные морозы в горах Северного полушария.' },
  { short: 'Мар', name: 'Март', best: 'Марокко (Атласские горы), Начало цветения в Японии', warn: 'В Альпах и на Кавказе высокая лавинная опасность.' },
  { short: 'Апр', name: 'Апрель', best: 'Сакура в Японии, Непал (весенний сезон), Озеро Байкал', warn: 'В горах Европы лавиноопасный период.' },
  { short: 'Май', name: 'Май', best: 'Тропа Кумано-Кодо в Японии, Марокко, Каппадокия', warn: 'На Алтае и в Доломитах межсезонье и грязь на тропах.' },
  { short: 'Июн', name: 'Июнь', best: 'Лофотены (полярный день), Исландия (открытие F-дорог), Алтай', warn: 'В высокогорье Альп ещё может лежать снег на перевалах.' },
  { short: 'Июл', name: 'Июль', best: 'Исландия (нагорье), Доломитовые Альпы, Норвегия, Камчатка', warn: 'Высокий сезон — бронируйте горные приюты заранее.' },
  { short: 'Авг', name: 'Август', best: 'Камчатка, Доломитовые Альпы, Исландия, Норвегия', warn: 'В Патагонии глубокая зима и сильные метели.' },
  { short: 'Сен', name: 'Сентябрь', best: 'Золотая осень на Камчатке и в Доломитах, Байкал, Аляска', warn: 'В Исландии возможны первые осенние шторма.' },
  { short: 'Окт', name: 'Октябрь', best: 'Непал (Аннапурна и Эверест), Золотая осень в Японии', warn: 'В Скандинавии холодно и закрывается часть кемпингов.' },
  { short: 'Ноя', name: 'Ноябрь', best: 'Красная листва в Японии (момидзи), Непал (ясное небо)', warn: 'Горные приюты в Альпах закрываются на зиму.' },
  { short: 'Дек', name: 'Декабрь', best: 'Старт сезона в Патагонии, Пустыни Омана и Иордании', warn: 'Короткий световой день в Скандинавии.' },
];

const activeBiomeTab = ref('all');
const selectedBiome = ref(null);
const activeMonthIdx = ref(5);

const filteredBiomes = computed(() =>
  activeBiomeTab.value === 'all' ? BIOMES : BIOMES.filter(b => b.type === activeBiomeTab.value)
);

const gearItems = ref([
  { name: 'Штормовая палатка 2P', weight: 1.45, checked: true },
  { name: 'Пуховый спальник -10°C', weight: 0.98, checked: true },
  { name: 'Надувной коврик R-4.5', weight: 0.48, checked: true },
  { name: 'Мембранная куртка Gore-Tex', weight: 0.36, checked: true },
  { name: 'Горелка + баллон 230г', weight: 0.45, checked: false },
  { name: 'Спутниковый трекер inReach', weight: 0.12, checked: true },
  { name: 'Треккинговые палки (карбон)', weight: 0.39, checked: false },
  { name: 'Аптечка + спасодеяло', weight: 0.25, checked: true },
  { name: 'Камера + объектив 24-70', weight: 1.35, checked: false },
  { name: 'Пауэрбанк 20 000 mAh', weight: 0.38, checked: true },
]);

const customName = ref('');
const customWeight = ref(null);

const totalWeight = computed(() =>
  gearItems.value.reduce((sum, item) => (item.checked ? sum + item.weight : sum), 0)
);

const weightStatus = computed(() => {
  if (totalWeight.value <= 5) return { label: 'Ультралайт (идеально)', color: 'text-emerald-600 dark:text-emerald-400' };
  if (totalWeight.value <= 9) return { label: 'Оптимальный треккинг', color: 'text-brand-600 dark:text-brand-400' };
  return { label: 'Тяжёлый экспедиционный', color: 'text-sunset-600 dark:text-sunset-400' };
});

function applyPackPreset(preset) {
  if (preset === 'clear') {
    gearItems.value.forEach(i => { i.checked = false; });
  } else if (preset === 'ultralight') {
    gearItems.value.forEach((i, idx) => { i.checked = [0, 1, 2, 3, 5, 7].includes(idx); });
  } else {
    gearItems.value.forEach(i => { i.checked = true; });
  }
}

function addCustomGear() {
  if (!customName.value || !customWeight.value || customWeight.value <= 0) return;
  gearItems.value.push({ name: customName.value, weight: Number(customWeight.value), checked: true });
  if (window.showToast) {
    window.showToast('Добавлено в рюкзак', `${customName.value} (+${Number(customWeight.value).toFixed(2)} кг)`, 'success');
  }
  customName.value = '';
  customWeight.value = null;
}
</script>
