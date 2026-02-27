<script setup lang="ts">
import { ref, computed } from 'vue'
import { NConfigProvider, NButton, NCard, NIcon, NSwitch, NAvatar, NBadge } from 'naive-ui'
import { Sunny, Moon, LogoLogoGithub, Twitter, Mail, CodeSlash, Rocket } from '@vicons/ionicons5'

const isDark = ref(true)
const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#6366f1',
    primaryColorHover: '#818cf8',
    primaryColorPressed: '#4f46e5',
    borderRadius: '12px',
  },
  Card: {
    borderRadius: '16px',
  },
  Button: {
    borderRadiusMedium: '10px',
  }
}))

const projects = [
  { name: 'OpenRomeo', desc: 'Personal website built with Vue 3', tags: ['Vue', 'TypeScript'], color: '#6366f1' },
  { name: 'AI CodeReview', desc: 'AI-powered code review tool', tags: ['AI', 'Python'], color: '#10b981' },
  { name: 'Vite Plugin', desc: 'Auto import plugin for Vite', tags: ['Vite', 'TypeScript'], color: '#f59e0b' },
]

const skills = ['Vue 3', 'TypeScript', 'Node.js', 'Python', 'Git', 'Docker']

const avatarStyle = computed(() => ({ backgroundColor: '#6366f1' }))
</script>

<template>
  <NConfigProvider :theme="isDark ? 'dark' : null" :theme-overrides="themeOverrides">
    <div class="min-h-screen transition-colors duration-300" :class="isDark ? 'bg-gray-950' : 'bg-gray-50'">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" 
        :class="isDark ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NAvatar :size="36" round :style="avatarStyle">R</NAvatar>
            <span class="font-bold text-xl" :class="isDark ? 'text-white' : 'text-gray-900'">Romeo</span>
          </div>
          <div class="flex items-center gap-4">
            <a :href="'https://github.com/RomeoChen'" target="_blank" class="p-2 rounded-lg hover:bg-gray-800 transition">
              <NIcon :component="LogoGithub" :size="20" />
            </a>
            <NSwitch v-model:value="isDark" :round="false">
              <template #checked>
                <NIcon :component="Moon" :size="14" />
              </template>
              <template #unchecked>
                <NIcon :component="Sunny" :size="14" />
              </template>
            </NSwitch>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <main class="pt-32 pb-20 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-20">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
              :class="isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'">
              <NIcon :component="CodeSlash" :size="16" />
              <span>Full Stack Developer</span>
            </div>
            <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Building the future,<br />one line at a time.
            </h1>
            <p class="text-lg max-w-2xl mx-auto mb-8" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Hi, I'm Romeo. A passionate developer who loves building cool things with code.
              Currently focused on Vue, TypeScript, and AI-powered applications.
            </p>
            <div class="flex items-center justify-center gap-4">
              <NButton type="primary" size="large" ghost>
                <template #icon>
                  <NIcon :component="Rocket" />
                </template>
                View Projects
              </NButton>
              <NButton size="large" ghost>
                <template #icon>
                  <NIcon :component="LogoGithub" />
                </template>
                GitHub
              </NButton>
            </div>
          </div>

          <!-- Skills -->
          <section class="mb-16">
            <h2 class="text-2xl font-bold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">Skills</h2>
            <div class="flex flex-wrap gap-3">
              <NCard v-for="skill in skills" :key="skill" size="small" class="hover:scale-105 transition-transform cursor-default">
                {{ skill }}
              </NCard>
            </div>
          </section>

          <!-- Projects -->
          <section>
            <h2 class="text-2xl font-bold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">Featured Projects</h2>
            <div class="grid md:grid-cols-3 gap-6">
              <NCard v-for="project in projects" :key="project.name" hoverable>
                <template #header>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-lg" :class="isDark ? 'text-white' : 'text-gray-900'">{{ project.name }}</span>
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: project.color }"></div>
                  </div>
                </template>
                <p class="mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ project.desc }}</p>
                <div class="flex gap-2">
                  <NBadge v-for="tag in project.tags" :key="tag" :type="'info'" :value="tag" />
                </div>
              </NCard>
            </div>
          </section>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-8 text-center" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
        <p>© 2026 Romeo. Built with Vue 3 & Naive UI.</p>
      </footer>
    </div>
  </NConfigProvider>
</template>

<style scoped>
</style>
