<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 装饰性背景 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 页面头部 -->
    <header class="relative bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                慢病共病网络图
              </h1>
            </div>
            <p class="text-sm text-slate-500 ml-13">基于患者共病数据构建的疾病关联网络 · 探索疾病间的相互影响</p>
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

        <!-- 图例 -->
        <div class="flex flex-wrap gap-5 mt-5 pt-5 border-t border-slate-100">
          <div
            v-for="(color, group) in groupColors"
            :key="group"
            class="flex items-center gap-2.5"
          >
            <span
              class="w-4 h-4 rounded-full shadow-md"
              :style="{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }"
            ></span>
            <span class="text-sm font-medium text-slate-600">{{ group }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <div class="relative max-w-6xl mx-auto px-6 py-8">
      <!-- 控制面板 -->
      <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-5 mb-6">
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-3">
            <label class="text-sm font-semibold text-slate-700">节点大小：</label>
            <select
              v-model="sizeMode"
              class="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-4 py-2 rounded-xl cursor-pointer transition border-0 focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="patients">患者数量</option>
              <option value="fixed">固定大小</option>
              <option value="connections">关联数量</option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-sm font-semibold text-slate-700">边的粗细：</label>
            <select
              v-model="edgeMode"
              class="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-4 py-2 rounded-xl cursor-pointer transition border-0 focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="cooccurrence">共病强度</option>
              <option value="fixed">固定粗细</option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-sm font-semibold text-slate-700">布局：</label>
            <select
              v-model="layoutMode"
              class="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-4 py-2 rounded-xl cursor-pointer transition border-0 focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="force">力导向图</option>
              <option value="hierarchical">层级布局</option>
            </select>
          </div>

          <div class="ml-auto flex items-center gap-3">
            <button
              @click="resetView"
              class="flex items-center gap-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl transition font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              重置视图
            </button>
            <button
              @click="fitAll"
              class="flex items-center gap-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-5 py-2 rounded-xl transition shadow-lg shadow-cyan-500/25 font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
              </svg>
              显示全部
            </button>
          </div>
        </div>
      </div>

      <!-- 网络图 -->
      <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden">
        <div
          ref="networkContainer"
          class="w-full h-[650px]"
        ></div>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div class="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 text-white shadow-xl shadow-cyan-500/20">
          <div class="text-4xl font-bold mb-1">{{ diseaseNodes.length }}</div>
          <div class="text-cyan-100 text-sm font-medium">疾病种类</div>
          <div class="mt-3 w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
        <div class="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl shadow-teal-500/20">
          <div class="text-4xl font-bold mb-1">{{ diseaseEdges.length }}</div>
          <div class="text-teal-100 text-sm font-medium">共病关联</div>
          <div class="mt-3 w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-xl shadow-orange-500/20">
          <div class="text-4xl font-bold mb-1">{{ maxCooccurrence }}</div>
          <div class="text-orange-100 text-sm font-medium">最高共病次数</div>
          <div class="mt-3 w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-5 text-white shadow-xl shadow-purple-500/20">
          <div class="text-4xl font-bold mb-1">{{ totalPatients }}</div>
          <div class="text-purple-100 text-sm font-medium">总模拟患者数</div>
          <div class="mt-3 w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      <!-- 节点详情弹窗 -->
      <Transition name="modal">
        <div
          v-if="selectedNode"
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="selectedNode = null"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 transform transition-all">
            <div class="flex items-start justify-between mb-5">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-bold text-slate-800">{{ selectedNode.label }}</h3>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    :style="{ backgroundColor: groupColors[selectedNode.group] + '15', color: groupColors[selectedNode.group] }"
                  >
                    {{ selectedNode.group }}
                  </span>
                </div>
                <p class="text-slate-500 text-sm">{{ selectedNode.description }}</p>
              </div>
              <button
                @click="selectedNode = null"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="space-y-5">
              <div v-if="getRelatedEdges(selectedNode.id).length > 0">
                <div class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                  相关疾病
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="edge in getRelatedEdges(selectedNode.id)"
                    :key="edge.id"
                    class="inline-flex items-center gap-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition"
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :style="{ backgroundColor: groupColors[getNode(edge.from === selectedNode.id ? edge.to : edge.from)?.group || ''] }"
                    ></span>
                    {{ edge.label }}
                  </span>
                </div>
              </div>

              <div v-if="getRelatedEdges(selectedNode.id).length > 0">
                <div class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  关联强度
                </div>
                <div class="space-y-2">
                  <div
                    v-for="edge in getRelatedEdges(selectedNode.id)"
                    :key="edge.id"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="text-slate-600 font-medium">{{ edge.label }}</span>
                    <div class="flex items-center gap-2">
                      <div class="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          class="h-2 rounded-full transition-all duration-500"
                          :style="{
                            width: (edge.width / maxCooccurrence * 100) + '%',
                            backgroundColor: groupColors[getNode(edge.from === selectedNode.id ? edge.to : edge.from)?.group || ''] || '#888'
                          }"
                        ></div>
                      </div>
                      <span class="text-slate-400 w-6 text-right tabular-nums">{{ edge.width }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <router-link
              :to="{ path: '/recommendation', query: { diseases: selectedNode.id } }"
              class="mt-6 block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-cyan-500/25"
            >
              查看该疾病推荐方案 →
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
import { diseaseNodes, diseaseEdges, groupColors, type DiseaseNode, type DiseaseEdge } from '../data/diseaseNetwork'

// Refs
const networkContainer = ref<HTMLElement | null>(null)
const selectedNode = ref<DiseaseNode | null>(null)
const sizeMode = ref<'patients' | 'fixed' | 'connections'>('patients')
const edgeMode = ref<'cooccurrence' | 'fixed'>('cooccurrence')
const layoutMode = ref<'force' | 'hierarchical'>('force')

let network: Network | null = null

// Computed
const maxCooccurrence = computed(() => Math.max(...diseaseEdges.map(e => e.width)))
const totalPatients = computed(() => diseaseNodes.reduce((sum, n) => sum + n.size, 0))

// 计算每个节点的关联数量
const nodeConnectionCount = computed(() => {
  const counts: Record<string, number> = {}
  diseaseNodes.forEach(n => { counts[n.id] = 0 })
  diseaseEdges.forEach(e => {
    counts[e.from] = (counts[e.from] || 0) + 1
    counts[e.to] = (counts[e.to] || 0) + 1
  })
  return counts
})

// 获取节点
function getNode(id: string): DiseaseNode | undefined {
  return diseaseNodes.find(n => n.id === id)
}

// 获取相关边
function getRelatedEdges(nodeId: string): (DiseaseEdge & { id: string })[] {
  return diseaseEdges
    .filter(e => e.from === nodeId || e.to === nodeId)
    .map(e => {
      const otherId = e.from === nodeId ? e.to : e.from
      const otherNode = getNode(otherId)
      return {
        ...e,
        id: otherId,
        label: otherNode?.label || otherId,
      }
    })
}

// 构建vis数据
function buildVisData() {
  // 节点
  const nodes = diseaseNodes.map(node => {
    let size: number
    if (sizeMode.value === 'patients') {
      size = Math.max(node.size * 0.5, 18)
    } else if (sizeMode.value === 'fixed') {
      size = 28
    } else {
      size = Math.max((nodeConnectionCount.value[node.id] || 0) * 5, 18)
    }

    return {
      id: node.id,
      label: node.label,
      size,
      color: {
        background: groupColors[node.group] || '#888',
        border: groupColors[node.group] || '#888',
        highlight: {
          background: groupColors[node.group] || '#888',
          border: '#fff',
        },
        hover: {
          background: groupColors[node.group] || '#888',
          border: '#fff',
        },
      },
      font: {
        color: '#1e293b',
        size: 13,
        bold: {
          color: '#0f172a',
          size: 15,
        },
      },
      borderWidth: 3,
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.15)',
        size: 8,
        x: 0,
        y: 4,
      },
      title: `${node.label}\n${node.description}\n模拟患者数: ${node.size}`,
      group: node.group,
    }
  })

  // 边
  const edges = diseaseEdges.map(edge => ({
    from: edge.from,
    to: edge.to,
    width: edgeMode.value === 'cooccurrence' ? edge.width * 0.6 : 2,
    color: {
      color: 'rgba(148, 163, 184, 0.6)',
      highlight: 'rgba(100, 116, 139, 0.9)',
      hover: 'rgba(71, 85, 105, 0.9)',
    },
    smooth: {
      type: 'continuous',
    },
    title: `共病强度: ${edge.width}`,
    label: edge.label,
    font: {
      color: '#64748b',
      size: 11,
      strokeWidth: 0,
    },
  }))

  return { nodes: new DataSet(nodes as any), edges: new DataSet(edges as any) }
}

// 初始化网络图
function initNetwork() {
  if (!networkContainer.value) return

  const { nodes, edges } = buildVisData()

  const options = {
    nodes: {
      shape: 'dot',
      scaling: {
        min: 14,
        max: 55,
      },
    },
    edges: {
      arrows: {
        to: {
          enabled: false,
        },
      },
    },
    physics: {
      enabled: layoutMode.value === 'force',
      forceAtlas2Based: {
        gravitationalConstant: -120,
        centralGravity: 0.005,
        springLength: 280,
        springConstant: 0.04,
        damping: 0.4,
      },
      stabilization: {
        iterations: 300,
      },
    },
    layout: {
      improvedLayout: true,
      hierarchical: layoutMode.value === 'hierarchical' ? {
        enabled: true,
        direction: 'UD',
        sortMethod: 'directed',
        levelSeparation: 200,
        nodeSpacing: 250,
        treeSpacing: 100,
      } : undefined,
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      hideEdgesOnDrag: true,
      navigationButtons: false,
      keyboard: true,
    },
  }

  network = new Network(networkContainer.value, { nodes: nodes as any, edges: edges as any }, options)

  // 节点点击事件
  network.on('click', (params) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0]
      const node = getNode(nodeId)
      if (node) {
        selectedNode.value = node
      }
    } else {
      selectedNode.value = null
    }
  })
}

// 重置视图
function resetView() {
  if (network) {
    network.fit()
  }
}

// 显示全部
function fitAll() {
  if (network) {
    network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } })
  }
}

// 监听参数变化，重新构建图
watch([sizeMode, edgeMode, layoutMode], () => {
  if (network) {
    network.destroy()
    initNetwork()
  }
})

// 当选中节点时，聚焦该节点
watch(selectedNode, (node) => {
  if (network && node) {
    network.focus(node.id, {
      scale: 1.2,
      animation: { duration: 300, easingFunction: 'easeInOutQuad' },
    })
    network.selectNodes([node.id])
  }
})

onMounted(() => {
  initNetwork()
})

onUnmounted(() => {
  if (network) {
    network.destroy()
    network = null
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(10px);
}
</style>
