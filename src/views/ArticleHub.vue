<template>
  <NConfigProvider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <div class="min-h-screen" :class="isDark ? 'bg-black text-gray-300' : 'bg-white text-gray-700'">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 border-b" 
        :class="isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NAvatar :size="32" round :style="{ backgroundColor: '#22c55e' }">R</NAvatar>
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

      <!-- Main: Sidebar + Content -->
      <main class="pt-20 pb-16">
        <div class="flex">
          <!-- Left Sidebar: Article Switcher -->
          <aside class="w-72 shrink-0 border-r min-h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto"
            :class="isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'">
            
            <!-- Back to Home -->
            <div class="p-4 border-b" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
              <a href="/" class="flex items-center gap-2 text-xs font-mono hover:opacity-60 transition"
                :class="isDark ? 'text-green-500' : 'text-green-600'">
                <NIcon :component="ArrowBack" :size="14" />
                <span>← 首页</span>
              </a>
            </div>

            <!-- Articles Header -->
            <div class="p-4">
              <h2 class="text-xs font-mono uppercase tracking-wider mb-3"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                ## 学习笔记
              </h2>
              <p class="text-xs font-mono" :class="isDark ? 'text-gray-600' : 'text-gray-500'">
                {{ articles.length }} 篇文章
              </p>
            </div>

            <!-- Article List -->
            <nav class="px-2 pb-4">
              <a
                v-for="article in articles"
                :key="article.slug"
                :href="'/article/' + article.slug"
                class="flex items-start gap-3 p-3 rounded-lg mb-1 transition group"
                :class="[
                  activeSlug === article.slug
                    ? (isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200')
                    : (isDark ? 'hover:bg-gray-900 border border-transparent' : 'hover:bg-gray-50 border border-transparent')
                ]"
              >
                <!-- Article icon -->
                <span class="shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs mt-0.5"
                  :class="activeSlug === article.slug
                    ? 'bg-green-500/20 text-green-400'
                    : (isDark ? 'bg-gray-800 text-gray-500 group-hover:bg-gray-700' : 'bg-gray-100 text-gray-400')">
                  <NIcon :component="DocumentText" :size="12" />
                </span>

                <!-- Article info -->
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-mono font-medium leading-snug truncate"
                    :class="activeSlug === article.slug
                      ? 'text-green-400'
                      : (isDark ? 'text-gray-300 group-hover:text-gray-100' : 'text-gray-700 group-hover:text-gray-900')">
                    {{ article.title }}
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                      {{ article.date }}
                    </span>
                    <span v-if="getArticleHasQuestions(article.slug)" 
                      class="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                      练习
                    </span>
                  </div>
                </div>

                <!-- Arrow -->
                <NIcon :component="ChevronForward" :size="14"
                  class="shrink-0 mt-1 opacity-40"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
              </a>
            </nav>
          </aside>

          <!-- Right Content: Article Overview / First Article -->
          <div class="flex-1 min-w-0">
            <div v-if="!activeSlug" class="p-8 max-w-3xl">
              <!-- Hero Section -->
              <div class="mb-10">
                <div class="flex items-center gap-2 text-xs font-mono mb-4"
                  :class="isDark ? 'text-green-500' : 'text-green-600'">
                  <NIcon :component="Book" :size="14" />
                  <span>~/articles</span>
                </div>
                <h1 class="text-3xl font-mono font-bold mb-4"
                  :class="isDark ? 'text-gray-100' : 'text-gray-900'">
                  学习笔记
                </h1>
                <p class="text-sm font-mono leading-relaxed max-w-xl"
                  :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  记录前端学习、求职准备、AI前沿知识的笔记与实践。
                  每篇文章配有练习题，帮助巩固知识。
                </p>
              </div>

              <!-- Quick Access Cards -->
              <div class="mb-10">
                <h3 class="text-xs font-mono uppercase tracking-wider mb-4"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  ## 最近文章
                </h3>
                <div class="grid grid-cols-1 gap-3">
                  <a v-for="article in articles.slice(0, 4)" :key="article.slug"
                    :href="'/article/' + article.slug"
                    class="block p-4 rounded-xl border transition hover:border-green-500/50 group"
                    :class="isDark ? 'bg-gray-900/50 border-gray-800 hover:bg-gray-900' : 'bg-gray-50 border-gray-200 hover:bg-white'">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="text-sm font-mono font-medium"
                        :class="isDark ? 'text-gray-200 group-hover:text-green-400' : 'text-gray-800 group-hover:text-green-600'">
                        {{ article.title }}
                      </h4>
                      <NIcon :component="ArrowForward" :size="14"
                        class="shrink-0 mt-0.5 text-gray-400 group-hover:text-green-500 transition" />
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-mono" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                        {{ article.date }}
                      </span>
                      <div class="flex gap-1.5">
                        <span v-for="tag in article.tags" :key="tag"
                          class="px-1.5 py-0.5 text-xs font-mono rounded"
                          :class="isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'">
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              <!-- All Tags -->
              <div>
                <h3 class="text-xs font-mono uppercase tracking-wider mb-4"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  ## 标签分类
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in allTags" :key="tag.name"
                    class="px-3 py-1.5 text-xs font-mono rounded-full border transition hover:border-green-500/50 cursor-pointer"
                    :class="isDark
                      ? 'border-gray-700 text-gray-400 hover:text-green-400 hover:border-green-500/30'
                      : 'border-gray-200 text-gray-500 hover:text-green-600 hover:border-green-300'"
                    @click="filterByTag(tag.name)">
                    {{ tag.name }}
                    <span class="ml-1 opacity-50">{{ tag.count }}</span>
                  </span>
                </div>
              </div>

              <!-- Tag Filtered Results -->
              <div v-if="filteredByTag.length > 0" class="mt-6 pt-6 border-t"
                :class="isDark ? 'border-gray-800' : 'border-gray-200'">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-xs font-mono" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    标签「{{ activeTagFilter }}」下的文章
                  </h4>
                  <button @click="activeTagFilter = ''"
                    class="text-xs font-mono text-red-400 hover:text-red-300">
                    清除筛选
                  </button>
                </div>
                <div class="space-y-2">
                  <a v-for="article in filteredByTag" :key="article.slug"
                    :href="'/article/' + article.slug"
                    class="flex items-center gap-3 p-3 rounded-lg transition"
                    :class="isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'">
                    <NIcon :component="DocumentText" :size="14"
                      :class="isDark ? 'text-gray-600' : 'text-gray-400'" />
                    <span class="text-xs font-mono"
                      :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                      {{ article.title }}
                    </span>
                    <span class="ml-auto text-xs" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                      {{ article.date }}
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Active Article Redirect -->
            <div v-else class="p-8 text-center">
              <p class="font-mono text-sm mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                正在跳转到文章...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NConfigProvider, NIcon, darkTheme, NAvatar, NSwitch } from 'naive-ui'
import {
  Sunny, Moon, LogoGithub, ArrowBack, DocumentText, ChevronForward,
  ArrowForward, Book
} from '@vicons/ionicons5'
import { articles } from '../data/articles'

const isDark = ref(true)
const route = useRoute()
const router = useRouter()

// Active tag filter
const activeTagFilter = ref('')

// Get active article slug from URL
const activeSlug = computed(() => route.params.slug as string | undefined)

// Redirect to first article if no slug
onMounted(() => {
  if (!route.params.slug && articles.length > 0) {
    router.replace('/article/' + articles[0].slug)
  }
})

// Computed: all unique tags with counts
const allTags = computed(() => {
  const tagMap: Record<string, number> = {}
  for (const article of articles) {
    for (const tag of article.tags) {
      tagMap[tag] = (tagMap[tag] || 0) + 1
    }
  }
  return Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// Articles filtered by selected tag
const filteredByTag = computed(() => {
  if (!activeTagFilter.value) return []
  return articles.filter(a => a.tags.includes(activeTagFilter.value))
})

function filterByTag(tagName: string) {
  activeTagFilter.value = activeTagFilter.value === tagName ? '' : tagName
}

// Check if an article has questions
function getArticleHasQuestions(slug: string): boolean {
  return slug.includes('面试') || slug.includes('求职') || slug.includes('Week')
}

const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#22c55e',
    primaryColorHover: '#4ade80',
    primaryColorPressed: '#16a34a',
    borderRadius: '4px',
  }
}))
</script>
