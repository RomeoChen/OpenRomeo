<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { NConfigProvider, NIcon, darkTheme } from 'naive-ui'
import { Sunny, Moon, LogoGithub, ArrowBack, Calendar, Pricetag } from '@vicons/ionicons5'
import { articles } from '../data/articles'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const isDark = ref(true)
const route = useRoute()

const article = computed(() => {
  const slug = route.params.slug as string
  return articles.find(a => a.slug === slug)
})

const renderedContent = computed(() => {
  return article.value ? md.render(article.value.content) : ''
})

const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#22c55e',
    primaryColorHover: '#4ade80',
    primaryColorPressed: '#16a34a',
    borderRadius: '4px',
  }
}))
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <div class="min-h-screen" :class="isDark ? 'bg-black text-gray-300' : 'bg-white text-gray-700'">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 border-b" 
        :class="isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <!-- Main -->
      <main class="pt-20 pb-16 px-6">
        <div class="max-w-5xl mx-auto flex gap-8">
          <!-- Left: Article Menu -->
          <aside class="w-64 shrink-0 hidden md:block">
            <div class="fixed top-20 overflow-y-auto max-h-[calc(100vh-6rem)] w-64 pr-4">
              <a href="/" class="flex items-center gap-2 text-xs font-mono mb-4 hover:opacity-60" 
                :class="isDark ? 'text-green-500' : 'text-green-600'">
                <NIcon :component="ArrowBack" :size="14" />
                <span>← Back</span>
              </a>
              <h3 class="text-xs font-mono uppercase tracking-wider mb-3" 
                :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                ## Articles
              </h3>
              <div class="space-y-1">
                <a v-for="a in articles" :key="a.slug" 
                  :href="'/article/' + a.slug"
                  class="block text-xs font-mono py-1.5 px-2 rounded transition"
                  :class="[
                    a.slug === article?.slug 
                      ? (isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900')
                      : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900')
                  ]">
                  {{ a.title }}
                </a>
              </div>
            </div>
          </aside>

          <!-- Right: Article Content -->
          <article class="flex-1 min-w-0">
            <div v-if="article" class="max-w-3xl">
              <div class="mb-8">
                <h1 class="text-2xl font-mono font-bold mb-3" :class="isDark ? 'text-gray-100' : 'text-gray-900'">
                  {{ article.title }}
                </h1>
                <div class="flex items-center gap-4 text-xs font-mono" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  <span class="flex items-center gap-1">
                    <NIcon :component="Calendar" :size="12" />
                    {{ article.date }}
                  </span>
                  <span class="flex items-center gap-1">
                    <NIcon :component="Pricetag" :size="12" />
                    {{ article.tags.join(', ') }}
                  </span>
                </div>
              </div>
              <div class="markdown-body font-mono text-sm leading-relaxed"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                v-html="renderedContent">
              </div>
            </div>
            <div v-else class="text-center py-20">
              <p class="font-mono text-gray-500">Article not found</p>
            </div>
          </article>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-8 text-center border-t" :class="isDark ? 'border-gray-800 text-gray-600' : 'border-gray-200 text-gray-400'">
        <p class="text-xs font-mono">© 2026</p>
      </footer>
    </div>
  </NConfigProvider>
</template>

<style>
.markdown-body h1 { font-size: 1.5rem; font-weight: bold; margin: 1.5rem 0 1rem; }
.markdown-body h2 { font-size: 1.25rem; font-weight: bold; margin: 1.25rem 0 0.75rem; }
.markdown-body h3 { font-size: 1.1rem; font-weight: bold; margin: 1rem 0 0.5rem; }
.markdown-body p { margin: 0.75rem 0; }
.markdown-body ul, .markdown-body ol { margin: 0.75rem 0; padding-left: 1.5rem; }
.markdown-body li { margin: 0.25rem 0; }
.markdown-body code { 
  background: rgba(34, 197, 94, 0.15); 
  padding: 0.15rem 0.35rem; 
  border-radius: 3px; 
  font-size: 0.85em;
}
.markdown-body pre { 
  background: rgba(34, 197, 94, 0.1); 
  padding: 1rem; 
  border-radius: 4px; 
  overflow-x: auto;
  margin: 1rem 0;
}
.markdown-body pre code { 
  background: none; 
  padding: 0; 
}
.markdown-body a { 
  color: #22c55e; 
  text-decoration: underline;
}
.markdown-body blockquote {
  border-left: 3px solid #22c55e;
  padding-left: 1rem;
  margin: 1rem 0;
  opacity: 0.8;
}
</style>
