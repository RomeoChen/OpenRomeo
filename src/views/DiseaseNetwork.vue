<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- 装饰性背景 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-violet-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-bl from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <!-- 页面头部 -->
    <header class="relative bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-white">
                慢病共病网络
              </h1>
            </div>
            <p class="text-sm text-slate-400 ml-13">探索慢性疾病之间的关联关系</p>
          </div>
          <router-link 
            to="/" 
            class="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
          >
            <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span class="text-sm font-medium">返回</span>
          </router-link>
        </div>

        <!-- 简洁图例 -->
        <div class="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-800/50">
          <div
            v-for="(color, group) in groupColors"
            :key="group"
            class="flex items-center gap-2"
          >
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }"
            ></span>
            <span class="text-xs font-medium text-slate-400">{{ group }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <div class="relative max-w-6xl mx-auto px-6 py-8">
      <!-- 控制栏 -->
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-slate-400">布局</label>
          <select
            v-model="layoutMode"
            class="appearance-none bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition border border-slate-700/50"
          >
            <option value="force">力导向</option>
            <option value="hierarchical">层级</option>
          </select>
        </div>
        <button
          @click="fitAll"
          class="flex items-center gap-2 text-xs bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 px-3 py-1.5 rounded-lg transition border border-cyan-500/30"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
          </svg>
          适应屏幕
        </button>
      </div>

      <!-- 网络图 -->
      <div class="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
        <div ref="networkContainer" class="w-full h-[550px]"></div>
      </div>

      <!-- 简洁统计 -->
      <div class="grid grid-cols-3 gap-4 mt-6">
        <div class="bg-slate-900/50 backdrop-blur-xl rounded-xl p-4 border border-slate-800/50 text-center">
          <div class="text-2xl font-bold text-white">{{ nodes.length }}</div>
          <div class="text-xs text-slate-500 mt-1">疾病</div>
        </div>
        <div class="bg-slate-900/50 backdrop-blur-xl rounded-xl p-4 border border-slate-800/50 text-center">
          <div class="text-2xl font-bold text-white">{{ links.length }}</div>
          <div class="text-xs text-slate-500 mt-1">关联</div>
        </div>
        <div class="bg-slate-900/50 backdrop-blur-xl rounded-xl p-4 border border-slate-800/50 text-center">
          <div class="text-2xl font-bold text-cyan-400">{{ maxWeight }}</div>
          <div class="text-xs text-slate-500 mt-1">最高共病</div>
        </div>
      </div>

      <!-- 节点详情 -->
      <Transition name="fade">
        <div
          v-if="selectedNode"
          class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="selectedNode = null"
        >
          <div class="bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-800/50">
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: groupColors[selectedNode.group], boxShadow: `0 0 8px ${groupColors[selectedNode.group]}` }"
                  ></span>
                  <h3 class="text-lg font-bold text-white">{{ selectedNode.label }}</h3>
                </div>
                <p class="text-xs text-slate-400">{{ selectedNode.group }}</p>
              </div>
              <button
                @click="selectedNode = null"
                class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <p class="text-sm text-slate-300 mb-4">{{ selectedNode.description }}</p>

            <div class="text-xs text-slate-500 mb-4">
              <span class="text-slate-400">模拟患者</span>
              <span class="text-cyan-400 font-semibold ml-2">{{ selectedNode.size }}</span>
            </div>

            <div v-if="relatedNodes.length > 0" class="mb-4">
              <div class="text-xs font-medium text-slate-400 mb-2">相关疾病</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="node in relatedNodes"
                  :key="node.id"
                  class="text-xs bg-slate-800/50 text-slate-300 px-2 py-1 rounded-lg border border-slate-700/50"
                >
                  {{ node.label }}
                </span>
              </div>
            </div>

            <router-link
              :to="{ path: '/recommendation', query: { diseases: selectedNode.id } }"
              class="block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
            >
              查看推荐方案
            </router-link>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Network, DataSet } from 'vis-network/standalone'
import { diseaseNodes, diseaseEdges, groupColors } from '../data/diseaseNetwork'

// 精选节点 - 保留核心疾病
const nodes = diseaseNodes.filter(n => 
  ['hypertension', 'diabetes', 'coronary_heart_disease', 'cerebral_infarction', 'obesity', 'hyperlipidemia', 'fatty_liver', 'copd', 'chronic_kidney_disease', 'depression'].includes(n.id)
)

// 精选边 - 只保留最强关联
const selectedEdgeIds = [
  'hypertension-coronary_heart_disease',
  'hypertension-diabetes',
  'hypertension-cerebral_infarction',
  'diabetes-chronic_kidney_disease',
  'diabetes-obesity',
  'diabetes-fatty_liver',
  'hyperlipidemia-coronary_heart_disease',
  'obesity-fatty_liver',
  'hypertension-hyperlipidemia',
  'diabetes-coronary_heart_disease',
  'cerebral_infarction-atrial_fibrillation',
  'chronic_kidney_disease-anemia',
]

const links = diseaseEdges.filter(e => {
  const id1 = `${e.from}-${e.to}`
  const id2 = `${e.to}-${e.from}`
  return selectedEdgeIds.includes(id1) || selectedEdgeIds.includes(id2)
}).map(e => ({
  ...e,
  label: e.label || ''
}))

// Refs
const networkContainer = ref<HTMLElement | null>(null)
const selectedNode = ref<any>(null)
const layoutMode = ref<'force' | 'hierarchical'>('force')

let network: Network | null = null

// Computed
const maxWeight = computed(() => Math.max(...links.map(e => e.width)))

// 相关节点
const relatedNodes = computed(() => {
  if (!selectedNode.value) return []
  const relatedIds = links
    .filter(e => e.from === selectedNode.value.id || e.to === selectedNode.value.id)
    .map(e => e.from === selectedNode.value.id ? e.to : e.from)
  return nodes.filter(n => relatedIds.includes(n.id))
})

// 构建数据
function buildVisData() {
  const visNodes = nodes.map(node => ({
    id: node.id,
    label: node.label,
    size: 35,
    color: {
      background: groupColors[node.group] || '#888',
      border: groupColors[node.group] || '#888',
      highlight: { background: groupColors[node.group] || '#888', border: '#fff' },
      hover: { background: groupColors[node.group] || '#888', border: '#fff' },
    },
    font: { color: '#f1f5f9', size: 14, face: 'monospace' },
    borderWidth: 3,
    shadow: { enabled: true, color: groupColors[node.group] + '40', size: 15 },
  }))

  const visEdges = links.map(edge => ({
    from: edge.from,
    to: edge.to,
    width: edge.width * 0.5,
    color: { color: 'rgba(148, 163, 184, 0.4)', highlight: 'rgba(148, 163, 184, 0.8)' },
    smooth: { type: 'continuous' },
    label: edge.label,
    font: { color: '#64748b', size: 10, face: 'monospace' },
  }))

  return { nodes: new DataSet(visNodes), edges: new DataSet(visEdges as any) }
}

// 初始化
function initNetwork() {
  if (!networkContainer.value) return

  const { nodes: visNodes, edges: visEdges } = buildVisData()

  const options = {
    nodes: { shape: 'dot', scaling: { min: 25, max: 50 } },
    edges: { arrows: { to: { enabled: false } } },
    physics: {
      enabled: layoutMode.value === 'force',
      forceAtlas2Based: {
        gravitationalConstant: -80,
        centralGravity: 0.01,
        springLength: 180,
        springConstant: 0.08,
        damping: 0.4,
      },
      stabilization: { iterations: 200 },
    },
    layout: {
      improvedLayout: true,
      hierarchical: layoutMode.value === 'hierarchical' ? {
        enabled: true, direction: 'UD', sortMethod: 'directed',
        levelSeparation: 150, nodeSpacing: 200,
      } : undefined,
    },
    interaction: { hover: true, tooltipDelay: 150, hideEdgesOnDrag: true },
  }

  network = new Network(networkContainer.value, { nodes: visNodes as any, edges: visEdges as any }, options)

  network.on('click', (params) => {
    if (params.nodes.length > 0) {
      const node = nodes.find(n => n.id === params.nodes[0])
      if (node) selectedNode.value = node
    } else {
      selectedNode.value = null
    }
  })
}

function fitAll() {
  network?.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } })
}

watch(layoutMode, () => {
  if (network) { network.destroy(); initNetwork() }
})

watch(selectedNode, (node) => {
  if (network && node) {
    network.focus(node.id, { scale: 1.2, animation: { duration: 300, easingFunction: 'easeInOutQuad' } })
    network.selectNodes([node.id])
  }
})

onMounted(initNetwork)
onUnmounted(() => { network?.destroy(); network = null })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
