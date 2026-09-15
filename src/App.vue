<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100
    dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="fixed inset-x-0 top-6 z-50 flex justify-center px-4 pointer-events-none">
      <Transition enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
        <div v-if="authError" id="access-error" role="alert"
          class="flex items-start gap-2.5 max-w-md px-4 py-3 rounded-xl shadow-lg shadow-gray-200/40 dark:shadow-gray-950/30
            bg-red-50 dark:bg-gray-800 border border-red-100 dark:border-red-800/50
            text-sm text-red-600 dark:text-red-400">
          <Icon icon="carbon:warning-filled" class="w-4 h-4 mt-0.5 shrink-0 text-red-500/90 dark:text-red-400/90" />
          <span class="leading-5">{{ authError }}</span>
        </div>
      </Transition>
    </div>
    <div v-if="!authenticated && !checking" class="flex-1 flex items-center justify-center p-6">
      <form class="card-base w-full max-w-sm p-6 sm:p-8 rounded-2xl backdrop-blur-sm space-y-6" @submit.prevent="login">
        <div class="flex items-center gap-3">
          <img src="/logo.svg" :alt="t('header.logo')" class="w-8 h-8 sm:w-10 sm:h-10" />
          <h1 class="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{{ title }}</h1>
        </div>
        <template v-if="!checking && !checkFailed">
          <label for="access-password" class="block text-sm font-medium text-gray-600 dark:text-gray-300">{{ t('access.password') }}</label>
          <div class="relative">
            <input id="access-password" v-model="password" :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password" required maxlength="1024"
              style="font-family: Arial, sans-serif; letter-spacing: normal"
              class="w-full rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50
                pl-4 pr-12 py-3 text-gray-800 dark:text-gray-100 outline-none transition-colors duration-200
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              :aria-invalid="!!authError" :aria-describedby="authError ? 'access-error' : undefined" :disabled="submitting" />
            <button type="button" :disabled="submitting" @click="showPassword = !showPassword"
              :aria-label="t(showPassword ? 'access.hidePassword' : 'access.showPassword')"
              :title="t(showPassword ? 'access.hidePassword' : 'access.showPassword')"
              :aria-pressed="showPassword" aria-controls="access-password"
              class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full
                text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400
                hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:opacity-50">
              <Icon :icon="showPassword ? 'ph:eye-slash' : 'ph:eye'" class="w-5 h-5" />
            </button>
          </div>
          <button type="submit" :disabled="submitting" class="w-full rounded-full px-4 py-3 text-sm font-medium transition-all duration-200
              bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400
              shadow-sm shadow-emerald-500/10 dark:shadow-emerald-900/20
              hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-75 disabled:cursor-not-allowed">{{ submitting ? t('access.checking') : t('access.login') }}</button>
        </template>
        <button v-if="checkFailed" type="button" class="text-sm text-emerald-600 dark:text-emerald-400" @click="checkAccess">{{ t('access.retry') }}</button>
      </form>
    </div>
    <div v-else-if="authenticated" class="flex-1 p-3 sm:p-8">
      <main class="max-w-7xl mx-auto space-y-8">
        <Header :title="title" :is-refreshing="isRefreshing" :is-dark="isDark" v-model:sort="sort"
          :show-logout="protectedAccess" @logout="logout"
          @refresh="load" @toggle-theme="toggleTheme" @toggle-language="toggleLanguage" />
        <Stats :monitors="monitors" />
        <Card :monitors="monitors" :sort="sort" :error="error" :refreshing="isRefreshing" @update-monitor="onPatch" />
      </main>
    </div>
    <div v-else class="flex-1" aria-busy="true" />
    <Footer v-if="!checking || authenticated" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { fetchMonitorData, writeCache, readCache, isRateLimit, waitRetry } from './utils/api'
import { accessRequest, clearMonitorCache } from './utils/access'
import Header from './components/Header.vue'
import Stats from './components/Stats.vue'
import Card from './components/Card.vue'
import Footer from './components/Footer.vue'

const { t, locale } = useI18n()
const title = ref(import.meta.env.VITE_APP_TITLE || t('common.title'))
const authenticated = ref(false)
const protectedAccess = ref(false)
const checking = ref(true)
const checkFailed = ref(false)
const submitting = ref(false)
const password = ref('')
const showPassword = ref(false)
const authError = ref('')
let authErrorTimer
watch(authError, (message) => {
  clearTimeout(authErrorTimer)
  if (message) authErrorTimer = setTimeout(() => { authError.value = '' }, 3500)
})
watch(password, () => { authError.value = '' })
const lock = () => {
  authenticated.value = false
  showPassword.value = false
  monitors.value = []
  clearMonitorCache()
  loadId++
  isRefreshing.value = false
}
const checkAccess = async () => {
  checking.value = true; checkFailed.value = false; authError.value = ''
  try {
    const result = await accessRequest('auth')
    protectedAccess.value = result.enabled
    authenticated.value = result.authenticated
    if (result.authenticated) await load()
    else lock()
  } catch { lock(); checkFailed.value = true; authError.value = t('access.connection') }
  finally { checking.value = false }
}
const login = async () => {
  submitting.value = true; authError.value = ''
  try {
    await accessRequest('login', password.value)
    password.value = ''
    showPassword.value = false
    await checkAccess()
  } catch (e) { authError.value = e.message === 'password' ? t('access.wrong') : t('access.connection') }
  finally { submitting.value = false }
}
const logout = async () => {
  try { await accessRequest('logout'); lock() }
  catch { error.value = t('access.connection') }
}
const monitors = ref([])
const isRefreshing = ref(false)
const isDark = ref(false)
const error = ref('')
const loadSort = () => {
  const raw = localStorage.getItem('monitorSort')
  if (!raw) return { key: 'friendlyName', order: 'asc' }
  if (raw.includes(':')) {
    const [key, order] = raw.split(':')
    return { key: key || 'friendlyName', order: order === 'desc' ? 'desc' : 'asc' }
  }
  return { key: raw, order: raw === 'createDateTime' ? 'desc' : 'asc' }
}

const sort = ref(loadSort())

watch(sort, (v) => localStorage.setItem('monitorSort', `${v.key}:${v.order}`), { deep: true })
watch(locale, () => { title.value = import.meta.env.VITE_APP_TITLE || t('common.title') })

const toggleLanguage = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  localStorage.setItem('locale', locale.value)
}

const initTheme = () => {
  isDark.value = localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark.value)
}

let loadId = 0

const load = async (force = false) => {
  if (!authenticated.value || isRefreshing.value) return
  const id = ++loadId
  isRefreshing.value = true
  if (force) error.value = ''
  let useForce = force

  while (id === loadId) {
    try {
      const data = await fetchMonitorData({ force: useForce })
      if (id !== loadId) break
      monitors.value = data
      error.value = ''
      break
    } catch (e) {
      if (id !== loadId) break
      const stale = readCache(true)
      if (stale?.length) monitors.value = stale
      if (!isRateLimit(e)) { error.value = t('error.fetchFailed'); break }
      isRefreshing.value = false
      await waitRetry(e.retryAfter || 60, (s) => {
        if (id === loadId) {
          error.value = monitors.value.length
            ? t('error.rateLimitRetry', { seconds: s })
            : t('error.rateLimit', { seconds: s })
        }
      })
      if (id !== loadId) break
      isRefreshing.value = true
      useForce = true
    }
  }
  if (id === loadId) isRefreshing.value = false
}

const onPatch = (m) => {
  const i = monitors.value.findIndex((x) => x.id === m.id)
  if (i >= 0) { monitors.value[i] = m; writeCache(monitors.value) }
}

onMounted(() => { initTheme(); window.addEventListener('uptime-unauthorized', lock); checkAccess() })
onUnmounted(() => { clearTimeout(authErrorTimer); loadId++; window.removeEventListener('uptime-unauthorized', lock) })
</script>
