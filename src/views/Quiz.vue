<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NConfigProvider, NButton, NIcon, NProgress, NTag, NSwitch, NAvatar, darkTheme } from 'naive-ui'
import { Sunny, Moon, LogoGithub, ArrowBack, ChevronBack, ChevronForward, Checkmark, Eye, Refresh } from '@vicons/ionicons5'
import { questions, type Question, type QuizProgress } from '../data/questions'

// ── State ──────────────────────────────────────────
const isDark = ref(true)
const currentIndex = ref(0)
const answered = ref<Record<string, boolean>>({})
const selectedSingle = ref<number | null>(null)
const selectedMultiple = ref<number[]>([])
const freeAnswer = ref('')
const showAnswer = ref(false)
const isTransitioning = ref(false)
const showCorrectness = ref(false) // 点击选项后立即显示对错

// ── Theme ────────────────────────────────────────────
const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#22c55e',
    primaryColorHover: '#4ade80',
    primaryColorPressed: '#16a34a',
    borderRadius: '4px',
  }
}))

// ── Quiz Data ────────────────────────────────────────
const currentQ = computed<Question | null>(() => questions[currentIndex.value] ?? null)

const filteredQuestions = computed(() => questions)

// ── Progress ─────────────────────────────────────────
const answeredCount = computed(() => Object.keys(answered.value).length)
const totalCount = computed(() => questions.length)
const progressPercent = computed(() => Math.round((answeredCount.value / totalCount.value) * 100))

// ── Week/Tags colors ─────────────────────────────────
const weekColors: Record<number, string> = {
  1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e',
  5: '#06b6d4', 6: '#3b82f6', 7: '#8b5cf6', 8: '#ec4899'
}

const topicColors: Record<string, string> = {
  '闭包': '#ef4444', '原型链': '#f97316', 'Event Loop': '#eab308',
  'Promise': '#22c55e', 'TypeScript类型': '#06b6d4', 'TypeScript泛型': '#06b6d4',
  'Flex布局': '#3b82f6', 'Grid布局': '#3b82f6', 'BFC': '#3b82f6',
  '二叉树遍历': '#8b5cf6', 'React Fiber': '#ec4899', 'React Diff': '#ec4899',
  'React Hooks': '#ec4899', '动态规划': '#06b6d4', '图算法': '#3b82f6',
  'Vue3响应式': '#22c55e', 'Prompt Engineering': '#8b5cf6', 'RAG全流程': '#ef4444',
  'RAG优化': '#ef4444', 'Function Calling': '#f97316', 'ReAct Agent': '#f97316',
  'MCP协议': '#f97316', '浏览器渲染': '#eab308', 'STAR法则': '#22c55e',
  '系统设计': '#8b5cf6', '简历优化': '#3b82f6', '面试技巧': '#06b6d4',
  '自我介绍': '#ec4899'
}

// ── LocalStorage ─────────────────────────────────────
const STORAGE_KEY = 'open-romeo-quiz-progress'

function saveProgress() {
  const progress: QuizProgress = {
    currentIndex: currentIndex.value,
    answered: answered.value
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const p: QuizProgress = JSON.parse(raw)
    currentIndex.value = p.currentIndex ?? 0
    answered.value = p.answered ?? {}
  } catch {}
}

// ── Actions ──────────────────────────────────────────
function markAnswered() {
  if (!currentQ.value) return
  answered.value[currentQ.value.id] = true
  saveProgress()
}

function handleSingleSelect(idx: number) {
  selectedSingle.value = idx
  showCorrectness.value = true
  markAnswered()
}

function handleMultipleToggle(idx: number) {
  const i = selectedMultiple.value.indexOf(idx)
  if (i === -1) {
    selectedMultiple.value = [...selectedMultiple.value, idx]
  } else {
    selectedMultiple.value = selectedMultiple.value.filter(v => v !== idx)
  }
  if (selectedMultiple.value.length > 0) {
    showCorrectness.value = true
    markAnswered()
  }
}

function handleFreeInput() {
  if (freeAnswer.value.trim().length > 0) {
    showCorrectness.value = true
    markAnswered()
  }
}

function goTo(index: number) {
  if (index < 0 || index >= questions.length) return
  isTransitioning.value = true
  setTimeout(() => {
    currentIndex.value = index
    selectedSingle.value = null
    selectedMultiple.value = []
    freeAnswer.value = ''
    showAnswer.value = false
    showCorrectness.value = false
    isTransitioning.value = false
    saveProgress()
  }, 120)
}

function prev() {
  goTo(currentIndex.value - 1)
}

function next() {
  goTo(currentIndex.value + 1)
}

function toggleAnswer() {
  showAnswer.value = !showAnswer.value
}

function resetProgress() {
  if (!confirm('确定要重置所有进度吗？')) return
  currentIndex.value = 0
  answered.value = {}
  selectedSingle.value = null
  selectedMultiple.value = []
  freeAnswer.value = ''
  showAnswer.value = false
  saveProgress()
}

function jumpToWeek(week: number) {
  const idx = questions.findIndex(q => q.week === week)
  if (idx !== -1) goTo(idx)
}

// ── Question type label ──────────────────────────────
function typeLabel(type: string) {
  if (type === 'single') return '单选'
  if (type === 'multiple') return '多选'
  return '自由回答'
}

// ── Correctness feedback ─────────────────────────────
// Maps option index → 'correct' | 'wrong' | null
const optionCorrectness = computed(() => {
  if (!showCorrectness.value || !currentQ.value) return null
  if (currentQ.value.type === 'free') return null
  const correct = currentQ.value.correctAnswer ?? []
  const selected = currentQ.value.type === 'single'
    ? (selectedSingle.value !== null ? [selectedSingle.value] : [])
    : selectedMultiple.value
  return (idx: number) => {
    if (correct.includes(idx)) return 'correct'
    if (selected.includes(idx)) return 'wrong'
    return null
  }
})

// Keyboard nav handled in handleKeydown
// ── Watch for keyboard nav ──────────────────────────
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) toggleAnswer()
}

// ── Lifecycle ────────────────────────────────────────
onMounted(() => {
  loadProgress()
  window.addEventListener('keydown', handleKeydown)
})
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <div class="min-h-screen" :class="isDark ? 'bg-black text-gray-300' : 'bg-white text-gray-700'">
      
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 border-b"
        :class="isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'">
        <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="/" class="flex items-center gap-2 text-xs font-mono hover:opacity-60 transition"
              :class="isDark ? 'text-green-500' : 'text-green-600'">
              <NIcon :component="ArrowBack" :size="14" />
              <span class="hidden sm:inline">← 首页</span>
            </a>
            <span class="text-gray-500">|</span>
            <NAvatar :size="28" round :style="{ backgroundColor: '#22c55e' }">R</NAvatar>
            <span class="font-mono text-sm font-medium" :class="isDark ? 'text-gray-100' : 'text-gray-900'">
              刷题练习
            </span>
          </div>
          <div class="flex items-center gap-3">
            <NTag size="small" :bordered="false">
              <span class="font-mono text-xs">
                {{ answeredCount }} / {{ totalCount }} 已答
              </span>
            </NTag>
            <a :href="'https://github.com/RomeoChen'" target="_blank" class="p-1 hover:opacity-60 transition">
              <NIcon :component="LogoGithub" :size="18" />
            </a>
            <NSwitch v-model:value="isDark" :round="false" size="small">
              <template #checked><NIcon :component="Moon" :size="10" /></template>
              <template #unchecked><NIcon :component="Sunny" :size="10" /></template>
            </NSwitch>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="pt-20 pb-16 px-4">
        <div class="max-w-3xl mx-auto">
          
          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                学习进度
              </span>
              <span class="text-xs font-mono" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                {{ progressPercent }}%
              </span>
            </div>
            <NProgress
              type="line"
              :percentage="progressPercent"
              :show-indicator="false"
              :height="6"
              :border-radius="3"
              :fill-border-radius="3"
              :color="'#22c55e'"
              :rail-color="isDark ? '#1f2937' : '#e5e7eb'"
            />
          </div>

          <!-- Week Jump -->
          <div class="flex items-center gap-2 mb-6 flex-wrap">
            <span class="text-xs font-mono" :class="isDark ? 'text-gray-500' : 'text-gray-400'">快速跳转：</span>
            <button
              v-for="w in 8"
              :key="w"
              @click="jumpToWeek(w)"
              class="px-2 py-1 text-xs font-mono rounded border transition hover:opacity-80"
              :style="{
                borderColor: weekColors[w],
                color: weekColors[w],
                backgroundColor: isDark ? `${weekColors[w]}15` : `${weekColors[w]}10`
              }">
              W{{ w }}
            </button>
            <button
              @click="resetProgress"
              class="px-2 py-1 text-xs font-mono rounded border border-gray-600 text-gray-500 hover:border-gray-500 transition ml-2">
              <NIcon :component="Refresh" :size="10" class="inline" /> 重置
            </button>
          </div>

          <!-- Question Card -->
          <div v-if="currentQ" class="transition-opacity duration-200" :class="isTransitioning ? 'opacity-0' : 'opacity-100'">
            
            <!-- Question Header -->
            <div class="flex items-start gap-3 mb-5">
              <div class="flex flex-col items-center gap-1 shrink-0">
                <span class="text-xs font-mono font-bold" :style="{ color: weekColors[currentQ.week] }">
                  W{{ currentQ.week }}
                </span>
                <span class="text-xs font-mono text-gray-500">
                  {{ currentIndex + 1 }}/{{ totalCount }}
                </span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <NTag size="small" :style="{ backgroundColor: `${topicColors[currentQ.topic] || '#6b7280'}20`, color: topicColors[currentQ.topic] || '#6b7280', border: 'none' }">
                    {{ currentQ.topic }}
                  </NTag>
                  <NTag size="small" :bordered="false" :type="currentQ.type === 'single' ? 'info' : currentQ.type === 'multiple' ? 'warning' : 'success'">
                    {{ typeLabel(currentQ.type) }}
                  </NTag>
                  <NTag v-if="answered[currentQ.id]" size="small" type="success" :bordered="false">
                    <NIcon :component="Checkmark" :size="10" class="mr-0.5" />
                    已答
                  </NTag>
                </div>
                <h2 class="text-base font-mono font-medium leading-relaxed whitespace-pre-wrap"
                  :class="isDark ? 'text-gray-100' : 'text-gray-900'">
                  {{ currentQ.question }}
                </h2>
              </div>
            </div>

            <!-- Options (Single/Multiple) -->
            <div v-if="currentQ.type !== 'free'" class="space-y-2 mb-6">
              <button
                v-for="(opt, idx) in currentQ.options"
                :key="idx"
                @click="currentQ.type === 'single' ? handleSingleSelect(idx) : handleMultipleToggle(idx)"
                class="w-full text-left px-4 py-3 rounded border text-sm font-mono transition-all duration-150 relative"
                :class="[
                  showCorrectness && optionCorrectness && optionCorrectness(idx) === 'correct'
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : showCorrectness && optionCorrectness && optionCorrectness(idx) === 'wrong'
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : currentQ.type === 'single' && selectedSingle === idx
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : currentQ.type === 'multiple' && selectedMultiple.includes(idx)
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : isDark ? 'border-gray-700 hover:border-gray-600 text-gray-300' : 'border-gray-200 hover:border-gray-300 text-gray-700'
                ]">
                <span class="inline-block w-6">{{ opt.charAt(0) }}</span>
                <span>{{ opt.substring(2) }}</span>
                <!-- Correctness icons -->
                <span v-if="showCorrectness && optionCorrectness && optionCorrectness(idx) === 'correct'" class="float-right mt-0.5 text-green-500 font-bold">✓</span>
                <span v-if="showCorrectness && optionCorrectness && optionCorrectness(idx) === 'wrong'" class="float-right mt-0.5 text-red-500 font-bold">✗</span>
                <NIcon v-else-if="currentQ.type === 'single' && selectedSingle === idx" :component="Checkmark" :size="14" class="float-right mt-0.5 text-green-500" />
                <NIcon v-else-if="currentQ.type === 'multiple' && selectedMultiple.includes(idx)" :component="Checkmark" :size="14" class="float-right mt-0.5 text-green-500" />
              </button>
            </div>

            <!-- Free Response -->
            <div v-else class="mb-6">
              <textarea
                v-model="freeAnswer"
                @input="handleFreeInput"
                rows="5"
                placeholder="请在此输入你的回答..."
                class="w-full px-4 py-3 rounded border text-sm font-mono resize-y transition-colors"
                :class="isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-green-500 focus:outline-none'
                  : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none'"
              />
            </div>

            <!-- Answer Section -->
            <div class="mb-6 rounded border overflow-hidden"
              :class="isDark ? 'border-gray-800' : 'border-gray-200'">
              
              <!-- Answer Toggle Button -->
              <button
                @click="toggleAnswer"
                class="w-full px-4 py-3 flex items-center justify-between text-sm font-mono transition-colors"
                :class="isDark ? 'bg-gray-900 hover:bg-gray-800 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'">
                <span class="flex items-center gap-2">
                  <NIcon :component="Eye" :size="14" />
                  {{ showAnswer ? '收起答案' : '查看答案' }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ showAnswer ? '↑' : '↓' }} Ctrl+Enter
                </span>
              </button>

              <!-- Answer Content -->
              <div v-if="showAnswer"
                class="px-5 py-4 border-t"
                :class="isDark ? 'border-gray-800 bg-black/40' : 'border-gray-200 bg-gray-50'">
                <div class="text-sm font-mono leading-relaxed whitespace-pre-wrap"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                  {{ currentQ.answer }}
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="flex items-center justify-between pt-2">
              <NButton
                @click="prev"
                :disabled="currentIndex === 0"
                quaternary
                size="medium"
                class="font-mono">
                <template #icon><NIcon :component="ChevronBack" :size="16" /></template>
                上一题
              </NButton>

              <!-- Dot Indicators -->
              <div class="hidden md:flex items-center gap-1 flex-wrap justify-center max-w-xs">
                <button
                  v-for="(q, idx) in filteredQuestions"
                  :key="q.id"
                  @click="goTo(idx)"
                  class="w-2 h-2 rounded-full transition-all"
                  :class="[
                    idx === currentIndex ? 'bg-green-500 scale-125' : '',
                    answered[q.id] && idx !== currentIndex ? 'bg-green-500/60' : '',
                    !answered[q.id] && idx !== currentIndex ? (isDark ? 'bg-gray-700' : 'bg-gray-300') : ''
                  ]"
                  :title="`W${q.week} ${q.topic}`"
                />
              </div>

              <NButton
                @click="next"
                :disabled="currentIndex === questions.length - 1"
                type="primary"
                size="medium"
                class="font-mono">
                下一题
                <template #icon><NIcon :component="ChevronForward" :size="16" /></template>
              </NButton>
            </div>

          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-20">
            <p class="font-mono text-gray-500">题目加载中...</p>
          </div>

        </div>
      </main>

      <!-- Footer -->
      <footer class="py-6 text-center border-t"
        :class="isDark ? 'border-gray-800 text-gray-600' : 'border-gray-200 text-gray-400'">
        <p class="text-xs font-mono">← → 键切换题目 · Ctrl+Enter 显示/隐藏答案</p>
      </footer>

    </div>
  </NConfigProvider>
</template>

<style scoped>
textarea {
  font-family: 'SF Mono', 'Fira Code', monospace;
}
</style>
