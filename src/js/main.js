import { createApp } from 'vue';
import AdSlot from '../components/AdSlot.vue';

// Export AdSlot component for direct imports
export { AdSlot };

// Dark Mode and Theme Management
export function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateIcons(isDark);
}

export function updateIcons(isDark) {
  // When dark: show sun (click to switch to light), hide moon
  // When light: show moon (click to switch to dark), hide sun
  document.querySelectorAll('[data-theme-icon="sun"]').forEach(el => {
    el.classList.toggle('hidden', !isDark);
  });
  document.querySelectorAll('[data-theme-icon="moon"]').forEach(el => {
    el.classList.toggle('hidden', isDark);
  });
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
    btn.setAttribute('title', isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
  });
}

export function toggleTheme() {
  const isCurrentlyDark = document.documentElement.classList.contains('dark');
  applyTheme(!isCurrentlyDark);
}

export function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  applyTheme(isDark);

  const themeToggleBtns = document.querySelectorAll('[data-theme-toggle]');
  themeToggleBtns.forEach(btn => {
    if (btn.dataset.themeBound === 'true') return;
    btn.dataset.themeBound = 'true';
    btn.addEventListener('click', toggleTheme);
  });
}

// Vue AdSlot mounting helper for Vue integration
export function initAdSlots() {
  const slots = document.querySelectorAll('[data-vue-ad-slot]');
  slots.forEach(el => {
    if (el.dataset.vueMounted === 'true') return;
    el.dataset.vueMounted = 'true';

    const size = el.dataset.size || 'banner';
    const width = el.dataset.width || '';
    const height = el.dataset.height || '';
    const label = el.dataset.label || 'Рекламное место';
    const sublabel = el.dataset.sublabel || 'Место зарезервировано под баннер рекламодателя (AdSlot.vue)';
    const closable = el.dataset.closable === 'true';

    try {
      const app = createApp(AdSlot, {
        size,
        width,
        height,
        label,
        sublabel,
        closable,
      });
      app.mount(el);
    } catch (e) {
      console.error('Failed to mount AdSlot:', e);
    }
  });
}

// Auto-fix relative paths on GitHub Pages
export function fixGitHubPagesLinks() {
  if (typeof window === 'undefined') return;
  const path = window.location.pathname;
  if (!window.location.hostname.endsWith('github.io')) return;

  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return;
  const repoName = parts[0];

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
      return;
    }
    // If link starts with / but not with /repoName
    if (href.startsWith('/') && !href.startsWith(`/${repoName}`)) {
      a.setAttribute('href', `/${repoName}${href}`);
    }
  });
}

export function initApp() {
  initTheme();
  initAdSlots();
  fixGitHubPagesLinks();
}

// Auto-run theme and ad slots on DOM ready safely (idempotent)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
