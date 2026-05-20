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

          <!-- Learning Hub -->
          <section class="mb-8">
            <h2 class="text-xs font-mono uppercase tracking-wider mb-4" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              ## Learning
            </h2>
            <a href="/articles"
              class="block p-5 border-2 border-green-500/30 rounded-xl transition hover:border-green-500/60"
              :class="isDark ? 'bg-green-500/5' : 'bg-green-500/5'">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <span class="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                    <NIcon :component="Book" :size="20" />
                  </span>
                  <div>
                    <span class="font-mono text-base font-bold text-green-400">
                      学习笔记
                    </span>
                    <p class="text-xs font-mono mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                      {{ articles.length }} 篇文章 · 前端 · AI · 求职
                    </p>
                  </div>
                </div>
                <NIcon :component="ArrowForward" :size="18" class="text-green-500/60 mt-1" />
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 text-xs font-mono border border-green-500/30 text-green-500 rounded">
                  {{ articles.length }} 篇文章
                </span>
                <span v-for="tag in uniqueTags" :key="tag" 
                  class="px-2 py-1 text-xs font-mono border"
                  :class="isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'">
                  {{ tag }}
                </span>
              </div>
            </a>
          </section>

          <!-- Projects Hub -->
          <section class="mb-8">
            <h2 class="text-xs font-mono uppercase tracking-wider mb-4" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              ## Projects
            </h2>
            <a href="/projects"
              class="block p-5 border-2 border-cyan-500/30 rounded-xl transition hover:border-cyan-500/60"
              :class="isDark ? 'bg-cyan-500/5' : 'bg-cyan-500/5'">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <span class="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <NIcon :component="Cube" :size="20" />
                  </span>
                  <div>
                    <span class="font-mono text-base font-bold text-cyan-400">
                      项目集
                    </span>
                    <p class="text-xs font-mono mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                      {{ projectCount }} 个项目 · 可视化 · 推荐系统 · 学习工具
                    </p>
                  </div>
                </div>
                <NIcon :component="ArrowForward" :size="18" class="text-cyan-500/60 mt-1" />
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 text-xs font-mono border border-cyan-500/30 text-cyan-400 rounded">🔬 慢病共病网络图</span>
                <span class="px-2 py-1 text-xs font-mono border border-cyan-500/30 text-cyan-400 rounded">🌐 慢病 3D 星图</span>
                <span class="px-2 py-1 text-xs font-mono border border-cyan-500/30 text-cyan-400 rounded">💡 慢病干预推荐</span>
                <span class="px-2 py-1 text-xs font-mono border" :class="isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'">+ 1 更多</span>
              </div>
            </a>
          </section>

          <!-- Tools -->
          <section class="mb-16">
            <h2 class="text-xs font-mono uppercase tracking-wider mb-4" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              ## Tools
            </h2>
            <a href="/quiz"
              class="block p-4 border-2 border-green-500/30 rounded-xl transition hover:border-green-500/60"
              :class="isDark ? 'bg-green-500/5' : 'bg-green-500/5'">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <NIcon :component="Flash" :size="20" class="text-green-500" />
                  <div>
                    <span class="font-mono text-sm font-bold" :class="isDark ? 'text-green-400' : 'text-green-600'">
                      前端求职刷题练习
                    </span>
                    <p class="text-xs font-mono mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                      8周学习计划 · 55+道面试题 · 即时判分
                    </p>
                  </div>
                </div>
                <NIcon :component="ArrowForward" :size="16" class="text-green-500/60 mt-1" />
              </div>
            </a>
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NConfigProvider, NButton, NIcon, NSwitch, NAvatar, darkTheme } from 'naive-ui'
import {
  Sunny, Moon, LogoGithub, CodeSlash, Flash, Book, ArrowForward, Cube
} from '@vicons/ionicons5'
import { articles } from '../data/articles'
import { projects } from '../data/projects'

const isDark = ref(true)
const projectCount = projects.length

const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#22c55e',
    primaryColorHover: '#4ade80',
    primaryColorPressed: '#16a34a',
    borderRadius: '4px',
  }
}))

const avatarStyle = computed(() => ({ backgroundColor: '#22c55e' }))

const uniqueTags = computed(() => {
  const tagSet = new Set<string>()
  articles.forEach(a => a.tags.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).slice(0, 6)
})
</script>
