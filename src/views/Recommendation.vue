<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">慢病干预推荐系统</h1>
            <p class="text-sm text-gray-500 mt-1">基于患者信息生成个性化干预方案</p>
          </div>
          <router-link to="/" class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
            ← 返回首页
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：患者信息表单 -->
        <div class="space-y-6">
          <!-- 患者基本信息 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
              患者基本信息
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">姓名（可选）</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="请输入姓名"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">性别 *</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.gender" value="男" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm text-gray-700">男</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.gender" value="女" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm text-gray-700">女</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">年龄 *</label>
                <input
                  v-model.number="form.age"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="请输入年龄"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- 疾病选择 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">2</span>
              疾病诊断
            </h2>

            <p class="text-sm text-gray-500 mb-3">请选择患者当前患有的慢性病（可多选）</p>

            <!-- 分组展示疾病 -->
            <div v-for="(nodes, group) in diseasesByGroup" :key="group" class="mb-4">
              <div class="text-xs font-medium text-gray-500 uppercase mb-2">{{ group }}</div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="node in nodes"
                  :key="node.id"
                  @click="toggleDisease(node.id)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm border transition',
                    form.diseases.includes(node.id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  ]"
                >
                  {{ node.label }}
                </button>
              </div>
            </div>

            <!-- 已选疾病标签 -->
            <div v-if="form.diseases.length > 0" class="mt-4 pt-4 border-t">
              <div class="text-sm text-gray-500 mb-2">已选择：</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="diseaseId in form.diseases"
                  :key="diseaseId"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                >
                  {{ getDiseaseName(diseaseId) }}
                  <button @click="removeDisease(diseaseId)" class="hover:text-blue-900">×</button>
                </span>
              </div>
            </div>
          </div>

          <!-- Excel上传 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</span>
              自定义规则文件（可选）
            </h2>

            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls"
                class="hidden"
                @change="handleFileChange"
              />
              <div v-if="!uploadedFileName">
                <div class="text-4xl mb-2">📊</div>
                <p class="text-sm text-gray-600">点击上传或拖拽 Excel 文件</p>
                <p class="text-xs text-gray-400 mt-1">支持 .xlsx .xls 格式</p>
              </div>
              <div v-else>
                <div class="text-4xl mb-2">✅</div>
                <p class="text-sm text-blue-600 font-medium">{{ uploadedFileName }}</p>
                <p class="text-xs text-gray-400 mt-1">已加载 {{ customRulesCount }} 条规则</p>
              </div>
            </div>

            <div v-if="uploadedFileName" class="mt-3 flex justify-center">
              <button
                @click="clearUploadedFile"
                class="text-xs text-red-500 hover:text-red-700"
              >
                清除已上传文件，使用内置规则
              </button>
            </div>
          </div>

          <!-- 生成按钮 -->
          <button
            @click="generateRecommendation"
            :disabled="!canGenerate"
            :class="[
              'w-full py-3 rounded-xl text-base font-semibold transition',
              canGenerate
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            {{ canGenerate ? '生成推荐方案' : '请完善必填信息' }}
          </button>
        </div>

        <!-- 右侧：推荐结果 -->
        <div class="space-y-6">
          <!-- 结果区域 -->
          <div v-if="recommendation">
            <!-- 患者信息摘要 -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-5 text-white mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm">推荐结果</p>
                  <h3 class="text-xl font-bold mt-1">
                    {{ recommendation.patient.name || '患者' }}
                    {{ recommendation.patient.gender }} {{ recommendation.patient.age }}岁
                  </h3>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold">{{ recommendation.matchedRulesCount }}</div>
                  <div class="text-blue-200 text-xs">匹配规则数</div>
                </div>
              </div>

              <div class="mt-3 pt-3 border-t border-blue-400/30">
                <p class="text-sm text-blue-100">
                  匹配疾病：
                  <span
                    v-for="(diseaseId, idx) in recommendation.matchedDiseases"
                    :key="diseaseId"
                  >
                    {{ getDiseaseName(diseaseId) }}{{ idx < recommendation.matchedDiseases.length - 1 ? '、' : '' }}
                  </span>
                </p>
              </div>

              <div v-if="recommendation.hasComorbidity" class="mt-2">
                <span class="inline-block bg-yellow-400/20 text-yellow-200 text-xs px-2 py-1 rounded-full">
                  ⚠️ 检测到共病情况，将综合多病种给出联合建议
                </span>
              </div>
            </div>

            <!-- 四大建议模块 -->
            <div class="space-y-4">
              <!-- 药物建议 -->
              <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="bg-red-50 px-5 py-3 border-b border-red-100 flex items-center gap-2">
                  <span class="text-xl">💊</span>
                  <h4 class="font-semibold text-red-800">药物建议</h4>
                </div>
                <ul class="divide-y divide-gray-100">
                  <li
                    v-for="(item, idx) in recommendation.recommendations.medications"
                    :key="idx"
                    class="px-5 py-3 text-sm text-gray-700"
                  >
                    <span class="text-red-500 mr-2">{{ idx + 1 }}.</span>
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- 饮食建议 -->
              <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="bg-green-50 px-5 py-3 border-b border-green-100 flex items-center gap-2">
                  <span class="text-xl">🥗</span>
                  <h4 class="font-semibold text-green-800">饮食建议</h4>
                </div>
                <ul class="divide-y divide-gray-100">
                  <li
                    v-for="(item, idx) in recommendation.recommendations.diet"
                    :key="idx"
                    class="px-5 py-3 text-sm text-gray-700"
                  >
                    <span class="text-green-500 mr-2">{{ idx + 1 }}.</span>
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- 运动建议 -->
              <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="bg-blue-50 px-5 py-3 border-b border-blue-100 flex items-center gap-2">
                  <span class="text-xl">🏃</span>
                  <h4 class="font-semibold text-blue-800">运动建议</h4>
                </div>
                <ul class="divide-y divide-gray-100">
                  <li
                    v-for="(item, idx) in recommendation.recommendations.exercise"
                    :key="idx"
                    class="px-5 py-3 text-sm text-gray-700"
                  >
                    <span class="text-blue-500 mr-2">{{ idx + 1 }}.</span>
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- 监测建议 -->
              <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="bg-purple-50 px-5 py-3 border-b border-purple-100 flex items-center gap-2">
                  <span class="text-xl">📊</span>
                  <h4 class="font-semibold text-purple-800">监测建议</h4>
                </div>
                <ul class="divide-y divide-gray-100">
                  <li
                    v-for="(item, idx) in recommendation.recommendations.monitoring"
                    :key="idx"
                    class="px-5 py-3 text-sm text-gray-700"
                  >
                    <span class="text-purple-500 mr-2">{{ idx + 1 }}.</span>
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- 备注 -->
              <div
                v-if="recommendation.recommendations.notes.length > 0"
                class="bg-yellow-50 rounded-xl shadow-sm overflow-hidden"
              >
                <div class="bg-yellow-100 px-5 py-3 border-b border-yellow-200 flex items-center gap-2">
                  <span class="text-xl">⚠️</span>
                  <h4 class="font-semibold text-yellow-800">注意事项</h4>
                </div>
                <ul class="divide-y divide-yellow-100">
                  <li
                    v-for="(note, idx) in recommendation.recommendations.notes"
                    :key="idx"
                    class="px-5 py-3 text-sm text-yellow-800"
                  >
                    {{ note }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 mt-6">
              <button
                @click="resetForm"
                class="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition"
              >
                重新填写
              </button>
              <button
                @click="printRecommendation"
                class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
              >
                打印方案
              </button>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="bg-white rounded-xl shadow-sm p-12 text-center">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">等待输入患者信息</h3>
            <p class="text-sm text-gray-500">
              请在左侧填写患者基本信息<br>和疾病诊断，系统将自动生成推荐方案
            </p>
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
import { diseaseNodes } from '../data/diseaseNetwork'
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

    // TODO: 将解析的规则合并到系统中
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
