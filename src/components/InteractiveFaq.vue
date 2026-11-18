<template>
  <section class="section-container max-w-4xl">
    <div class="section-heading-wrapper">
      <span class="ds-kicker mb-3">База знаний</span>
      <h2 class="ds-h2">Часто задаваемые вопросы</h2>
      <p class="ds-body mt-3">Всё о подготовке, безопасности, визах и снаряжении для самостоятельных путешествий.</p>
    </div>

    <div class="flex flex-wrap justify-center gap-2 mb-8">
      <button
        v-for="cat in categories"
        :key="cat.key"
        type="button"
        @click="activeCat = cat.key"
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
          activeCat === cat.key
            ? 'bg-brand-600 text-white shadow-sm'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500'
        ]"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="space-y-3.5">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="bento-card transition-all duration-200"
      >
        <button
          type="button"
          @click="toggleItem(item.id)"
          class="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition"
          :aria-expanded="openId === item.id ? 'true' : 'false'"
        >
          <span>{{ item.q }}</span>
          <span
            :class="[
              'text-slate-400 transition-transform duration-200 shrink-0',
              openId === item.id ? 'rotate-180 text-brand-500' : ''
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </button>

        <div v-if="openId === item.id" class="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
          {{ item.a }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const categories = [
  { key: 'all', label: 'Все вопросы' },
  { key: 'nav', label: 'Навигация & GPX' },
  { key: 'safety', label: 'Безопасность' },
  { key: 'club', label: 'Клуб & Скидки' },
];

const ITEMS = [
  {
    id: 1,
    cat: 'nav',
    q: 'Как загрузить ваши GPS-треки в телефон для работы без интернета?',
    a: 'Все файлы поставляются в стандартных форматах .GPX и .KML. Вы можете открыть их в бесплатном приложении Organic Maps или OsmAnd в один клик. Предварительно скачайте офлайн-карту нужного региона, и навигация будет работать даже в глухой тундре без сотовой связи.',
  },
  {
    id: 2,
    cat: 'safety',
    q: 'Какую медицинскую страховку оформлять для активного треккинга?',
    a: 'Обычная туристическая страховка не покрывает походы в горы. Всегда выбирайте опцию «Активный отдых / Треккинг» и проверяйте пункт «Поисково-спасательные работы с вертолетом» (SAR). В статьях блога есть список проверенных ассистансов для Непала, Патагонии и Альп.',
  },
  {
    id: 3,
    cat: 'safety',
    q: 'Безопасно ли отправляться в сложные маршруты в одиночку?',
    a: 'Соло-походы дарят невероятное ощущение свободы, но требуют строгой дисциплины: обязательная регистрация в МЧС / рейнджерах парка, наличие спутникового трекера (например, Garmin inReach), запас фильтрации воды и дублирование навигации. Если вы новичок, воспользуйтесь нашим чатом для поиска попутчиков.',
  },
  {
    id: 4,
    cat: 'club',
    q: 'Как получить скидки на снаряжение по вашей подписке?',
    a: 'После вступления в клуб PRO в личном кабинете открывается раздел с партнёрскими промокодами и персональными ссылками на кэшбэк. Скидки действуют в магазинах туристического снаряжения, на аренду автодомов и сервисы покупки авиабилетов.',
  },
];

const activeCat = ref('all');
const openId = ref(null);

const filteredItems = computed(() =>
  activeCat.value === 'all' ? ITEMS : ITEMS.filter(i => i.cat === activeCat.value)
);

function toggleItem(id) {
  openId.value = openId.value === id ? null : id;
}
</script>
