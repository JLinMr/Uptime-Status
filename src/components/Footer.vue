<template>
  <footer class="max-w-7xl mx-auto w-full py-6 px-3 sm:px-8 text-center relative">
    <!-- 返回顶部按钮 -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <button 
        v-show="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-20 right-6 p-3 rounded-full shadow-lg 
          bg-white dark:bg-gray-800 
          text-gray-600 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-gray-700
          border border-gray-200 dark:border-gray-700
          transition-all duration-200 z-50
          group"
      >
        <Icon 
          icon="carbon:arrow-up" 
          class="w-6 h-6 transition-transform duration-200 
            group-hover:-translate-y-0.5
            text-gray-600 dark:text-gray-300
            group-hover:text-emerald-500 dark:group-hover:text-emerald-400" 
        />
      </button>
    </Transition>

    <div class="flex flex-col items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
      <div class="flex items-center gap-6">
        <a 
          :href="pkg.repository.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center p-1.5 rounded-full transition-colors duration-200
            text-gray-400 hover:text-gray-600 hover:bg-gray-200
            dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-700
            box-content"
        >
          <Icon icon="ri:github-line" class="w-5 h-5" />
        </a>
        <a 
          :href="pkg.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center p-1.5 rounded-full transition-colors duration-200
            text-gray-400 hover:text-gray-600 hover:bg-gray-200
            dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-700
            box-content"
        >
          <Icon icon="carbon:home" class="w-5 h-5" />
        </a>
        <a 
          :href="`mailto:${pkg.email}`"
          class="inline-flex items-center justify-center p-1.5 rounded-full transition-colors duration-200
            text-gray-400 hover:text-gray-600 hover:bg-gray-200
            dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-700
            box-content"
        >
          <Icon icon="carbon:email" class="w-5 h-5" />
        </a>
      </div>
      <div class="flex flex-col items-center gap-1">
        <div>
          <a 
            :href="pkg.repositoryUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="font-semibold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >Uptime-Status</a> Version {{ pkg.version }}
        </div>
        <div>
          基于 <a 
            href="https://uptimerobot.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="font-semibold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >UptimeRobot</a> 接口 | 检测频率 5 分钟
        </div>
        <div>
          Copyright © 2020 - {{ new Date().getFullYear() }} <a 
            :href="pkg.url"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >
            JLinmr
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import pkg from '../../package.json'

/**
 * 控制返回顶部按钮的显示
 */
const showBackToTop = ref(false)
const SCROLL_THRESHOLD = 300

/**
 * 监听滚动事件
 */
const handleScroll = () => {
  showBackToTop.value = window.scrollY > SCROLL_THRESHOLD
}

/**
 * 平滑滚动到顶部
 */
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script> 