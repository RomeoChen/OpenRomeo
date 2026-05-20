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

      <!-- Main -->
      <main class="pt-20 pb-16">
        <div class="flex">

          <!-- Left Sidebar: Project Switcher -->
          <aside class="w-72 shrink-0 border-r min-h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto"
            :class="isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'">
            
            <!-- Back -->
            <div class="p-4 border-b" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
              <a href="/" class="flex items-center gap-2 text-xs font-mono hover:opacity-60 transition"
                :class="isDark ? 'text-green-500' : 'text-green-600'">
                <NIcon :component="ArrowBack" :size="14" />
                <span>← 首页</span>
              </a>
            </div>

            <!-- Projects Header -->
            <div class="p-4">
              <h2 class="text-xs font-mono uppercase tracking-wider mb-1"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                ## Projects
              </h2>
              <p class="text-xs font-mono" :class="isDark ? 'text-gray-600' : 'text-gray-500'">
                {{ projects.length }} 个项目
              </p>
            </div>

            <!-- Project List -->
            <nav class="px-2 pb-4">
              <button
                v-for="p in projects"
                :key="p.slug"
                @click="selectProject(p.slug)"
                class="w-full flex items-start gap-3 p-3 rounded-lg mb-1 transition text-left"
                :class="[
                  activeSlug === p.slug
                    ? (isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200')
                    : (isDark ? 'hover:bg-gray-900 border border-transparent' : 'hover:bg-gray-50 border border-transparent')
                ]"
              >
                <!-- Color dot -->
                <span class="shrink-0 w-2.5 h-2.5 rounded-full mt-1.5"
                  :style="{ backgroundColor: getAccentColor(p.accentColor) }">
                </span>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-mono font-medium leading-snug"
                    :class="activeSlug === p.slug
                      ? 'text-green-400'
                      : (isDark ? 'text-gray-300' : 'text-gray-700')">
                    {{ p.title }}
                  </div>
                  <div class="text-xs mt-0.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                    {{ p.subtitle }}
                  </div>
                </div>
              </button>
            </nav>
          </aside>

          <!-- Right: Project Detail -->
          <div class="flex-1 min-w-0">
            <div v-if="activeProject" class="p-8 max-w-4xl">
              <!-- Project Header -->
              <div class="mb-8">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    :class="isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-100 border border-gray-200'">
                    🔬
                  </div>
                  <div>
                    <h1 class="text-xl font-mono font-bold"
                      :class="isDark ? 'text-gray-100' : 'text-gray-900'">
                      {{ activeProject.title }}
                    </h1>
                    <p class="text-xs font-mono" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                      {{ activeProject.subtitle }}
                    </p>
                  </div>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span v-for="tag in activeProject.tags" :key="tag"
                    class="px-2 py-1 text-xs font-mono rounded border"
                    :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'">
                    {{ tag }}
                  </span>
                </div>

                <p class="text-sm font-mono leading-relaxed max-w-2xl"
                  :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ activeProject.description }}
                </p>

                <!-- CTA -->
                <a :href="activeProject.route"
                  class="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg text-sm font-mono font-medium transition"
                  :class="isDark
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-green-600 hover:bg-green-500 text-white'">
                  <NIcon :component="Rocket" :size="14" />
                  打开项目
                  <NIcon :component="OpenOutline" :size="12" />
                </a>
              </div>

              <!-- Highlight Banner -->
              <div class="mb-8 p-4 rounded-xl border"
                :class="isDark ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-200'">
                <p class="text-xs font-mono" :class="isDark ? 'text-green-400' : 'text-green-600'">
                  ✦ {{ activeProject.highlight }}
                </p>
              </div>

              <!-- Features Grid -->
              <div class="mb-8">
                <h3 class="text-xs font-mono uppercase tracking-wider mb-4"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  ## 核心功能
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div v-for="f in activeProject.features" :key="f.label"
                    class="p-4 rounded-xl border"
                    :class="isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'">
                    <div class="text-sm font-mono font-medium mb-2"
                      :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                      {{ f.label }}
                    </div>
                    <div class="text-xs font-mono leading-relaxed"
                      :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                      {{ f.description }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tech Stack -->
              <div class="mb-8">
                <h3 class="text-xs font-mono uppercase tracking-wider mb-4"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  ## 技术栈
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="t in activeProject.tech" :key="t"
                    class="px-3 py-1.5 text-xs font-mono rounded-full border"
                    :class="isDark ? 'border-gray-700 text-gray-300 bg-gray-900/50' : 'border-gray-200 text-gray-600 bg-gray-50'">
                    {{ t }}
                  </span>
                </div>
              </div>

              <!-- Screenshots placeholder -->
              <div class="mb-8">
                <h3 class="text-xs font-mono uppercase tracking-wider mb-4"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  ## 截图
                </h3>
                <div class="rounded-xl border overflow-hidden h-64 flex items-center justify-center"
                  :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'">
                  <div class="text-center">
                    <p class="text-4xl mb-2">{{ getEmoji(activeProject.slug) }}</p>
                    <p class="text-xs font-mono" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                      截图待补充 · <a :href="activeProject.route" class="text-green-500 underline">打开项目查看</a>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Other Projects -->
              <div class="pt-6 border-t" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
                <h3 class="text-xs font-mono uppercase tracking-wider mb-4"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  ## 其他项目
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    v-for="p in otherProjects"
                    :key="p.slug"
                    @click="selectProject(p.slug)"
                    class="flex items-center gap-3 p-4 rounded-xl border text-left transition hover:border-green-500/30"
                    :class="isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'">
                    <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      :style="{ backgroundColor: getAccentColor(p.accentColor) + '20', color: getAccentColor(p.accentColor) }">
                      {{ getEmoji(p.slug) }}
                    </span>
                    <div>
                      <div class="text-xs font-mono font-medium"
                        :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                        {{ p.title }}
                      </div>
                      <div class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                        {{ p.subtitle }}
                      </div>
                    </div>
                    <NIcon :component="ChevronForward" :size="14"
                      class="ml-auto text-gray-500 shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty: show overview -->
            <div v-else class="p-8">
              <div class="mb-6">
                <div class="flex items-center gap-2 text-xs font-mono mb-4"
                  :class="isDark ? 'text-green-500' : 'text-green-600'">
                  <NIcon :component="CodeSlash" :size="14" />
                  <span>~/projects</span>
                </div>
                <h1 class="text-2xl font-mono font-bold mb-3"
                  :class="isDark ? 'text-gray-100' : 'text-gray-900'">
                  Projects
                </h1>
                <p class="text-sm font-mono"
                  :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ projects.length }} 个项目，涵盖可视化、推荐系统、学习工具等领域。
                </p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  v-for="p in projects"
                  :key="p.slug"
                  @click="selectProject(p.slug)"
                  class="p-5 rounded-xl border text-left transition hover:border-green-500/40 group"
                  :class="isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'">
                  <div class="flex items-start justify-between mb-3">
                    <span class="text-2xl">{{ getEmoji(p.slug) }}</span>
                    <NIcon :component="ArrowForward" :size="16"
                      class="text-gray-500 group-hover:text-green-500 transition" />
                  </div>
                  <div class="text-sm font-mono font-medium mb-1"
                    :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                    {{ p.title }}
                  </div>
                  <div class="text-xs mb-3" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                    {{ p.description.slice(0, 60) }}...
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tag in p.tags.slice(0, 2)" :key="tag"
                      class="px-1.5 py-0.5 text-xs font-mono rounded"
                      :class="isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'">
                      {{ tag }}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NConfigProvider, NIcon, darkTheme, NAvatar, NSwitch } from 'naive-ui'
import {
  Sunny, Moon, LogoGithub, ArrowBack, ArrowForward, ChevronForward,
  CodeSlash, Rocket, OpenOutline
} from '@vicons/ionicons5'
import { projects } from '../data/projects'

const isDark = ref(true)

const activeSlug = ref<string | null>(null)

const activeProject = computed(() => {
  if (!activeSlug.value) return null
  return projects.find(p => p.slug === activeSlug.value) ?? null
})

const otherProjects = computed(() =>
  projects.filter(p => p.slug !== activeSlug.value)
)

function selectProject(slug: string) {
  activeSlug.value = slug
}

function getAccentColor(colorClass: string): string {
  const map: Record<string, string> = {
    'text-cyan-400': '#22d3ee',
    'text-purple-400': '#c084fc',
    'text-amber-400': '#fbbf24',
    'text-green-400': '#4ade80',
  }
  return map[colorClass] ?? '#22c55e'
}

function getEmoji(slug: string): string {
  const map: Record<string, string> = {
    'disease-network': '🔬',
    'disease-3d': '🌐',
    'recommendation': '💡',
    'quiz': '🚀',
  }
  return map[slug] ?? '📦'
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
