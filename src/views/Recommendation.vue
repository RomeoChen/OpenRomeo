<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 装饰性背景 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/5 via-orange-500/5 to-transparent rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/5 via-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
    </div>

    <!-- 头部 -->
    <header class="relative bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                慢病干预推荐系统
              </h1>
            </div>
            <p class="text-sm text-slate-500 ml-13">基于患者信息生成个性化干预方案</p>
          </div>
          <router-link 
            to="/" 
            class="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200"
          >
            <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span class="text-sm font-medium">返回首页</span>
          </router-link>
        </div>
      </div>
    </header>

    <div class="relative max-w-5xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- 左侧：患者信息表单 (2/5) -->
        <div class="lg:col-span-2 space-y-5">
          <!-- 患者基本信息 -->
          <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">1</div>
              <h2 class="text-lg font-bold text-slate-800">患者基本信息</h2>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1.5">姓名（可选）</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="请输入姓名"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1.5">性别 *</label>
                <div class="flex gap-3">
                  <label 
                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition"
                    :class="form.gender === '男' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'"
                  >
                    <input type="radio" v-model="form.gender" value="男" class="hidden" />
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4" stroke-width="2"/>
                      <path stroke-linecap="round" stroke-width="2" d="M5.5 21v-2a6.5 6.5 0 0113 0v2"/>
                    </svg>
                    <span class="text-sm font-medium">男</span>
                  </label>
                  <label 
                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition"
                    :class="form.gender === '女' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'"
                  >
                    <input type="radio" v-model="form.gender" value="女" class="hidden" />
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4" stroke-width="2"/>
                      <path stroke-linecap="round" stroke-width="2" d="M5.5 21v-2a6.5 6.5 0 0113 0v2"/>
                    </svg>
                    <span class="text-sm font-medium">女</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1.5">年龄 *</label>
                <div class="relative">
                  <input
                    v-model.number="form.age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="请输入年龄"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition"
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">岁</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 疾病选择 -->
          <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">2</div>
              <h2 class="text-lg font-bold text-slate-800">疾病诊断</h2>
            </div>

            <p class="text-sm text-slate-500 mb-4">请选择患者当前患有的慢性病（可多选）</p>

            <!-- 分组展示疾病 -->
            <div v-for="(nodes, group) in diseasesByGroup" :key="group" class="mb-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: groupColors[group] }"></span>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">{{ group }}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="node in nodes"
                  :key="node.id"
                  @click="toggleDisease(node.id)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all',
                    form.diseases.includes(node.id)
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                  ]"
                >
                  {{ node.label }}
                </button>
              </div>
            </div>

            <!-- 已选疾病标签 -->
            <div v-if="form.diseases.length > 0" class="mt-5 pt-4 border-t border-slate-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-slate-500">已选择：</span>
                <span class="text-sm font-semibold text-emerald-600">{{ form.diseases.length }} 种疾病</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="diseaseId in form.diseases"
                  :key="diseaseId"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 rounded-lg text-xs font-medium"
                >
                  {{ getDiseaseName(diseaseId) }}
                  <button @click="removeDisease(diseaseId)" class="w-4 h-4 rounded-full bg-emerald-200/50 hover:bg-emerald-200 flex items-center justify-center text-emerald-600 hover:text-emerald-800 transition">×</button>
                </span>
              </div>
            </div>
          </div>

          <!-- Excel上传 -->
          <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">3</div>
              <h2 class="text-lg font-bold text-slate-800">自定义规则</h2>
            </div>

            <div
              class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition cursor-pointer"
              :class="uploadedFileName ? 'border-emerald-400 bg-emerald-50/30' : ''"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept=".xlsx,.xls"
                class="hidden"
                @change="handleFileChange"
              />
              <div v-if="!uploadedFileName" class="space-y-2">
                <div class="text-4xl">📊</div>
                <p class="text-sm text-slate-600 font-medium">点击上传或拖拽 Excel 文件</p>
                <p class="text-xs text-slate-400">支持 .xlsx .xls 格式</p>
              </div>
              <div v-else class="space-y-2">
                <div class="text-4xl">✅</div>
                <p class="text-sm text-emerald-600 font-semibold">{{ uploadedFileName }}</p>
                <p class="text-xs text-slate-500">已加载 {{ customRulesCount }} 条规则</p>
                <button
                  @click.stop="clearUploadedFile"
                  class="text-xs text-red-500 hover:text-red-700 underline"
                >
                  清除文件
                </button>
              </div>
            </div>
          </div>

          <!-- 生成按钮 -->
          <button
            @click="generateRecommendation"
            :disabled="!canGenerate"
            :class="[
              'w-full py-4 rounded-2xl text-base font-bold shadow-xl transition-all flex items-center justify-center gap-2',
              canGenerate
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/30 hover:shadow-amber-500/40 hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            ]"
          >
            <svg v-if="canGenerate" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            {{ canGenerate ? '生成推荐方案' : '请完善必填信息' }}
          </button>
        </div>

        <!-- 右侧：推荐结果 (3/5) -->
        <div class="lg:col-span-3 space-y-5">
          <!-- 结果区域 -->
          <template v-if="recommendation">
            <!-- 患者信息摘要 -->
            <div class="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-6 text-white">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-amber-100 text-sm font-medium">推荐结果</p>
                  <h3 class="text-2xl font-bold mt-1">
                    {{ recommendation.patient.name || '患者' }}
                    {{ recommendation.patient.gender }} {{ recommendation.patient.age }}岁
                  </h3>
                </div>
                <div class="text-right">
                  <div class="text-4xl font-bold">{{ recommendation.matchedRulesCount }}</div>
                  <div class="text-amber-100 text-xs">匹配规则数</div>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-white/20">
                <p class="text-sm text-amber-100 mb-2">
                  匹配疾病：
                  <span
                    v-for="(diseaseId, idx) in recommendation.matchedDiseases"
                    :key="diseaseId"
                  >
                    <span class="text-white font-medium">{{ getDiseaseName(diseaseId) }}</span>{{ idx < recommendation.matchedDiseases.length - 1 ? '、' : '' }}
                  </span>
                </p>
              </div>

              <div v-if="recommendation.hasComorbidity" class="mt-3">
                <span class="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur text-amber-100 text-xs px-3 py-1.5 rounded-full">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  检测到共病情况，将综合多病种给出联合建议
                </span>
              </div>
            </div>

            <!-- 四大建议模块 -->
            <div class="space-y-4">
              <!-- 药物建议 -->
              <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                <div class="bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3.5 flex items-center gap-3">
                  <span class="text-2xl">💊</span>
                  <h4 class="font-bold text-white text-lg">药物建议</h4>
                </div>
                <ul class="divide-y divide-slate-100">
                  <li
                    v-for="(item, idx) in recommendation.recommendations.medications"
                    :key="idx"
                    class="px-5 py-3.5 flex items-start gap-3"
                  >
                    <span class="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{{ idx + 1 }}</span>
                    <span class="text-slate-700 text-sm leading-relaxed">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- 饮食建议 -->
              <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3.5 flex items-center gap-3">
                  <span class="text-2xl">🥗</span>
                  <h4 class="font-bold text-white text-lg">饮食建议</h4>
                </div>
                <ul class="divide-y divide-slate-100">
                  <li
                    v-for="(item, idx) in recommendation.recommendations.diet"
                    :key="idx"
                    class="px-5 py-3.5 flex items-start gap-3"
                  >
                    <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{{ idx + 1 }}</span>
                    <span class="text-slate-700 text-sm leading-relaxed">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- 运动建议 -->
              <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-cyan-600 px-5 py-3.5 flex items-center gap-3">
                  <span class="text-2xl">🏃</span>
                  <h4 class="font-bold text-white text-lg">运动建议</h4>
                </div>
                <ul class="divide-y divide-slate-100">
                  <li
                    v-for="(item, idx) in recommendation.recommendations.exercise"
                    :key="idx"
                    class="px-5 py-3.5 flex items-start gap-3"
                  >
                    <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{{ idx + 1 }}</span>
                    <span class="text-slate-700 text-sm leading-relaxed">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- 监测建议 -->
              <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-500 to-violet-600 px-5 py-3.5 flex items-center gap-3">
                  <span class="text-2xl">📊</span>
                  <h4 class="font-bold text-white text-lg">监测建议</h4>
                </div>
                <ul class="divide-y divide-slate-100">
                  <li
                    v-for="(item, idx) in recommendation.recommendations.monitoring"
                    :key="idx"
                    class="px-5 py-3.5 flex items-start gap-3"
                  >
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{{ idx + 1 }}</span>
                    <span class="text-slate-700 text-sm leading-relaxed">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- 备注 -->
              <div
                v-if="recommendation.recommendations.notes.length > 0"
                class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200/50 overflow-hidden"
              >
                <div class="bg-gradient-to-r from-yellow-400 to-amber-400 px-5 py-3 flex items-center gap-3">
                  <span class="text-xl">⚠️</span>
                  <h4 class="font-bold text-amber-900 text-lg">注意事项</h4>
                </div>
                <ul class="divide-y divide-yellow-100">
                  <li
                    v-for="(note, idx) in recommendation.recommendations.notes"
                    :key="idx"
                    class="px-5 py-3 text-sm text-amber-800"
                  >
                    {{ note }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3">
              <button
                @click="resetForm"
                class="flex-1 py-3 border-2 border-slate-300 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-100 hover:border-slate-400 transition flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                重新填写
              </button>
              <button
                @click="printRecommendation"
                class="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-700 transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                打印方案
              </button>
            </div>
          </template>

          <!-- 空状态 -->
          <div v-else class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-16 text-center">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <span class="text-5xl">📋</span>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">等待输入患者信息</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">
              请在左侧填写患者基本信息<br>和疾病诊断，系统将自动生成推荐方案
            </p>
            <div class="mt-6 flex justify-center gap-8 text-sm text-slate-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-400"></span>药物
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-400"></span>饮食
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-blue-400"></span>运动
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-purple-400"></span>监测
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import * as XLSX from 'xlsx'
import { diseaseNodes, groupColors } from '../data/diseaseNetwork'
import { reverseDiseaseNameMap } from '../data/recommendationRules'
import { generateRecommendation as engineGenerate, type PatientInfo, parseExcelRules } from '../utils/recommendationEngine'

const route = useRoute()

// 表单数据
const form = reactive<{
  name: string
  gender: '男' | '女' | ''
  age: number | null
  diseases: string[]
}>({
  name: '',
  gender: '',
  age: null,
  diseases: [],
})

// 推荐结果
const recommendation = ref<ReturnType<typeof engineGenerate> | null>(null)

// 文件上传
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadedFileName = ref('')
const customRulesCount = ref(0)

// 按分组展示疾病
const diseasesByGroup = computed(() => {
  const groups: Record<string, typeof diseaseNodes> = {}
  for (const node of diseaseNodes) {
    if (!groups[node.group]) {
      groups[node.group] = []
    }
    groups[node.group].push(node)
  }
  return groups
})

// 是否可以生成
const canGenerate = computed(() => {
  return form.gender !== '' && form.age !== null && form.age > 0 && form.diseases.length > 0
})

// 获取疾病名称
function getDiseaseName(id: string): string {
  return reverseDiseaseNameMap[id] || id
}

// 切换疾病选择
function toggleDisease(id: string) {
  const idx = form.diseases.indexOf(id)
  if (idx === -1) {
    form.diseases.push(id)
  } else {
    form.diseases.splice(idx, 1)
  }
}

// 移除疾病
function removeDisease(id: string) {
  const idx = form.diseases.indexOf(id)
  if (idx !== -1) {
    form.diseases.splice(idx, 1)
  }
}

// 触发文件选择
function triggerFileInput() {
  fileInputRef.value?.click()
}

// 处理文件选择
async function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] || fileInputRef.value?.files?.[0]
  if (file) {
    await loadExcelFile(file)
  }
}

// 处理文件拖拽
async function handleFileDrop(event: DragEvent) {
  const file = event.dataTransfer?.files?.[0]
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    await loadExcelFile(file)
  }
}

// 加载Excel文件
async function loadExcelFile(file: File) {
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

    const rules = parseExcelRules(data)
    customRulesCount.value = rules.length
    uploadedFileName.value = file.name

    console.log('Loaded custom rules:', rules)
  } catch (error) {
    console.error('Failed to load Excel file:', error)
    alert('文件加载失败，请确保是有效的 Excel 文件')
  }
}

// 清除上传的文件
function clearUploadedFile() {
  uploadedFileName.value = ''
  customRulesCount.value = 0
}

// 生成推荐
function generateRecommendation() {
  if (!canGenerate.value) return

  const patient: PatientInfo = {
    name: form.name || undefined,
    gender: form.gender as '男' | '女',
    age: form.age!,
    diseases: [...form.diseases],
  }

  recommendation.value = engineGenerate(patient)
}

// 重置表单
function resetForm() {
  form.name = ''
  form.gender = ''
  form.age = null
  form.diseases = []
  recommendation.value = null
}

// 打印推荐方案
function printRecommendation() {
  window.print()
}

// 从URL参数初始化疾病
onMounted(() => {
  const diseases = route.query.diseases
  if (diseases) {
    if (Array.isArray(diseases)) {
      form.diseases = diseases.map(d => String(d))
    } else {
      form.diseases = [String(diseases)]
    }
  }
})
</script>

<style scoped>
@media print {
  :deep(.sticky) {
    display: none !important;
  }
  .min-h-screen {
    background: white !important;
  }
}
</style>
