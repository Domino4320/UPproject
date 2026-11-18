<template>
  <div class="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-2 sm:p-4 gap-4">
    <!-- Сайдбар чатов -->
    <aside
      :class="[
        'w-full md:w-80 lg:w-96 flex-col bento-card shrink-0 overflow-hidden',
        mobileShowChat ? 'hidden md:flex' : 'flex'
      ]"
    >
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Чаты экспедиций</h2>
          <span class="text-xs font-semibold text-brand-600 dark:text-brand-400">{{ chats.length }} канала</span>
        </div>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Поиск каналов и попутчиков..."
            class="ds-input pl-9 py-2 text-xs bg-slate-50 dark:bg-slate-800"
          >
        </div>
      </div>

      <!-- Список каналов -->
      <div class="flex-1 overflow-y-auto scrollbar-custom divide-y divide-slate-100 dark:divide-slate-800/60">
        <button
          v-for="chat in filteredChats"
          :key="chat.id"
          type="button"
          @click="selectChat(chat.id)"
          :class="[
            'w-full text-left p-4 flex items-center gap-3.5 cursor-pointer transition-colors border-l-4',
            chat.id === activeChatId
              ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-600'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'
          ]"
        >
          <div class="relative shrink-0">
            <img
              :src="chat.avatar"
              :alt="chat.title"
              :class="['w-12 h-12 rounded-2xl object-cover', chat.id === activeChatId ? 'ring-2 ring-brand-500' : '']"
            >
            <span
              :class="[
                'absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900',
                chat.online ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
              ]"
            ></span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex justify-between items-baseline mb-1 gap-2">
              <span class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ chat.title }}</span>
              <span :class="['text-[11px] shrink-0', chat.id === activeChatId ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-400']">
                {{ chat.lastTime }}
              </span>
            </div>
            <p :class="['text-xs truncate', chat.unread > 0 ? 'font-semibold text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400']">
              {{ getLastPreview(chat) }}
            </p>
          </div>
          <span v-if="chat.unread > 0" class="w-5 h-5 rounded-full bg-sunset-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            {{ chat.unread }}
          </span>
        </button>
      </div>
    </aside>

    <!-- Окно активного чата -->
    <main
      :class="[
        'flex-1 flex-col bento-card overflow-hidden relative',
        mobileShowChat ? 'flex' : 'hidden md:flex'
      ]"
    >
      <!-- Хедер беседы -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div class="flex items-center gap-3 min-w-0">
          <button
            type="button"
            @click="mobileShowChat = false"
            class="md:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Назад к списку чатов"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <img :src="activeChat.avatar" :alt="activeChat.title" class="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500 shrink-0">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ activeChat.fullTitle }}</h3>
              <span class="ds-badge ds-badge-brand text-[10px]">{{ activeChat.coords }}</span>
            </div>
            <span class="text-xs text-slate-400 block truncate">
              {{ typingChatId === activeChat.id ? `${activeChat.leader.name.split(' ')[0]} печатает...` : activeChat.subtitle }}
            </span>
          </div>
        </div>

        <a href="./kanban.html" class="ds-btn ds-btn-sm ds-btn-secondary whitespace-nowrap shrink-0">
          Компас маршрута
        </a>
      </div>

      <!-- Лента сообщений -->
      <div ref="messagesRef" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-custom">
        <template v-for="(msg, idx) in activeChat.messages" :key="idx">
          <!-- Дата -->
          <div v-if="msg.type === 'date'" class="flex items-center justify-center my-4">
            <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {{ msg.text }}
            </span>
          </div>

          <!-- Исходящее -->
          <div v-else-if="msg.type === 'out'" class="flex items-end justify-end gap-2 ml-auto max-w-xl animate-fade-in">
            <div class="space-y-1 text-right">
              <div class="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-brand-600 to-teal-600 text-white text-sm text-left shadow-md">
                <p>{{ msg.text }}</p>
              </div>
              <div class="text-[10px] text-slate-400 pr-1 flex items-center justify-end gap-1">
                <span>{{ msg.time }}</span>
                <span>✓✓</span>
              </div>
            </div>
          </div>

          <!-- Входящее -->
          <div v-else class="flex items-start gap-3 max-w-xl animate-fade-in">
            <img :src="msg.avatar" :alt="msg.sender" class="w-8 h-8 rounded-full object-cover shrink-0 mt-1">
            <div class="space-y-1">
              <div class="flex items-baseline gap-2">
                <span class="text-xs font-bold text-slate-900 dark:text-white">{{ msg.sender }}</span>
                <span class="text-[10px] text-slate-400">{{ msg.time }}</span>
              </div>
              <div class="p-4 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 space-y-2">
                <p>{{ msg.text }}</p>
                <div v-if="msg.photo" class="rounded-xl overflow-hidden mt-2 border border-slate-200 dark:border-slate-700">
                  <img :src="msg.photo.src" :alt="msg.photo.caption" class="w-full h-44 object-cover">
                  <div class="p-2.5 bg-slate-50 dark:bg-slate-800 text-xs flex justify-between items-center">
                    <span class="font-semibold text-slate-700 dark:text-slate-300">{{ msg.photo.caption }}</span>
                    <span class="text-[11px] text-brand-600 dark:text-brand-400">{{ msg.photo.gps }}</span>
                  </div>
                </div>
                <div v-if="msg.highlight" class="flex items-center gap-2 pt-1 text-xs text-sunset-500 font-bold">
                  <span>{{ msg.highlight }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Поле ввода -->
      <div class="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <form @submit.prevent="sendMessage" class="flex items-center gap-2">
          <button
            type="button"
            @click="attachGpx"
            class="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Прикрепить GPX-точку"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
          </button>

          <input
            ref="inputRef"
            v-model="draftText"
            type="text"
            autocomplete="off"
            placeholder="Написать сообщение в чат экспедиции..."
            class="flex-1 ds-input py-2.5 text-sm bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500"
          >

          <button
            type="submit"
            class="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition shadow-md shadow-brand-600/25 shrink-0 active:scale-95"
            title="Отправить"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const chats = ref([
  {
    id: 'iceland',
    title: "Экспедиция Исландия '26",
    fullTitle: "Экспедиция Исландия '26 (12 мест)",
    subtitle: '14 участников • 6 онлайн',
    coords: 'Координаты: 64.1° N',
    avatar: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=100&h=100&q=80',
    online: true,
    unread: 2,
    lastTime: '11:42',
    leader: {
      name: 'Максим Ветров (Лидер)',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=80&h=80&q=80',
      autoReply: 'Принято! Добавил твой комментарий в общий брифинг перед вылетом.',
    },
    messages: [
      { type: 'date', text: 'Сегодня, 14 ноября 2026' },
      {
        type: 'in',
        sender: 'Максим Ветров (Лидер)',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=80&h=80&q=80',
        time: '10:15',
        text: 'Всем привет! До старта зимней экспедиции по кольцу Исландии осталось 10 дней. Скачайте свежий трек в OsmAnd: добавил точку стоянки у лагуны Йёкюльсаурлоун.',
        photo: {
          src: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
          caption: 'Ледяная пещера Ватнайёкюдль',
          gps: 'GPS: 64.048° N',
        },
      },
      {
        type: 'in',
        sender: 'Елена Васильева',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
        time: '10:48',
        text: 'Супер! Максим, подскажи, цепи на колеса для арендованного 4x4 Defender брать в Рейкьявике или уже включены в аренду?',
      },
      {
        type: 'out',
        time: '11:15',
        text: 'Да, я созвонился с прокатом: цепи противоскольжения и шипованная резина уже входят в экспедиционный пакет. Плюс берем спутниковый трекер inReach для постоянного трекинга в горах.',
      },
      {
        type: 'in',
        sender: 'Максим Ветров (Лидер)',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=80&h=80&q=80',
        time: '11:42',
        text: 'Отлично! Перевал F208 сейчас открыт, броды до 40 см. Не забудьте неопреновые носки и мембранные куртки с показателем от 20 000 мм.',
        highlight: '📍 Точка сбора: Аэропорт Кеблавик, 12 декабря в 14:00',
      },
    ],
  },
  {
    id: 'annapurna',
    title: 'Кольцо Аннапурны (Окт)',
    fullTitle: 'Кольцо Аннапурны • Треккинг к Торонг-Ла',
    subtitle: '9 участников • 3 онлайн',
    coords: 'Высота: 5 416 м',
    avatar: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=100&h=100&q=80',
    online: true,
    unread: 0,
    lastTime: 'Вчера',
    leader: {
      name: 'Алина Соколова (Гид)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
      autoReply: 'Отличный вопрос! В Мананге у нас запланирован дополнительный день акклиматизации.',
    },
    messages: [
      { type: 'date', text: 'Вчера, 13 ноября 2026' },
      {
        type: 'in',
        sender: 'Алина Соколова (Гид)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
        time: '16:20',
        text: 'Получили пермиты в ACAP и карты TIMS на всю группу! Встречаемся в Катманду в районе Тамель, у нас забронирован уютный гестхаус с видом на ступу.',
      },
      {
        type: 'out',
        time: '17:05',
        text: 'Здорово! Какие спальники лучше брать на октябрь — хватит ли комфорта -5°C для ночёвки перед перевалом Торонг-Ла?',
      },
      {
        type: 'in',
        sender: 'Алина Соколова (Гид)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
        time: '18:10',
        text: 'В лоджах на 4500 м дают тёплые одеяла, так что -5°C с флисовым вкладышем будет вполне достаточно.',
      },
    ],
  },
  {
    id: 'norway',
    title: 'Попутчики Норвегия 4x4',
    fullTitle: 'Попутчики Норвегия 4x4 • Лофотены',
    subtitle: '6 участников • 2 онлайн',
    coords: 'Координаты: 68.2° N',
    avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&h=100&q=80',
    online: false,
    unread: 0,
    lastTime: '12 ноя',
    leader: {
      name: 'Денис Орлов',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
      autoReply: 'Записал! Скину таблицу расходов по паромам и кемпингам вечером.',
    },
    messages: [
      { type: 'date', text: '12 ноября 2026' },
      {
        type: 'in',
        sender: 'Денис Орлов',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
        time: '14:30',
        text: 'Ребята, нашли 4-го участника для шеринга кемпера! Маршрут: Тромсё — Сенья — Лофотенские острова на 10 дней.',
      },
      {
        type: 'in',
        sender: 'Игорь К.',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&h=80&q=80',
        time: '15:12',
        text: 'Отлично, паром из Будё в Москенес лучше бронировать заранее, чтобы не стоять в очереди.',
      },
    ],
  },
  {
    id: 'kamchatka',
    title: "Камчатка: Вулканы '26",
    fullTitle: "Камчатка: Вулканы '26 • Толбачик и Мутновский",
    subtitle: '11 участников • 4 онлайн',
    coords: 'Координаты: 55.8° N',
    avatar: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=100&h=100&q=80',
    online: true,
    unread: 1,
    lastTime: '10 ноя',
    leader: {
      name: 'Артём Мельников',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&h=80&q=80',
      autoReply: 'Супер! Вахтовка КАМАЗ 6x6 уже подтверждена на все даты.',
    },
    messages: [
      { type: 'date', text: '10 ноября 2026' },
      {
        type: 'in',
        sender: 'Артём Мельников',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&h=80&q=80',
        time: '09:40',
        text: 'Фальшфейеры, сигналы охотника и медвежьи баллоны куплены на всю группу. Дополнительно везём 2 комплекта спутниковых раций.',
      },
    ],
  },
]);

const activeChatId = ref('iceland');
const searchQuery = ref('');
const draftText = ref('');
const mobileShowChat = ref(false);
const typingChatId = ref(null);
const messagesRef = ref(null);
const inputRef = ref(null);

const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value) || chats.value[0]);

const filteredChats = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return chats.value;
  return chats.value.filter(c => {
    const last = c.messages[c.messages.length - 1]?.text || '';
    return c.title.toLowerCase().includes(q) || last.toLowerCase().includes(q);
  });
});

function getLastPreview(chat) {
  const last = [...chat.messages].reverse().find(m => m.type !== 'date');
  if (!last) return '';
  return last.type === 'out' ? `Вы: ${last.text}` : `${last.sender.split(' ')[0]}: ${last.text}`;
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
}

function selectChat(id) {
  activeChatId.value = id;
  const chat = chats.value.find(c => c.id === id);
  if (chat) chat.unread = 0;
  mobileShowChat.value = true;
  scrollToBottom();
  nextTick(() => inputRef.value?.focus());
}

function attachGpx() {
  draftText.value = `📍 Отправляю GPX-точку лагеря (${activeChat.value.coords})`;
  inputRef.value?.focus();
}

function sendMessage() {
  const text = draftText.value.trim();
  if (!text) return;

  const target = activeChat.value;
  const time = new Date().toTimeString().slice(0, 5);
  target.messages.push({ type: 'out', time, text });
  target.lastTime = time;
  draftText.value = '';
  scrollToBottom();

  const targetId = target.id;
  typingChatId.value = targetId;

  setTimeout(() => {
    typingChatId.value = null;
    const chat = chats.value.find(c => c.id === targetId);
    if (!chat) return;
    const replyTime = new Date().toTimeString().slice(0, 5);
    chat.messages.push({
      type: 'in',
      sender: chat.leader.name,
      avatar: chat.leader.avatar,
      time: replyTime,
      text: chat.leader.autoReply,
    });
    chat.lastTime = replyTime;
    if (activeChatId.value !== targetId) chat.unread += 1;
    else scrollToBottom();
  }, 900);
}
</script>
