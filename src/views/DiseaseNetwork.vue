<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">慢病共病网络图</h1>
            <p class="text-sm text-gray-500 mt-1">基于患者共病数据构建的疾病关联网络</p>
          </div>
          <router-link to="/" class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
            ← 返回首页
          </router-link>
        </div>

        <!-- 图例 -->
        <div class="flex flex-wrap gap-4 mt-4">
          <div
            v-for="(color, group) in groupColors"
            :key="group"
            class="flex items-center gap-2 text-sm"
          >
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: color }"
            ></span>
            <span class="text-gray-700">{{ group }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- 控制面板 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">节点大小：</label>
            <select
              v-model="sizeMode"
              class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="patients">患者数量</option>
              <option value="fixed">固定大小</option>
              <option value="connections">关联数量</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">边的粗细：</label>
            <select
              v-model="edgeMode"
              class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="cooccurrence">共病强度</option>
              <option value="fixed">固定粗细</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">布局：</label>
            <select
              v-model="layoutMode"
              class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="force">力导向图</option>
              <option value="hierarchical">层级布局</option>
            </select>
          </div>

          <div class="ml-auto flex items-center gap-2">
            <button
              @click="resetView"
              class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg transition"
            >
              重置视图
            </button>
            <button
              @click="fitAll"
              class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition"
            >
              显示全部
            </button>
          </div>
        </div>
      </div>

      <!-- 网络图 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div
          ref="networkContainer"
          class="w-full h-[600px]"
        ></div>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-white rounded-xl shadow-sm p-4 text-center">
          <div class="text-3xl font-bold text-blue-600">{{ diseaseNodes.length }}</div>
          <div class="text-sm text-gray-500 mt-1">疾病种类</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 text-center">
          <div class="text-3xl font-bold text-green-600">{{ diseaseEdges.length }}</div>
          <div class="text-sm text-gray-500 mt-1">共病关联</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 text-center">
          <div class="text-3xl font-bold text-orange-600">{{ maxCooccurrence }}</div>
          <div class="text-sm text-gray-500 mt-1">最高共病次数</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 text-center">
          <div class="text-3xl font-bold text-purple-600">{{ totalPatients }}</div>
          <div class="text-sm text-gray-500 mt-1">总模拟患者数</div>
        </div>
      </div>

      <!-- 节点详情弹窗 -->
      <Transition name="fade">
        <div
          v-if="selectedNode"
          class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          @click.self="selectedNode = null"
        >
          <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ selectedNode.label }}</h3>
                <span
                  class="inline-block text-xs px-2 py-0.5 rounded-full mt-1"
                  :style="{ backgroundColor: groupColors[selectedNode.group] + '20', color: groupColors[selectedNode.group] }"
                >
                  {{ selectedNode.group }}
                </span>
              </div>
              <button
                @click="selectedNode = null"
                class="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p class="text-gray-600 text-sm mb-4">{{ selectedNode.description }}</p>

            <div class="space-y-3">
              <div>
                <div class="text-sm font-medium text-gray-700 mb-1">相关疾病</div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="edge in getRelatedEdges(selectedNode.id)"
                    :key="edge.id"
                    class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {{ edge.label }}
                  </span>
                </div>
              </div>

              <div>
                <div class="text-sm font-medium text-gray-700 mb-1">关联强度分布</div>
                <div class="space-y-1">
                  <div
                    v-for="edge in getRelatedEdges(selectedNode.id)"
                    :key="edge.id"
                    class="flex items-center justify-between text-xs"
                  >
                    <span class="text-gray-600">{{ edge.label }}</span>
                    <div class="flex items-center gap-2">
                      <div class="w-20 bg-gray-200 rounded-full h-1.5">
                        <div
                          class="h-1.5 rounded-full"
                          :style="{
                            width: (edge.width / maxCooccurrence * 100) + '%',
                            backgroundColor: groupColors[getNode(edge.from === selectedNode.id ? edge.to : edge.from)?.group || ''] || '#888'
                          }"
                        ></div>
                      </div>
                      <span class="text-gray-500 w-6 text-right">{{ edge.width }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <router-link
              :to="{ path: '/recommendation', query: { diseases: selectedNode.id } }"
              class="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
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
      size = Math.max(node.size * 0.5, 15)
    } else if (sizeMode.value === 'fixed') {
      size = 25
    } else {
      size = Math.max((nodeConnectionCount.value[node.id] || 0) * 5, 15)
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
        color: '#333',
        size: 14,
        bold: {
          color: '#111',
          size: 16,
        },
      },
      borderWidth: 2,
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.2)',
        size: 4,
        x: 2,
        y: 2,
      },
      // 存储额外信息
      title: `${node.label}\n${node.description}\n模拟患者数: ${node.size}`,
      group: node.group,
    }
  })

  // 边
  const edges = diseaseEdges.map(edge => ({
    from: edge.from,
    to: edge.to,
    width: edgeMode.value === 'cooccurrence' ? edge.width * 0.5 : 2,
    color: {
      color: '#CBD5E1',
      highlight: '#94A3B8',
      hover: '#64748B',
    },
    smooth: {
      type: 'continuous',
    },
    title: `共病强度: ${edge.width}`,
    label: edge.label,
    font: {
      color: '#94A3B8',
      size: 10,
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
        min: 12,
        max: 50,
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
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springLength: 150,
        springConstant: 0.08,
      },
      stabilization: {
        iterations: 200,
      },
    },
    layout: {
      improvedLayout: true,
      hierarchical: layoutMode.value === 'hierarchical' ? {
        enabled: true,
        direction: 'UD',
        sortMethod: 'directed',
        levelSeparation: 100,
        nodeSpacing: 150,
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
