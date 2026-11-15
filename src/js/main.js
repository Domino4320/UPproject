import { createApp } from 'vue';
import AdSlot from '../components/AdSlot.vue';

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

// Vue AdSlot mounting helper
export function initAdSlots() {
  const slots = document.querySelectorAll('[data-vue-ad-slot]');
  slots.forEach(el => {
    if (el.dataset.vueMounted === 'true') return;
    el.dataset.vueMounted = 'true';

    const size = el.dataset.size || 'banner';
    const width = el.dataset.width || '';
    const height = el.dataset.height || '';
    const label = el.dataset.label || 'Снаряжение для экспедиций со скидкой 25%';
    const sublabel = el.dataset.sublabel || 'Топовые мембраны, треккинговая обувь и спутниковая связь от проверенных брендов для подписчиков блога.';
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

// Smooth FAQ Accordion
export function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    if (item.dataset.faqBound === 'true') return;
    item.dataset.faqBound = 'true';

    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    const iconSvg = item.querySelector('.faq-icon svg');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = panel.classList.contains('grid-rows-[1fr]');

      // Close other panels
      faqItems.forEach(other => {
        if (other !== item) {
          const otherPanel = other.querySelector('.faq-panel');
          const otherIcon = other.querySelector('.faq-icon svg');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherPanel) {
            otherPanel.classList.remove('grid-rows-[1fr]');
            otherPanel.classList.add('grid-rows-[0fr]');
          }
          if (otherIcon) {
            otherIcon.classList.remove('rotate-180');
          }
          if (otherTrigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Toggle current panel
      if (isOpen) {
        panel.classList.remove('grid-rows-[1fr]');
        panel.classList.add('grid-rows-[0fr]');
        if (iconSvg) iconSvg.classList.remove('rotate-180');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        panel.classList.remove('grid-rows-[0fr]');
        panel.classList.add('grid-rows-[1fr]');
        if (iconSvg) iconSvg.classList.add('rotate-180');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Mobile Menu Toggle
export function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    const isExpanded = !menu.classList.contains('hidden');
    btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });
}

// Universal Initializer on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAdSlots();
  initFaqAccordion();
  initMobileMenu();
});
