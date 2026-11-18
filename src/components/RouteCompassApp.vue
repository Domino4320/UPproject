<template>
  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">

    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-2 max-w-2xl">
        <span class="ds-kicker">Интерактивный конструктор</span>
        <h1 class="ds-h1 text-3xl sm:text-4xl">Компас маршрута & Симулятор дня</h1>
        <p class="ds-body text-sm sm:text-base">
          Выберите стихию, формат передвижения и уровень вызова — или крутите рулетку судьбы, чтобы открыть свою следующую экспедицию и прожить в ней 24 часа.
        </p>
      </div>

      <button
        type="button"
        @click="spinDestiny"
        class="ds-btn ds-btn-lg ds-btn-sunset shadow-xl shadow-sunset-500/25 shrink-0 group"
      >
        <svg
          class="w-5 h-5 transition-transform duration-700"
          :style="{ transform: `rotate(${spinAngle}deg)` }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>Случайный маршрут судьбы</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <section class="lg:col-span-5 space-y-6 bento-card p-6 sm:p-7">

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold uppercase tracking-wider text-slate-400">1. Выберите стихию</span>
            <span class="text-xs font-bold text-brand-600 dark:text-brand-400">{{ currentRoute.elementLabel }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5">
            <button
              v-for="el in elements"
              :key="el.key"
              type="button"
              @click="selectElement(el.key)"
              :class="[
                'p-3.5 rounded-2xl border-2 text-left transition-all',
                selectedElement === el.key
                  ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 shadow-sm'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-brand-400'
              ]"
            >
              <div class="text-2xl mb-1">{{ el.icon }}</div>
              <div class="text-xs font-bold text-slate-900 dark:text-white">{{ el.title }}</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ el.sub }}</div>
            </button>
          </div>
        </div>

        <div class="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span class="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">2. Формат передвижения</span>
          <div class="grid grid-cols-2 gap-2.5">
            <button
              v-for="fmt in formats"
              :key="fmt.key"
              type="button"
              @click="selectFormat(fmt.key)"
              :class="[
                'px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2',
                selectedFormat === fmt.key
                  ? 'border-brand-500 bg-brand-600 text-white shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-400'
              ]"
            >
              <span>{{ fmt.icon }}</span>
              <span>{{ fmt.label }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span class="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">3. Уровень вызова</span>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="lvl in levels"
              :key="lvl.key"
              type="button"
              @click="selectLevel(lvl.key)"
              :class="[
                'py-2 px-2 rounded-xl border text-xs font-bold transition',
                selectedLevel === lvl.key
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-400'
              ]"
            >
              {{ lvl.label }}
            </button>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <span class="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Готовые комбинации</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="r in routeList"
              :key="r.id"
              type="button"
              @click="applyPreset(r)"
              :class="[
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition',
                currentRoute.id === r.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white'
              ]"
            >
              {{ r.chip }}
            </button>
          </div>
        </div>
      </section>

      <section class="lg:col-span-7">
        <Transition name="v-fade-slide" mode="out-in">
          <div :key="currentRoute.id" class="bento-card overflow-hidden">
            <div class="relative h-60 sm:h-72 overflow-hidden">
              <img :src="currentRoute.image" :alt="currentRoute.title" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"></div>
              <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                <span class="px-3 py-1 rounded-xl text-xs font-bold bg-black/50 backdrop-blur-md text-white">
                  {{ currentRoute.region }}
                </span>
                <span class="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-brand-600/90 text-white">
                  {{ currentRoute.coords }}
                </span>
              </div>
              <div class="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <h2 class="text-2xl sm:text-3xl font-black leading-tight">{{ currentRoute.title }}</h2>
                <p class="text-xs sm:text-sm text-slate-200">{{ currentRoute.tagline }}</p>
              </div>
            </div>

            <div class="p-6 sm:p-7 space-y-6">

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">Длительность</div>
                  <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{{ currentRoute.days }}</div>
                </div>
                <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">Лучший сезон</div>
                  <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{{ currentRoute.season }}</div>
                </div>
                <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">Макс. высота</div>
                  <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{{ currentRoute.alt }}</div>
                </div>
                <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">Бюджет</div>
                  <div class="text-sm font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">{{ currentRoute.budget }}</div>
                </div>
              </div>

              <div class="space-y-2.5">
                <div class="flex items-center justify-between text-xs gap-2">
                  <span class="font-bold uppercase tracking-wider text-slate-400">Профиль высоты и стоянок</span>
                  <span class="font-semibold text-brand-600 dark:text-brand-400 text-right">
                    {{ activeCheckpoint.name }}: {{ activeCheckpoint.detail }}
                  </span>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <svg viewBox="0 0 600 110" class="w-full h-24 overflow-visible">
                    <defs>
                      <linearGradient id="vueElevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.38" />
                        <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path :d="svgPaths.area" fill="url(#vueElevGrad)" />
                    <path :d="svgPaths.line" fill="none" stroke="#0d9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    <circle
                      v-for="(pt, idx) in svgPaths.markers"
                      :key="idx"
                      :cx="pt[0]"
                      :cy="pt[1]"
                      r="5.5"
                      :fill="activeCpIdx === idx ? '#14b8a6' : '#f97316'"
                      stroke="#ffffff"
                      stroke-width="2"
                      class="cursor-pointer transition-all"
                      @click="activeCpIdx = idx"
                    />
                  </svg>
                  <div class="flex flex-wrap gap-2 mt-3">
                    <button
                      v-for="(cp, idx) in currentRoute.checkpoints"
                      :key="cp.name"
                      type="button"
                      @click="activeCpIdx = idx"
                      :class="[
                        'px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition',
                        activeCpIdx === idx
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-brand-500'
                      ]"
                    >
                      {{ idx + 1 }}. {{ cp.name }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Симулятор 24 часов в лагере</span>
                  <span class="text-xs font-mono font-bold text-sunset-600 dark:text-sunset-400">{{ currentScene.temp }}</span>
                </div>

                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="slot in simSlots"
                    :key="slot.key"
                    type="button"
                    @click="currentSimTime = slot.key"
                    :class="[
                      'py-2 px-2 rounded-xl text-xs font-bold transition',
                      currentSimTime === slot.key
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    ]"
                  >
                    {{ slot.label }}
                  </button>
                </div>

                <Transition name="v-fade-slide" mode="out-in">
                  <div
                    :key="currentSimTime"
                    :class="['p-5 rounded-2xl bg-gradient-to-br border space-y-1.5', currentScene.bg]"
                  >
                    <div class="font-bold text-sm text-slate-900 dark:text-white">{{ currentScene.title }}</div>
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ currentScene.desc }}</p>
                  </div>
                </Transition>
              </div>

              <div class="space-y-2.5">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block">Что вы переживёте на маршруте</span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    v-for="h in currentRoute.highlights"
                    :key="h"
                    class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {{ h }}
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <a href="./ecommerce.html" class="ds-btn ds-btn-md ds-btn-secondary">Подобрать экипировку</a>
                <a href="./multistep.html" class="ds-btn ds-btn-md ds-btn-primary">Забронировать экспедицию →</a>
              </div>
            </div>
          </div>
        </Transition>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';

const elements = [
  { key: 'arctic', icon: '❄️', title: 'Ледники и фьорды', sub: 'Арктика & Север' },
  { key: 'volcano', icon: '🌋', title: 'Вулканы и огонь', sub: 'Кратеры & Лава' },
  { key: 'alpine', icon: '🏔️', title: 'Альпийские пики', sub: 'Перевалы & Хребты' },
  { key: 'forest', icon: '🌲', title: 'Древние леса', sub: 'Тайга & Тропы' },
];

const formats = [
  { key: '4x4', icon: '🚙', label: 'Экспедиция 4x4' },
  { key: 'trek', icon: '🥾', label: 'Автономный трек' },
  { key: 'camper', icon: '🚐', label: 'Кемпер-роудтрип' },
  { key: 'photo', icon: '📷', label: 'Фото-охота' },
];

const levels = [
  { key: 'comfort', label: 'Комфорт' },
  { key: 'balance', label: 'Баланс' },
  { key: 'hardcore', label: 'Хардкор' },
];

const simSlots = [
  { key: 'morning', label: '🌅 06:00' },
  { key: 'noon', label: '☀️ 13:00' },
  { key: 'sunset', label: '🌇 20:00' },
  { key: 'night', label: '🌌 00:00' },
];

const ROUTES = {
  iceland: {
    id: 'iceland',
    chip: '❄️ Исландия F208',
    element: 'arctic',
    elementLabel: 'Ледники и фьорды',
    format: '4x4',
    level: 'balance',
    region: 'Исландия • Нагорье',
    coords: '64.048° N, 16.179° W',
    title: 'Исландия: F-дороги и ледник Ватнайёкюдль',
    tagline: 'Броды горных рек на 4x4, цветные риолитовые горы и ночёвка у ледяной лагуны.',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1000&q=80',
    days: '12 дней • 2 100 км',
    season: 'Июнь — Сентябрь',
    alt: '1 150 м',
    budget: 'от 4 800 BYN',
    profile: [120, 480, 820, 1150, 640, 210, 50],
    checkpoints: [
      { name: 'Рейкьявик', detail: 'Старт и приёмка 4x4 Defender' },
      { name: 'Ландманналаугар', detail: 'Цветные горы и горячие ручьи' },
      { name: 'Перевал F208', detail: 'Глубокие броды и чёрные пустоши' },
      { name: 'Ватнайёкюдль', detail: 'Ледяные пещеры и лагуна айсбергов' },
    ],
    highlights: ['🚙 Броды до 40 см на 4x4', '♨️ Дикие горячие источники', '🧊 Айсберги у океана'],
    sim: {
      morning: { temp: '+4°C • Ясно', title: '06:00 — Пар над геотермальной рекой', desc: 'Вы вылезаете из палатки в тишине цветных гор Ландманналаугара. Впереди 20 минут горячего купания под открытым небом и крепкий кофе на горелке.', bg: 'from-amber-500/15 via-orange-500/10 to-brand-500/10 border-amber-500/25' },
      noon: { temp: '+9°C • Порывистый ветер', title: '13:00 — Форсирование брода F208', desc: 'Включаете пониженную передачу: ледниковая река шумит у порогов внедорожника. За поворотом открывается марсианская долина чёрного вулканического песка.', bg: 'from-sky-500/15 via-brand-500/10 to-teal-500/10 border-sky-500/25' },
      sunset: { temp: '+3°C • Золотой час', title: '20:00 — Лагуна Йёкюльсаурлоун', desc: 'Голубые глыбы льда медленно дрейфуют в океан под косыми лучами северного солнца. Идеальный свет для съёмки на чёрном пляже Бриллиантов.', bg: 'from-sunset-500/20 via-rose-500/10 to-indigo-500/10 border-sunset-500/25' },
      night: { temp: '-1°C • Звёздное небо', title: '00:00 — Зелёные сполохи Авроры', desc: 'Над ледником вспыхивает северное сияние. Вся группа стоит в тишине у машин с термосами чая и наблюдает за танцем зелёных лент в небе.', bg: 'from-indigo-600/20 via-emerald-500/15 to-slate-900/20 border-emerald-500/30' },
    },
  },
  kamchatka: {
    id: 'kamchatka',
    chip: '🌋 Камчатка',
    element: 'volcano',
    elementLabel: 'Вулканы и огонь',
    format: 'trek',
    level: 'hardcore',
    region: 'Россия • Камчатка',
    coords: '55.831° N, 160.326° E',
    title: 'Камчатка: Кратеры Толбачика и Тихий океан',
    tagline: 'Восхождение на действующие вулканы, Мёртвый лес и ночёвки среди лавовых полей.',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1000&q=80',
    days: '11 дней • 120 км',
    season: 'Июль — Сентябрь',
    alt: '3 085 м',
    budget: 'от 5 400 BYN',
    profile: [10, 350, 950, 1850, 3085, 1400, 20],
    checkpoints: [
      { name: 'Халактырский пляж', detail: 'Чёрный песок и тихоокеанский прибой' },
      { name: 'Мёртвый лес', detail: 'Лавовый пейзаж 1975 года' },
      { name: 'Кратер Толбачика', detail: 'Подъём к кромке на 3 085 м' },
      { name: 'Дачные источники', detail: 'Малая долина гейзеров' },
    ],
    highlights: ['🌋 Тёплая лава под ногами', '🐋 Выход в океан к косаткам', '🐻 Дикие реки с лососем'],
    sim: {
      morning: { temp: '+6°C • Туман в кальдере', title: '06:00 — Выход на штурм кратера', desc: 'Тёмный вулканический шлак хрустит под ботинками. Над горизонтом поднимается солнце, окрашивая конус Ключевской сопки в розовый цвет.', bg: 'from-amber-500/15 via-rose-500/10 to-orange-500/10 border-amber-500/25' },
      noon: { temp: '+12°C • Запах серы', title: '13:00 — На краю гигантского кратера', desc: 'Вы стоите на высоте 3085 м: внизу дымят фумаролы, а вокруг раскинулась бесконечная гряда вулканов Камчатки.', bg: 'from-orange-500/15 via-amber-500/10 to-brand-500/10 border-orange-500/25' },
      sunset: { temp: '+8°C • Мягкий свет', title: '20:00 — Ужин у тёплой трещины лавы', desc: 'После спуска группа греется у остаточного тепла лавовых потоков: воздух здесь на 15 градусов теплее, чем в лагере.', bg: 'from-sunset-500/20 via-red-500/10 to-slate-900/10 border-sunset-500/25' },
      night: { temp: '+2°C • Млечный Путь', title: '00:00 — Звёзды над Тихим океаном', desc: 'Никакой засветки на сотни километров вокруг. Вдалеке слышен гул океанской волны и треск рации базового лагеря.', bg: 'from-indigo-600/20 via-slate-800/20 to-brand-600/15 border-indigo-500/30' },
    },
  },
  patagonia: {
    id: 'patagonia',
    chip: '🏔️ Патагония O-Trek',
    element: 'alpine',
    elementLabel: 'Альпийские пики',
    format: 'trek',
    level: 'hardcore',
    region: 'Чили • Патагония',
    coords: '50.942° S, 73.406° W',
    title: 'Патагония: Кольцо O-Trek Торрес-дель-Пайне',
    tagline: 'Гранитные башни на краю света, перевал Джон Гарднер и Южное ледниковое плато.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    days: '16 дней • 135 км',
    season: 'Ноябрь — Март',
    alt: '1 241 м',
    budget: 'от 7 900 BYN',
    profile: [180, 420, 760, 1241, 690, 450, 210],
    checkpoints: [
      { name: 'Долина Серрон', detail: 'Дикая северная часть кольца' },
      { name: 'Перевал Гарднер', detail: 'Вид на ледник Грей' },
      { name: 'Долина Франсес', detail: 'Ледовые обвалы со скал' },
      { name: 'Башни Торрес', detail: 'Рассвет у гранитных пиков' },
    ],
    highlights: ['🏔️ Гранитные башни Торрес', '💨 Настоящие ветра Патагонии', '🧊 Ледник Грей длиной 28 км'],
    sim: {
      morning: { temp: '+2°C • Алый рассвет', title: '06:00 — Огненные пики Торрес', desc: 'Гранитные иглы загораются ярко-оранжевым светом на фоне ледникового озера. Вы пришли на смотровую раньше первых групп.', bg: 'from-rose-500/15 via-amber-500/15 to-orange-500/10 border-rose-500/25' },
      noon: { temp: '+11°C • Порывы 70 км/ч', title: '13:00 — Перевал Джон Гарднер', desc: 'Ветер сбивает с ног, но вид с перевала на бесконечное белое море Южного ледникового плато заставляет забыть об усталости.', bg: 'from-cyan-500/15 via-brand-500/10 to-sky-500/10 border-cyan-500/25' },
      sunset: { temp: '+6°C • Ветрозащита лагеря', title: '20:00 — Тёплый ужин в приюте', desc: 'Палатки надёжно растянуты среди букового леса. В лагере пахнет супом и горячим мате, а участники делятся кадрами дня.', bg: 'from-sunset-500/15 via-amber-500/10 to-emerald-500/10 border-sunset-500/25' },
      night: { temp: '0°C • Южный Крест', title: '00:00 — Небо Южного полушария', desc: 'Над вами сияют Магеллановы облака и созвездие Южный Крест. Где-то далеко в долине трещит сползающий лёд.', bg: 'from-indigo-600/20 via-brand-700/15 to-slate-900/20 border-indigo-500/30' },
    },
  },
  lofoten: {
    id: 'lofoten',
    chip: '🚐 Лофотены',
    element: 'arctic',
    elementLabel: 'Ледники и фьорды',
    format: 'camper',
    level: 'comfort',
    region: 'Норвегия • Лофотены',
    coords: '67.932° N, 13.088° E',
    title: 'Лофотены: Кемпер на краю фьорда',
    tagline: 'Бирюзовые арктические пляжи, треки на гребни фьордов и незаходящее полярное солнце.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    days: '10 дней • 95 км пешком',
    season: 'Июнь — Август',
    alt: '543 м',
    budget: 'от 3 800 BYN',
    profile: [5, 220, 543, 120, 448, 310, 10],
    checkpoints: [
      { name: 'Свольвер', detail: 'Получение кемпера и паром' },
      { name: 'Пляж Квалвика', detail: 'Ночёвка у бирюзовой бухты' },
      { name: 'Рейнебринген', detail: 'Панорама островов с 448 м' },
      { name: 'Унстад', detail: 'Арктический сёрфинг в гидрокостюмах' },
    ],
    highlights: ['🚐 Кемпер прямо у океана', '☀️ Полярный день 24/7', '⛰️ Гребни над фьордами'],
    sim: {
      morning: { temp: '+10°C • Штиль на фьорде', title: '06:00 — Кофе на пороге кемпера', desc: 'Вы открываете дверь автодома — в пяти метрах плещется прозрачный фьорд, а на скалах парятся утренние облака.', bg: 'from-teal-500/15 via-brand-500/10 to-sky-500/10 border-teal-500/25' },
      noon: { temp: '+15°C • Солнечно', title: '13:00 — Восхождение на Рютен', desc: 'Лёгкий трек без тяжёлых рюкзаков приводит на острый каменный балкон прямо над пляжем Квалвика.', bg: 'from-emerald-500/15 via-brand-500/10 to-cyan-500/10 border-emerald-500/25' },
      sunset: { temp: '+12°C • Бесконечный закат', title: '20:00 — Свежая треска на гриле', desc: 'В Норвегии летом солнце не садится за горизонт. Вы готовите ужин на берегу и обсуждаете завтрашний сёрф-спот.', bg: 'from-sunset-500/20 via-amber-500/15 to-rose-500/10 border-sunset-500/25' },
      night: { temp: '+9°C • Полуночное солнце', title: '00:00 — Ночной трек без фонарика', desc: 'В полночь светло как золотым вечером. На тропе Рейнебринген никого нет — вся панорама Рейне принадлежит только вам.', bg: 'from-amber-500/15 via-indigo-500/15 to-brand-500/10 border-amber-500/25' },
    },
  },
  japan: {
    id: 'japan',
    chip: '🌲 Кумано-Кодо',
    element: 'forest',
    elementLabel: 'Древние леса',
    format: 'photo',
    level: 'comfort',
    region: 'Япония • Полуостров Кии',
    coords: '33.840° N, 135.774° E',
    title: 'Япония: Тропа Кумано-Кодо и онсэны',
    tagline: 'Тысячелетние кедровые леса, рёканы с горячими источниками и утренние храмы в тумане.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    days: '14 дней • 85 км',
    season: 'Март — Май / Октябрь',
    alt: '960 м',
    budget: 'от 5 900 BYN',
    profile: [120, 410, 720, 960, 580, 320, 90],
    checkpoints: [
      { name: 'Киото', detail: 'Бамбуковая роща Арасияма' },
      { name: 'Тропа Накахэти', detail: 'Древний кедровый тракт' },
      { name: 'Юномине Онсэн', detail: 'Горячие источники в горах' },
      { name: 'Коя-сан', detail: 'Ночёвка в буддийском храме' },
    ],
    highlights: ['🌲 Кедры возрастом 800 лет', '♨️ Горячие онсэны после трека', '⛩️ Затерянные горные святилища'],
    sim: {
      morning: { temp: '+13°C • Туман в кедрах', title: '06:00 — Утренний гонг в Коя-сан', desc: 'Туман стелется между мшистыми фонарями древнего леса. Тихий путь по каменным ступеням без единого туриста.', bg: 'from-emerald-500/15 via-teal-500/10 to-slate-500/10 border-emerald-500/25' },
      noon: { temp: '+19°C • Сквозь листву', title: '13:00 — Обед бэнто на перевале', desc: 'Вы делаете привал на деревянной смотровой площадке с видом на зелёные волны гор полуострова Кии.', bg: 'from-brand-500/15 via-emerald-500/10 to-amber-500/10 border-brand-500/25' },
      sunset: { temp: '+14°C • Пар из онсэна', title: '20:00 — Купание в горном онсэне', desc: 'Усталость ног растворяется в минеральной воде под шум горной реки, а затем подают ужин кайсэки в традиционном рёкане.', bg: 'from-sunset-500/15 via-amber-500/15 to-rose-500/10 border-sunset-500/25' },
      night: { temp: '+10°C • Тишина рёкана', title: '00:00 — Сон на татами под шум дождя', desc: 'За раздвижными сёдзи шелестят бамбук и кедры. Завтра новый участок паломнической тропы к океану.', bg: 'from-slate-600/15 via-indigo-500/15 to-emerald-500/10 border-slate-500/25' },
    },
  },
};

const routeList = Object.values(ROUTES);
const selectedElement = ref('arctic');
const selectedFormat = ref('4x4');
const selectedLevel = ref('balance');
const currentRouteId = ref('iceland');
const currentSimTime = ref('morning');
const activeCpIdx = ref(0);
const spinAngle = ref(0);

const currentRoute = computed(() => ROUTES[currentRouteId.value] || ROUTES.iceland);
const activeCheckpoint = computed(() => currentRoute.value.checkpoints[activeCpIdx.value] || currentRoute.value.checkpoints[0]);
const currentScene = computed(() => currentRoute.value.sim[currentSimTime.value] || currentRoute.value.sim.morning);

const svgPaths = computed(() => {
  const pts = currentRoute.value.profile;
  const maxVal = Math.max(...pts, 100);
  const w = 600;
  const h = 95;
  const stepX = w / (pts.length - 1);

  const coords = pts.map((v, i) => [
    Math.round(i * stepX),
    Math.round(h - (v / maxVal) * 75 - 10),
  ]);

  const line = coords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const markers = [coords[0], coords[2], coords[4], coords[6]];

  return { line, area, markers };
});

function pickBestRoute() {
  let best = ROUTES.iceland;
  let bestScore = -1;
  for (const r of routeList) {
    let score = 0;
    if (r.element === selectedElement.value) score += 3;
    if (r.format === selectedFormat.value) score += 2;
    if (r.level === selectedLevel.value) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = r;
    }
  }
  currentRouteId.value = best.id;
  activeCpIdx.value = 0;
}

function selectElement(key) {
  selectedElement.value = key;
  pickBestRoute();
}

function selectFormat(key) {
  selectedFormat.value = key;
  pickBestRoute();
}

function selectLevel(key) {
  selectedLevel.value = key;
  pickBestRoute();
}

function applyPreset(r) {
  selectedElement.value = r.element;
  selectedFormat.value = r.format;
  selectedLevel.value = r.level;
  currentRouteId.value = r.id;
  activeCpIdx.value = 0;
}

function spinDestiny() {
  spinAngle.value += 540;
  const others = routeList.filter(r => r.id !== currentRouteId.value);
  const next = others[Math.floor(Math.random() * others.length)];
  applyPreset(next);
}
</script>
