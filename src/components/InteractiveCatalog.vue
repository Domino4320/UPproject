<template>
  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <section class="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-forest-900 via-brand-900 to-slate-900 text-white shadow-xl">
      <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-400/20 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-sunset-500/15 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div class="lg:col-span-7 space-y-3">
          <div class="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">
            <span class="w-5 h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-sunset-400"></span>
            <span>TerraNova Outpost</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Экипировка, проверенная штормами и перевалами
          </h1>
          <p class="text-sm text-emerald-100/80 max-w-xl leading-relaxed">
            Подбирайте снаряжение по бюджету в BYN или выберите готовый комплект под конкретную экспедицию одним кликом.
          </p>
        </div>

        <div class="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-3">
          <div class="text-[11px] font-bold uppercase tracking-wider text-emerald-200">Быстрые подборки под маршрут</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="kit in quickKits"
              :key="kit.key"
              type="button"
              @click="applyQuickKit(kit)"
              :class="[
                'px-3 py-1.5 rounded-xl text-xs font-bold transition',
                activeKit === kit.key
                  ? 'bg-sunset-500 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              ]"
            >
              {{ kit.label }}
            </button>
            <button
              v-if="activeKit"
              type="button"
              @click="resetFilters"
              class="px-3 py-1.5 rounded-xl text-xs font-bold bg-black/25 hover:bg-black/40 text-emerald-200 transition"
            >
              Сбросить ✕
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="bento-card p-4 sm:p-5 space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="toggleSingleCategory('all')"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-bold transition',
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-md shadow-brand-600/20'
              : 'bg-emerald-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-slate-700'
          ]"
        >
          🌍 Все ({{ PRODUCTS.length }})
        </button>
        <button
          v-for="cat in categoryOptions"
          :key="cat.key"
          type="button"
          @click="toggleSingleCategory(cat.key)"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-bold transition',
            selectedCategory === cat.key
              ? 'bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-md shadow-brand-600/20'
              : 'bg-emerald-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-slate-700'
          ]"
        >
          {{ cat.icon }} {{ cat.short }}
        </button>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div class="md:col-span-4 relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
          <input v-model.trim="searchQuery" type="text" placeholder="Поиск палаток, спальников, туров..." class="ds-input pl-9 py-2 text-xs bg-slate-50 dark:bg-slate-800">
        </div>

        <div class="md:col-span-4 flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80">
          <span class="text-[11px] font-bold text-slate-500 whitespace-nowrap">До {{ formatPrice(maxPrice) }}</span>
          <input v-model.number="maxPrice" type="range" min="100" max="8500" step="50" class="w-full accent-brand-600 cursor-pointer">
        </div>

        <div class="md:col-span-4 flex flex-wrap md:flex-nowrap items-center justify-end gap-2">
          <button
            v-for="feat in featureOptions"
            :key="feat.key"
            type="button"
            @click="toggleFeature(feat.key)"
            :class="[
              'px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition whitespace-nowrap',
              selectedFeatures.includes(feat.key)
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-500'
            ]"
          >
            {{ feat.short }}
          </button>

          <select v-model="sortBy" class="ds-input py-1.5 px-2.5 text-xs w-auto font-semibold cursor-pointer bg-slate-50 dark:bg-slate-800">
            <option value="featured">Популярные</option>
            <option value="price-asc">Дешевле</option>
            <option value="price-desc">Дороже</option>
            <option value="rating">Рейтинг ★</option>
          </select>
        </div>
      </div>
    </section>

    <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
      <span>
        {{ filteredProducts.length ? `Показано ${paginatedProducts.length} из ${filteredProducts.length} предложений` : '0 предложений' }}
      </span>
      <span class="font-semibold">Страница {{ currentPage }} из {{ totalPages }}</span>
    </div>

    <div v-if="filteredProducts.length === 0" class="text-center py-16 px-6 rounded-3xl bento-card space-y-4">
      <div class="text-4xl">🧭</div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white">Ничего не найдено</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        По выбранным фильтрам и бюджету товаров не нашлось. Попробуйте расширить бюджет или сбросить фильтры.
      </p>
      <button type="button" @click="resetFilters" class="ds-btn ds-btn-md ds-btn-primary">Сбросить фильтры</button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="item in paginatedProducts"
        :key="item.id"
        :class="[
          'group bento-card p-4 flex flex-col justify-between hover:-translate-y-1.5',
          item.isTour ? 'ring-2 ring-sunset-500/80' : ''
        ]"
      >
        <div>
          <div
            @click="quickViewItem = item"
            class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent"></div>
            <span :class="['absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white shadow-sm', item.badgeColor]">
              {{ item.badge }}
            </span>
            <span class="absolute top-3 right-3 px-2 py-1 rounded-lg text-[11px] font-bold bg-black/55 text-white backdrop-blur-sm">
              ★ {{ item.rating }}
            </span>
            <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-black/55 text-white backdrop-blur-sm">
              {{ item.spec }}
            </span>
          </div>

          <div class="pt-4 space-y-2">
            <div class="text-xs font-semibold" :class="item.isTour ? 'text-sunset-500' : 'text-brand-600 dark:text-brand-400'">
              {{ item.categoryLabel }}
            </div>
            <h3
              @click="quickViewItem = item"
              class="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer leading-snug"
            >
              {{ item.title }}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span class="text-[10px] uppercase tracking-wider text-slate-400 block">{{ item.isTour ? 'Участие в группе' : 'Клубная цена' }}</span>
            <span class="text-xl font-black text-slate-900 dark:text-white">{{ formatPrice(item.price) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="quickViewItem = item"
              class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 transition text-xs font-bold"
              title="Подробнее"
            >
              👁
            </button>
            <a v-if="item.isTour" href="./multistep.html" class="ds-btn ds-btn-sm ds-btn-sunset font-bold">
              Забронировать
            </a>
            <button
              v-else
              type="button"
              @click="addToCart(item)"
              class="ds-btn ds-btn-sm ds-btn-primary"
            >
              {{ addedId === item.id ? '✓ В корзине' : 'В корзину' }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-if="filteredProducts.length > 0" class="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <button
        type="button"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
        class="ds-btn ds-btn-sm ds-btn-secondary disabled:opacity-50"
      >
        ← Предыдущая
      </button>
      <div class="flex items-center gap-1.5 text-xs font-bold">
        <button
          v-for="p in totalPages"
          :key="p"
          type="button"
          @click="goToPage(p)"
          :class="[
            'w-9 h-9 rounded-xl flex items-center justify-center transition',
            p === currentPage
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          ]"
        >
          {{ p }}
        </button>
      </div>
      <button
        type="button"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
        class="ds-btn ds-btn-sm ds-btn-secondary disabled:opacity-50"
      >
        Следующая →
      </button>
    </div>

    <Transition name="v-fade-slide">
      <div v-if="quickViewItem" @click.self="quickViewItem = null" class="ds-modal-backdrop">
        <div class="ds-modal-content max-w-xl overflow-hidden">
          <div class="relative h-56 overflow-hidden">
            <img :src="quickViewItem.image" :alt="quickViewItem.title" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
            <button type="button" @click="quickViewItem = null" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition">✕</button>
            <div class="absolute bottom-4 left-5 right-5 text-white">
              <div class="text-xs font-bold text-brand-300">{{ quickViewItem.categoryLabel }} • ★ {{ quickViewItem.rating }}</div>
              <h3 class="text-xl font-extrabold mt-0.5">{{ quickViewItem.title }}</h3>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ quickViewItem.desc }}</p>
            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div class="text-xs text-slate-400">Цена</div>
                <div class="text-2xl font-black text-slate-900 dark:text-white">{{ formatPrice(quickViewItem.price) }}</div>
              </div>
              <a v-if="quickViewItem.isTour" href="./multistep.html" class="ds-btn ds-btn-md ds-btn-sunset">Забронировать →</a>
              <button v-else type="button" @click="addToCart(quickViewItem); quickViewItem = null" class="ds-btn ds-btn-md ds-btn-primary">
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="v-fade-slide">
      <div v-if="cartOpen" class="fixed inset-0 z-50 flex justify-end">
        <div @click="cartOpen = false" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"></div>
        <div class="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800">
          <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">Ваша корзина</h3>
              <p class="text-xs text-slate-400">{{ totalCartQty }} поз. в рюкзаке заказа</p>
            </div>
            <button type="button" @click="cartOpen = false" class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
          </div>

          <div class="flex-1 overflow-y-auto p-5 space-y-3">
            <div v-if="cartItems.length === 0" class="text-center py-12 text-sm text-slate-400">
              Корзина пуста. Добавьте снаряжение из каталога!
            </div>
            <div
              v-for="entry in cartItems"
              :key="entry.id"
              class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60"
            >
              <img :src="entry.image" :alt="entry.title" class="w-14 h-14 rounded-xl object-cover shrink-0">
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ entry.title }}</div>
                <div class="text-xs font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">{{ formatPrice(entry.price * entry.qty) }}</div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button type="button" @click="changeQty(entry.id, -1)" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">-</button>
                <span class="w-5 text-center text-xs font-bold">{{ entry.qty }}</span>
                <button type="button" @click="changeQty(entry.id, 1)" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">+</button>
              </div>
            </div>
          </div>

          <div class="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/70 dark:bg-slate-900">
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">Итого:</span>
              <span class="text-xl font-black text-slate-900 dark:text-white">{{ formatPrice(cartTotalSum) }}</span>
            </div>
            <a href="./multistep.html" class="w-full ds-btn ds-btn-md ds-btn-sunset text-center">Оформить заказ →</a>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const PRODUCTS = [
  { id: 1, title: 'Штормовая палатка TerraNova StormShield 2P', category: 'tents', categoryLabel: 'Палатки & Тенты', price: 1450, rating: 4.98, badge: 'Тест в Исландии', badgeColor: 'bg-brand-600', spec: '1.45 кг', desc: 'Двухместная палатка с дугами из авиационного дюраля DAC, ветроустойчивость до 30 м/с и водяной столб 5 000 мм.', image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80', features: ['ultralight', 'proDiscount'], isTour: false },
  { id: 2, title: 'Экспедиционный рюкзак Arctic Pro 65L', category: 'backpacks', categoryLabel: 'Рюкзаки', price: 950, rating: 4.95, badge: 'Топ продаж', badgeColor: 'bg-sunset-500', spec: '65 + 10 L', desc: 'Анатомический каркас, продуманное распределение веса, съёмный клапан и влагозащитный чехол в комплекте.', image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80', features: ['proDiscount'], isTour: false },
  { id: 4, title: 'Пуховый кокон Glacier Down -15', category: 'sleeping', categoryLabel: 'Спальники', price: 1200, rating: 4.96, badge: 'Комфорт -15°C', badgeColor: 'bg-teal-600', spec: 'Пух 850 FP', desc: 'Вес всего 980 г, гидрофобная пропитка пуха Nikwax, компрессионный мешок с защитой от дождя.', image: 'https://images.unsplash.com/photo-1558477280-1bfed08ea5db?auto=format&fit=crop&w=600&q=80', features: ['ultralight', 'proDiscount'], isTour: false },
  { id: 5, title: 'Карбоновые палки Trail Ultra-Lite', category: 'backpacks', categoryLabel: 'Палки & Опоры', price: 410, rating: 4.93, badge: '100% Карбон', badgeColor: 'bg-brand-600', spec: '390 г пара', desc: 'Замки FlickLock Pro, пробковая рукоятка против потения рук и сменные кольца для снега и курумника.', image: 'https://images.unsplash.com/photo-1776006534692-2c35e298732a?auto=format&fit=crop&w=600&q=80', features: ['ultralight'], isTour: false },
  { id: 6, title: 'Зимняя Исландия: Охота за Авророй & Ледники', category: 'tours', categoryLabel: 'Авторская экспедиция', price: 5400, rating: 5.0, badge: 'Осталось 3 места', badgeColor: 'bg-sunset-500', spec: '12 дней • Декабрь', desc: 'Всё включено: подготовленный Super-Jeep 4x4, проживание в горных лоджах, гид и мастер-классы по фотосъемке.', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80', features: ['proDiscount'], isTour: true },
  { id: 7, title: 'Штормовая куртка Alpine Shell GTX Pro', category: 'apparel', categoryLabel: 'Мембраны & Термобелье', price: 1480, rating: 4.97, badge: '28 000 мм', badgeColor: 'bg-cyan-600', spec: 'Gore-Tex Pro 3L', desc: 'Трёхслойная мембрана для альпинизма и штормового ветра, проклеенные швы и вентиляция под мышками.', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', features: ['goretex', 'proDiscount'], isTour: false },
  { id: 8, title: 'Ультралегкая палатка Ridge Carbon 1P', category: 'tents', categoryLabel: 'Палатки & Тенты', price: 1150, rating: 4.89, badge: 'Ultralight', badgeColor: 'bg-emerald-600', spec: '790 г', desc: 'Одноместное укрытие из силиконизированного нейлона 15D для соло-маршрутов и быстрого треккинга.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', features: ['ultralight'], isTour: false },
  { id: 9, title: 'Надувной коврик ThermoAir R-5.4', category: 'sleeping', categoryLabel: 'Спальники & Коврики', price: 520, rating: 4.92, badge: 'Зима до -20°C', badgeColor: 'bg-teal-600', spec: '480 г • R 5.4', desc: 'Трёхкамерный теплоотражающий коврик с насосом-мешком в комплекте. Компактно складывается в бутылку 0.7 л.', image: 'https://images.unsplash.com/photo-1698731048404-1c12d7189e48?auto=format&fit=crop&w=600&q=80', features: ['ultralight', 'proDiscount'], isTour: false },
  { id: 10, title: 'Камчатка: Вулканы и Тихий океан', category: 'tours', categoryLabel: 'Авторская экспедиция', price: 6100, rating: 4.99, badge: 'Хит лета', badgeColor: 'bg-sunset-500', spec: '11 дней • Август', desc: 'Восхождение на Толбачик и Мутновский, выход в океан к косаткам, вахтовка 6x6 и горячие источники.', image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=600&q=80', features: ['proDiscount'], isTour: true },
  { id: 11, title: 'Мультиспортивные часы Fenix Solar Pro', category: 'navigation', categoryLabel: 'Навигация', price: 2290, rating: 4.96, badge: 'Офлайн-карты', badgeColor: 'bg-brand-600', spec: 'До 38 дней GPS', desc: 'Сапфировое стекло с солнечной батареей, топографические карты всего мира, барометр и штормовые предупреждения.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', features: [], isTour: false },
  { id: 12, title: 'Штормовой рюкзак Alpine Summit 45L', category: 'backpacks', categoryLabel: 'Рюкзаки', price: 730, rating: 4.91, badge: 'Водостойкий', badgeColor: 'bg-indigo-600', spec: '45 L • 920 г', desc: 'Лёгкий и прочный рюкзак из ткани Dyneema Ripstop с креплениями для ледоруба и сноуборда.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', features: ['ultralight'], isTour: false },
  { id: 13, title: 'Треккинг в Доломитовых Альпах (Италия)', category: 'tours', categoryLabel: 'Авторская экспедиция', price: 3900, rating: 4.98, badge: 'Комфорт-трек', badgeColor: 'bg-sunset-500', spec: '8 дней • Сентябрь', desc: 'Панорамные тропы вокруг Тре Чиме, ночёвки в альпийских рифуджио и дегустация тирольской кухни.', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80', features: ['proDiscount'], isTour: true },
  { id: 14, title: 'Термобельё Merino Wool 240 г/м²', category: 'apparel', categoryLabel: 'Мембраны & Термобелье', price: 320, rating: 4.94, badge: '100% Меринос', badgeColor: 'bg-forest-600', spec: 'Тепло даже влажным', desc: 'Натуральная шерсть мериноса без запаха в многодневных походах, плоские швы и анатомический крой.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', features: ['proDiscount'], isTour: false },
  { id: 15, title: 'Мембранные брюки StormPant GTX', category: 'apparel', categoryLabel: 'Мембраны & Термобелье', price: 880, rating: 4.9, badge: 'Самосбросы', badgeColor: 'bg-cyan-600', spec: 'Gore-Tex Pro', desc: 'Боковые молнии во всю длину позволяют надеть брюки поверх треккинговых ботинок и кошек за 30 секунд.', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80', features: ['goretex', 'ultralight'], isTour: false },
];

const quickKits = [
  { key: 'arctic', label: '❄️ Набор для Исландии', cat: 'all', features: ['goretex'], maxPrice: 8500 },
  { key: 'ultra', label: '🪶 Ультралайт-трек', cat: 'all', features: ['ultralight'], maxPrice: 1500 },
  { key: 'tours', label: '🏔️ Только экспедиции', cat: 'tours', features: [], maxPrice: 8500 },
];

const categoryOptions = [
  { key: 'tents', icon: '⛺', short: 'Палатки' },
  { key: 'backpacks', icon: '🎒', short: 'Рюкзаки' },
  { key: 'sleeping', icon: '🛌', short: 'Спальники' },
  { key: 'apparel', icon: '🧥', short: 'Мембраны' },
  { key: 'navigation', icon: '🧭', short: 'Навигация' },
  { key: 'tours', icon: '🏔️', short: 'Туры' },
];

const featureOptions = [
  { key: 'ultralight', short: 'Ultralight' },
  { key: 'goretex', short: 'Gore-Tex Pro' },
  { key: 'proDiscount', short: 'PRO -15%' },
];

const ITEMS_PER_PAGE = 6;
const searchQuery = ref('');
const selectedCategory = ref('all');
const maxPrice = ref(8500);
const selectedFeatures = ref([]);
const sortBy = ref('featured');
const currentPage = ref(1);
const activeKit = ref('');
const quickViewItem = ref(null);
const addedId = ref(null);
const cartOpen = ref(false);

const cartItems = ref([
  { id: 1, title: PRODUCTS[0].title, price: PRODUCTS[0].price, image: PRODUCTS[0].image, qty: 1 },
  { id: 5, title: PRODUCTS[4].title, price: PRODUCTS[4].price, image: PRODUCTS[4].image, qty: 1 },
]);

const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase();
  let list = PRODUCTS.filter(p => {
    if (selectedCategory.value !== 'all' && p.category !== selectedCategory.value) return false;
    if (p.price > maxPrice.value) return false;
    if (q && !`${p.title} ${p.desc} ${p.categoryLabel}`.toLowerCase().includes(q)) return false;
    for (const f of selectedFeatures.value) {
      if (!p.features.includes(f)) return false;
    }
    return true;
  });

  if (sortBy.value === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
  else if (sortBy.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
  else if (sortBy.value === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE)));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return filteredProducts.value.slice(start, start + ITEMS_PER_PAGE);
});

const totalCartQty = computed(() => cartItems.value.reduce((s, i) => s + i.qty, 0));
const cartTotalSum = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.qty, 0));

watch([searchQuery, selectedCategory, maxPrice, selectedFeatures, sortBy], () => {
  currentPage.value = 1;
}, { deep: true });

watch(totalCartQty, (val) => {
  window.dispatchEvent(new CustomEvent('tn-cart-updated', { detail: { count: val } }));
}, { immediate: true });

function formatPrice(val) {
  return `${Number(val).toLocaleString('ru-RU')} BYN`;
}

function toggleSingleCategory(key) {
  activeKit.value = '';
  selectedCategory.value = key;
}

function toggleFeature(key) {
  activeKit.value = '';
  if (selectedFeatures.value.includes(key)) {
    selectedFeatures.value = selectedFeatures.value.filter(k => k !== key);
  } else {
    selectedFeatures.value = [...selectedFeatures.value, key];
  }
}

function applyQuickKit(kit) {
  activeKit.value = kit.key;
  selectedCategory.value = kit.cat;
  selectedFeatures.value = [...kit.features];
  maxPrice.value = kit.maxPrice;
  currentPage.value = 1;
}

function resetFilters() {
  activeKit.value = '';
  searchQuery.value = '';
  selectedCategory.value = 'all';
  maxPrice.value = 8500;
  selectedFeatures.value = [];
  sortBy.value = 'featured';
  currentPage.value = 1;
}

function goToPage(p) {
  if (p < 1 || p > totalPages.value) return;
  currentPage.value = p;
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function addToCart(item) {
  const existing = cartItems.value.find(c => c.id === item.id);
  if (existing) existing.qty += 1;
  else cartItems.value.push({ id: item.id, title: item.title, price: item.price, image: item.image, qty: 1 });

  addedId.value = item.id;
  setTimeout(() => {
    if (addedId.value === item.id) addedId.value = null;
  }, 1100);
}

function changeQty(id, delta) {
  const entry = cartItems.value.find(c => c.id === id);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) {
    cartItems.value = cartItems.value.filter(c => c.id !== id);
  }
}

function onOpenCart() {
  cartOpen.value = true;
}

onMounted(() => {
  window.addEventListener('tn-open-cart', onOpenCart);
});

onUnmounted(() => {
  window.removeEventListener('tn-open-cart', onOpenCart);
});
</script>
