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
    localStorage.setItem('theme', 'light');
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

// Global Toast Notification Utility
export function showToast(title, message = '', type = 'success') {
  let container = document.getElementById('tn-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'tn-toast-container';
    container.className = 'fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = {
    success: 'border-emerald-500/40 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white',
    info: 'border-brand-500/40 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white',
    warning: 'border-sunset-500/40 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white',
  };
  const iconMap = {
    success: '<span class="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">🌲</span>',
    info: '<span class="w-8 h-8 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 font-bold">🧭</span>',
    warning: '<span class="w-8 h-8 rounded-xl bg-sunset-500/15 text-sunset-600 dark:text-sunset-400 flex items-center justify-center shrink-0 font-bold">⛺</span>',
  };

  toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-4 opacity-0 ${colors[type] || colors.success}`;
  toast.innerHTML = `
    ${iconMap[type] || iconMap.success}
    <div class="flex-1 min-w-0">
      <div class="text-xs font-extrabold tracking-tight">${title}</div>
      ${message ? `<div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">${message}</div>` : ''}
    </div>
    <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1">✕</button>
  `;

  toast.querySelector('button').addEventListener('click', () => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 250);
  });

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }
  }, 4200);
}

// Expose globally for inline handlers
if (typeof window !== 'undefined') {
  window.showToast = showToast;
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
  if (btn.dataset.menuBound === 'true') return;
  btn.dataset.menuBound = 'true';

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    const isExpanded = !menu.classList.contains('hidden');
    btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });
}

// Scroll Reveal Animations
export function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
}

// Top Reading / Scroll Progress Bar
export function initScrollProgress() {
  if (document.body.classList.contains('overflow-hidden')) return;
  if (document.getElementById('tn-scroll-progress')) return;

  const bar = document.createElement('div');
  bar.id = 'tn-scroll-progress';
  bar.className = 'fixed top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-brand-500 via-teal-400 to-sunset-500 z-[70] transition-[width] duration-75 pointer-events-none';
  document.body.appendChild(bar);

  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    bar.style.width = `${pct}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// Animated Stat Counters
export function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.countTo);
      const suffix = el.dataset.countSuffix || '';
      const decimals = Number(el.dataset.countDecimals || 0);
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = (target * eased).toFixed(decimals);
        el.textContent = `${val}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${target.toFixed(decimals)}${suffix}`;
        }
      };

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

// Universal Initializer on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAdSlots();
  initFaqAccordion();
  initMobileMenu();
  initScrollReveal();
  initScrollProgress();
  initAnimatedCounters();
});
