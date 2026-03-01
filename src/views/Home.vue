<script setup lang="ts">
import { ref, computed } from 'vue'
import { NConfigProvider, NButton, NIcon, NSwitch, NAvatar, darkTheme } from 'naive-ui'
import { Sunny, Moon, LogoGithub, CodeSlash, DocumentText } from '@vicons/ionicons5'
import { articles } from '../data/articles'

const isDark = ref(true)
const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#22c55e',
    primaryColorHover: '#4ade80',
    primaryColorPressed: '#16a34a',
    borderRadius: '4px',
  }
}))

const avatarStyle = computed(() => ({ backgroundColor: '#22c55e' }))
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <div class="min-h-screen" :class="isDark ? 'bg-black text-gray-300' : 'bg-white text-gray-700'">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 border-b" 
        :class="isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'">
        <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NAvatar :size="32" round :style="avatarStyle">R</NAvatar>
            <span class="font-mono text-sm" :class="isDark ? 'text-gray-100' : 'text-gray-900'">romeochen</span>
          </div>
          <div class="flex items-center gap-4">
            <a :href="'https://github.com/RomeoChen'" target="_blank" class="p-1 hover:opacity-60 transition">
              <NIcon :component="LogoGithub" :size="18" />
            </a>
            <NSwitch v-model:value="isDark" :round="false">
              <template #checked>
                <NIcon :component="Moon" :size="12" />
              </template>
              <template #unchecked>
                <NIcon :component="Sunny" :size="12" />
              </template>
            </NSwitch>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="pt-28 pb-16 px-6">
        <div class="max-w-3xl mx-auto">
          <!-- Hero -->
          <section class="mb-16">
            <div class="flex items-center gap-2 text-xs font-mono mb-4" :class="isDark ? 'text-green-500' : 'text-green-600'">
              <NIcon :component="CodeSlash" :size="14" />
              <span>~/</span>
            </div>
            <h1 class="text-3xl font-mono font-bold mb-4" :class="isDark ? 'text-gray-100' : 'text-gray-900'">
              Romeo Chen
            </h1>
            <p class="text-sm font-mono mb-6 max-w-xl leading-relaxed" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Full Stack Developer. Building things with code.
            </p>
            <div class="flex items-center gap-3">
              <NButton size="small" quaternary>
                <template #icon>
                  <NIcon :component="LogoGithub" />
                </template>
                GitHub
              </NButton>
            </div>
          </section>

          <!-- Articles -->
          <section class="mb-16">
            <h2 class="text-xs font-mono uppercase tracking-wider mb-4" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              ## Articles
            </h2>
            <div class="space-y-3">
              <a v-for="article in articles" :key="article.slug" 
                :href="'/article/' + article.slug"
                class="block p-4 border rounded transition"
                :class="isDark ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'">
                <div class="flex items-start justify-between mb-2">
                  <span class="font-mono text-sm font-medium" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                    {{ article.title }}
                  </span>
                  <NIcon :component="DocumentText" :size="16" :class="isDark ? 'text-gray-600' : 'text-gray-400'" />
                </div>
                <p class="text-xs font-mono mb-2" :class="isDark ? 'text-gray-500' : 'text-gray-500'">{{ article.date }}</p>
                <div class="flex gap-2">
                  <span v-for="tag in article.tags" :key="tag" 
                    class="px-1.5 py-0.5 text-xs font-mono border"
                    :class="isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'">
                    {{ tag }}
                  </span>
                </div>
              </a>
            </div>
          </section>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-8 text-center border-t" :class="isDark ? 'border-gray-800 text-gray-600' : 'border-gray-200 text-gray-400'">
        <p class="text-xs font-mono">© 2026</p>
      </footer>
    </div>
  </NConfigProvider>
</template>
