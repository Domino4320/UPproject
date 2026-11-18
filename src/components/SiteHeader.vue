<template>
  <header
    :class="[
      'sticky top-0 z-50 transition-all duration-300 border-b',
      scrolled
        ? 'bg-white/90 dark:bg-[#0b1512]/90 backdrop-blur-xl border-emerald-900/15 dark:border-emerald-500/20 shadow-sm'
        : 'bg-white/80 dark:bg-[#0b1512]/80 backdrop-blur-md border-emerald-900/10 dark:border-emerald-500/15'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

      <a :href="homeUrl" class="flex items-center space-x-3 group shrink-0">
        <div class="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-600 via-brand-600 to-sunset-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/25 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-forest-800 via-brand-600 to-sunset-600 dark:from-white dark:via-brand-400 dark:to-sunset-400 bg-clip-text text-transparent">
            TerraNova
          </span>
          <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-1 uppercase tracking-widest">
            {{ subtitle }}
          </span>
        </div>
      </a>

      <nav class="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-semibold shrink-0">
        <a
          v-for="item in navItems"
          :key="item.key"
          :href="item.href"
          :class="[
            'nav-link',
            activePage === item.key ? 'nav-link-active' : ''
          ]"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="flex items-center gap-2.5 sm:gap-3 shrink-0">

        <button
          v-if="showCart"
          type="button"
          @click="openCartDrawer"
          class="relative p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition shrink-0"
          aria-label="Корзина"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span
            id="cartCount"
            :class="[
              'absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-sunset-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md transition-transform duration-200',
              cartPulse ? 'scale-125' : 'scale-100'
            ]"
          >
            {{ cartCount }}
          </span>
        </button>

        <button
          type="button"
          @click="toggleTheme"
          class="p-2.5 rounded-xl border border-emerald-900/10 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-emerald-50/50 dark:bg-slate-800/50 hover:bg-emerald-100/60 dark:hover:bg-slate-800 transition shrink-0"
          :aria-label="isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
          :title="isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
        >
          <svg v-if="isDark" class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>

        <a :href="joinUrl" class="hidden sm:inline-flex ds-btn ds-btn-sm ds-btn-sunset whitespace-nowrap">
          Вступить в клуб
        </a>

        <button
          type="button"
          @click="mobileOpen = !mobileOpen"
          class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
          :aria-expanded="mobileOpen ? 'true' : 'false'"
          aria-label="Открыть меню"
        >
          <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <Transition name="v-fade-slide">
      <div
        v-if="mobileOpen"
        class="lg:hidden border-t border-emerald-900/10 dark:border-slate-800 bg-white/95 dark:bg-[#0b1512]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1.5 text-sm font-medium"
      >
        <a
          v-for="item in navItems"
          :key="item.key"
          :href="item.href"
          @click="mobileOpen = false"
          :class="[
            'flex items-center justify-between px-3.5 py-2.5 rounded-xl transition',
            activePage === item.key
              ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold'
              : 'hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100'
          ]"
        >
          <span>{{ item.label }}</span>
          <span class="text-xs text-brand-600 dark:text-brand-400">→</span>
        </a>
        <div class="pt-2 border-t border-emerald-900/10 dark:border-slate-800">
          <a :href="joinUrl" class="w-full ds-btn ds-btn-md ds-btn-sunset text-center">Вступить в клуб</a>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  activePage: { type: String, default: 'home' },
  basePath: { type: String, default: '.' },
  subtitle: { type: String, default: 'Nature & Expeditions' },
  showCart: { type: Boolean, default: false },
});

const isDark = ref(false);
const mobileOpen = ref(false);
const scrolled = ref(false);
const cartCount = ref(Number(localStorage.getItem('tn_cart_count') || 2));
const cartPulse = ref(false);

const homeUrl = computed(() => (props.basePath === '.' ? './' : '../'));
const pagesPrefix = computed(() => (props.basePath === '.' ? './pages' : '.'));
const joinUrl = computed(() => `${pagesPrefix.value}/multistep.html`);

const navItems = computed(() => [
  { key: 'home', label: 'Путеводители', href: `${homeUrl.value}#articles` },
  { key: 'storybook', label: 'Атлас природы', href: `${pagesPrefix.value}/storybook.html` },
  { key: 'dashboard', label: 'Трекер', href: `${pagesPrefix.value}/dashboard.html` },
  { key: 'ecommerce', label: 'Снаряжение & Туры', href: `${pagesPrefix.value}/ecommerce.html` },
  { key: 'kanban', label: 'Компас маршрута', href: `${pagesPrefix.value}/kanban.html` },
  { key: 'messenger', label: 'Попутчики', href: `${pagesPrefix.value}/messenger.html` },
]);

function applyTheme(dark) {
  isDark.value = dark;
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

function toggleTheme() {
  applyTheme(!isDark.value);
}

function openCartDrawer() {
  window.dispatchEvent(new CustomEvent('tn-open-cart'));
}

function onScroll() {
  scrolled.value = window.scrollY > 12;
}

function onCartUpdated(e) {
  if (typeof e.detail?.count === 'number') {
    cartCount.value = e.detail.count;
    localStorage.setItem('tn_cart_count', String(e.detail.count));
    cartPulse.value = true;
    setTimeout(() => { cartPulse.value = false; }, 240);
  }
}

onMounted(() => {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('tn-cart-updated', onCartUpdated);
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('tn-cart-updated', onCartUpdated);
});
</script>
