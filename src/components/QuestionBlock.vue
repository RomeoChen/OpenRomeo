<script setup lang="ts">
import { ref, onMounted } from 'vue'

export interface QuestionOption {
  label: string
  text: string
}

export interface QuestionData {
  id: string
  stem: string
  choices: QuestionOption[]
  answer: string
  explanation?: string
}

const props = defineProps<{
  data: QuestionData
  slug: string
}>()

const isAnswered = ref(false)
const selectedOption = ref<string | null>(null)
const isCorrect = ref(false)
const showExplanation = ref(false)

const optionColors = [
  'border-green-500/50',
  'border-blue-500/50',
  'border-yellow-500/50',
  'border-red-500/50',
]


function selectOption(label: string) {
  if (isAnswered.value) return
  selectedOption.value = label
  isCorrect.value = label === props.data.answer
  isAnswered.value = true
  showExplanation.value = true

  // 保存到 localStorage
  try {
    const key = `open-romeo-q-${props.slug}`
    const records = JSON.parse(localStorage.getItem(key) || '{}')
    records[props.data.id] = {
      selectedOption: label,
      isCorrect: isCorrect.value,
      answeredAt: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(records))
  } catch {}
}

function getOptionClass(label: string) {
  const idx = label.charCodeAt(0) - 65 // 0=A, 1=B, 2=C, 3=D
  const base = `border ${optionColors[idx] || 'border-gray-600'}`

  if (!isAnswered.value) {
    if (selectedOption.value === label) {
      return `${base} border-2 bg-gray-700/50`
    }
    return `${base} border hover:border-gray-400 cursor-pointer transition-colors`
  }

  if (label === props.data.answer) {
    if (isCorrect.value && selectedOption.value === label) {
      return `${base} border-2 bg-green-500/30 border-green-400`
    }
    return `${base} border-2 bg-green-500/20 border-green-400`
  }

  if (selectedOption.value === label && !isCorrect.value) {
    return `${base} border-2 bg-red-500/20 border-red-400`
  }

  return `${base} opacity-50`
}

function getOptionLabelClass(label: string) {
  if (!isAnswered.value) return 'bg-gray-700'
  if (label === props.data.answer) return 'bg-green-600'
  if (selectedOption.value === label && !isCorrect.value) return 'bg-red-600'
  return 'bg-gray-700 opacity-50'
}

onMounted(() => {
  // 读取本地记录
  try {
    const key = `open-romeo-q-${props.slug}`
    const records = JSON.parse(localStorage.getItem(key) || '{}')
    if (records[props.data.id]) {
      selectedOption.value = records[props.data.id].selectedOption
      isCorrect.value = records[props.data.id].isCorrect
      isAnswered.value = true
      showExplanation.value = true
    }
  } catch {}
})
</script>

<template>
  <div class="q-block-wrapper font-mono text-sm my-6 border border-gray-700/50 rounded-lg overflow-hidden"
    :class="isAnswered ? (isCorrect ? 'border-green-500/40' : 'border-red-500/40') : ''">
    <!-- 题目标题栏 -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-gray-700/50"
      :class="isAnswered ? (isCorrect ? 'bg-green-500/10' : 'bg-red-500/10') : 'bg-gray-800/50'">
      <div class="flex items-center gap-2">
        <span class="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">Q</span>
        <span class="text-xs text-gray-500">{{ data.id }}</span>
      </div>
      <div v-if="isAnswered" class="flex items-center gap-1.5">
        <span v-if="isCorrect" class="text-xs text-green-400 flex items-center gap-1">
          <span>✓</span> 正确
        </span>
        <span v-else class="text-xs text-red-400 flex items-center gap-1">
          <span>✗</span> 错误 · 正确答案：{{ data.answer }}
        </span>
      </div>
      <span v-else class="text-xs text-gray-500">未作答</span>
    </div>

    <!-- 题目内容 -->
    <div class="p-4">
      <!-- 题目干 -->
      <div class="mb-4 leading-relaxed whitespace-pre-wrap" :class="isCorrect ? 'text-gray-200' : 'text-gray-200'">
        {{ data.stem }}
      </div>

      <!-- 选项列表 -->
      <div class="space-y-2">
        <div
          v-for="choice in data.choices"
          :key="choice.label"
          class="flex items-start gap-3 p-3 rounded cursor-pointer transition-all"
          :class="getOptionClass(choice.label)"
          @click="selectOption(choice.label)"
        >
          <span class="shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-colors"
            :class="getOptionLabelClass(choice.label)">
            {{ choice.label }}
          </span>
          <span class="leading-relaxed text-sm">{{ choice.text }}</span>
        </div>
      </div>

      <!-- 解析 -->
      <div v-if="showExplanation && data.explanation" class="mt-4 p-3 rounded border border-yellow-500/30 bg-yellow-500/10">
        <div class="text-xs text-yellow-400 font-bold mb-1">📖 解析</div>
        <div class="text-xs text-gray-300 leading-relaxed">{{ data.explanation }}</div>
      </div>
    </div>
  </div>
</template>
