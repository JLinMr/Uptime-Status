<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-3">
      <img src="/logo.svg" alt="Logo" class="w-8 h-8 sm:w-10 sm:h-10" />
      <h1 class="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{{ title }}</h1>
    </div>
    <div class="flex items-center gap-3">
      <button @click="refreshData" :disabled="isRefreshing"
        class="flex items-center gap-2 px-3 h-9 rounded-full transition-all duration-200
          bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400
          shadow-sm shadow-emerald-500/10 dark:shadow-emerald-900/20
          hover:bg-emerald-100 dark:hover:bg-emerald-900/40
          disabled:opacity-75 disabled:cursor-not-allowed disabled:shadow-none">
        <Icon icon="ph:arrows-counter-clockwise-bold" class="w-4 h-4 transition-all"
          :class="isRefreshing ? 'animate-spin' : ''" />
        <span class="hidden sm:block text-sm font-medium">{{ t('common.refreshIn') }} {{ formatTime(countdown) }}</span>
      </button>
      <div ref="sortRef" class="relative flex items-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
        <button @click="toggleOrder" :title="t(sort.order === 'asc' ? 'sort.desc' : 'sort.asc')"
          class="flex items-center justify-center w-9 h-9 text-gray-600 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-gray-700 border-r border-gray-100 dark:border-gray-700 rounded-l-full">
          <Icon :icon="sort.order === 'asc' ? 'ph:sort-ascending-bold' : 'ph:sort-descending-bold'" class="w-4 h-4" />
        </button>
        <button @click.stop="sortOpen = !sortOpen"
          class="flex items-center gap-1.5 px-3 h-9 text-gray-600 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-full">
          <span class="hidden sm:inline-block sm:w-10 sm:text-center text-sm">{{ sortLabel }}</span>
          <Icon icon="ph:caret-down-bold" class="w-3 h-3 shrink-0 transition-transform" :class="sortOpen ? 'rotate-180' : ''" />
        </button>
        <div v-if="sortOpen" class="absolute inset-x-0 top-full z-50 mt-2 py-1 rounded-xl
          bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg">
          <button v-for="o in SORT_KEYS" :key="o" @click="pickKey(o)"
            class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-700/80"
            :class="sort.key === o
              ? 'text-emerald-600 dark:text-emerald-400 font-medium'
              : 'text-gray-600 dark:text-gray-300'">
            <Icon :icon="KEY_ICON[o]" class="hidden sm:block w-4 h-4 shrink-0" />
            {{ t(`sort.${o}`) }}
          </button>
        </div>
      </div>
      <button @click="$emit('toggle-theme')"
        class="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200
          bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
          shadow-sm shadow-gray-200/50 dark:shadow-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-700 group overflow-hidden">
        <div class="relative h-5 w-5">
          <Icon icon="bi:sun" class="w-5 h-5 absolute transition-all duration-500 transform"
            :class="isDark ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'" />
          <Icon icon="bi:moon" class="w-5 h-5 absolute transition-all duration-500 transform"
            :class="isDark ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'" />
        </div>
      </button>
      <button @click="$emit('toggle-language')"
        class="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200
          bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
          shadow-sm shadow-gray-200/50 dark:shadow-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-700">
        <span class="text-xs font-bold">{{ locale === 'zh-CN' ? 'EN' : '中' }}</span>
      </button>
      <button v-if="showLogout" type="button" @click="$emit('logout')"
        :title="t('access.logout')" :aria-label="t('access.logout')"
        class="flex shrink-0 items-center justify-center w-9 h-9 rounded-full transition-all duration-200
          bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
          shadow-sm shadow-gray-200/50 dark:shadow-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-700
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40">
        <Icon icon="ph:sign-out-bold" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t, locale } = useI18n()
const props = defineProps({
  title: { type: String, required: true },
  isRefreshing: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
  showLogout: { type: Boolean, default: false },
  sort: { type: Object, default: () => ({ key: 'friendlyName', order: 'asc' }) }
})
const emit = defineEmits(['refresh', 'toggle-theme', 'toggle-language', 'update:sort', 'logout'])

const SORT_KEYS = ['friendlyName', 'createDateTime', 'status']
const KEY_ICON = { friendlyName: 'ph:text-aa-bold', createDateTime: 'ph:clock-bold', status: 'ph:circles-three-bold' }
const sortOpen = ref(false)
const sortRef = ref(null)
const sortLabel = computed(() => t(`sort.${props.sort.key || 'friendlyName'}`))
const toggleOrder = () => emit('update:sort', { ...props.sort, order: props.sort.order === 'asc' ? 'desc' : 'asc' })
const pickKey = (key) => { emit('update:sort', { ...props.sort, key }); sortOpen.value = false }
const onDocClick = (e) => { if (sortRef.value && !sortRef.value.contains(e.target)) sortOpen.value = false }

const REFRESH_INTERVAL = 300
const countdown = ref(REFRESH_INTERVAL)
let timer = null
const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
const refreshData = () => (emit('refresh', true), countdown.value = REFRESH_INTERVAL)

const startTimer = () => {
  clearInterval(timer)
  countdown.value = REFRESH_INTERVAL
  timer = setInterval(() => {
    if (props.isRefreshing || countdown.value <= 0) return
    if (--countdown.value === 0) {
      emit('refresh', false)
      countdown.value = REFRESH_INTERVAL
    }
  }, 1000)
}

onMounted(() => { startTimer(); document.addEventListener('click', onDocClick) })
onUnmounted(() => { clearInterval(timer); document.removeEventListener('click', onDocClick) })
</script>
