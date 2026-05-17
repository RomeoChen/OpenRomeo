<template>
  <div class="min-h-screen bg-slate-950 overflow-hidden" ref="containerRef">
    <!-- 背景粒子层 -->
    <div class="fixed inset-0 pointer-events-none" ref="particleLayer">
      <canvas ref="bgCanvas" class="w-full h-full opacity-30"></canvas>
    </div>

    <!-- 装饰性渐变光晕 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-violet-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-bl from-emerald-500/8 to-teal-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <!-- 顶部导航 -->
    <header class="relative z-20 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-white">慢病 3D 星图</h1>
          <p class="text-xs text-slate-400">3D 疾病关系可视化 · 拖拽旋转 · 滚轮缩放</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- 控制面板切换 -->
        <button
          @click="showControls = !showControls"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition',
            showControls
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
          ]"
        >
          {{ showControls ? '隐藏控制' : '显示控制' }}
        </button>

        <router-link 
          to="/" 
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600 transition text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          返回
        </router-link>
      </div>
    </header>

    <!-- 3D 可视化主区域 -->
    <div 
      class="relative w-full h-[calc(100vh-80px)] cursor-grab active:cursor-grabbing"
      ref="vizContainer"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      @wheel.prevent="onWheel"
      @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend.prevent="onTouchEnd"
    >
      <svg ref="svgRef" class="w-full h-full" :viewBox="`0 0 ${width} ${height}`">
        <defs>
          <!-- 发光滤镜 -->
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glowStrong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <!-- 边发光 -->
          <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <!-- 渐变 -->
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="white" stop-opacity="1"/>
            <stop offset="30%" stop-color="white" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- 变换组 -->
        <g :transform="`translate(${width/2}, ${height/2}) rotate(${rotation.x}) scale(${scale})`">
          <g :transform="`rotate(${rotation.y})`">
            <!-- 3D 变换组 -->
            <g :transform="`translateY(${translate.y})`">
              <!-- 连接线 -->
              <g class="connections">
                <g v-for="link in links" :key="`${link.source.id}-${link.target.id}`">
                  <!-- 主连接线 -->
                  <line
                    :x1="project(link.source).x"
                    :y1="project(link.source).y"
                    :x2="project(link.target).x"
                    :y2="project(link.target).y"
                    :stroke="getEdgeColor(link)"
                    :stroke-opacity="getEdgeOpacity(link)"
                    :stroke-width="getEdgeWidth(link)"
                    stroke-linecap="round"
                    filter="url(#edgeGlow)"
                    class="transition-all duration-300"
                  />
                  <!-- 发光背景线 -->
                  <line
                    :x1="project(link.source).x"
                    :y1="project(link.source).y"
                    :x2="project(link.target).x"
                    :y2="project(link.target).y"
                    :stroke="getEdgeColor(link)"
                    :stroke-opacity="getEdgeOpacity(link) * 0.3"
                    :stroke-width="getEdgeWidth(link) * 3"
                    stroke-linecap="round"
                  />
                </g>
              </g>

              <!-- 节点 -->
              <g class="nodes">
                <g 
                  v-for="node in nodes" 
                  :key="node.id"
                  :transform="`translate(${project(node).x}, ${project(node).y})`"
                  class="cursor-pointer"
                  @mouseenter="onNodeHover(node)"
                  @mouseleave="onNodeLeave"
                  @click="onNodeClick(node)"
                >
                  <!-- 外层光晕 -->
                  <circle
                    :r="getNodeRadius(node) * 3"
                    :fill="groupColors[node.group] || '#888'"
                    :fill-opacity="getNodeOpacity(node) * 0.1"
                    class="transition-all duration-300"
                  />
                  <!-- 中层光晕 -->
                  <circle
                    :r="getNodeRadius(node) * 2"
                    :fill="groupColors[node.group] || '#888'"
                    :fill-opacity="getNodeOpacity(node) * 0.2"
                    class="transition-all duration-300"
                  />
                  <!-- 节点主体 -->
                  <circle
                    :r="getNodeRadius(node)"
                    :fill="groupColors[node.group] || '#888'"
                    :fill-opacity="getNodeOpacity(node)"
                    :filter="hoveredNode === node ? 'url(#glowStrong)' : 'url(#glow)'"
                    class="transition-all duration-300"
                    :class="{ 'animate-pulse': hoveredNode === node }"
                  />
                  <!-- 节点高光 -->
                  <circle
                    :r="getNodeRadius(node) * 0.4"
                    cy="-0.3"
                    fill="white"
                    :fill-opacity="getNodeOpacity(node) * 0.6"
                  />
                  <!-- 节点标签 -->
                  <text
                    :y="getNodeRadius(node) + 16"
                    text-anchor="middle"
                    :fill="getNodeOpacity(node) > 0.5 ? '#fff' : '#94a3b8'"
                    :fill-opacity="getNodeOpacity(node)"
                    class="text-xs font-medium pointer-events-none select-none"
                    :style="{ fontSize: '11px' }"
                  >
                    {{ node.label }}
                  </text>
                  <!-- 标签背景 -->
                  <rect
                    :x="-getNodeRadius(node) - 10"
                    :y="getNodeRadius(node) + 4"
                    :width="getNodeRadius(node) * 2 + 20"
                    :height="14"
                    :fill="'#0f172a'"
                    :fill-opacity="getNodeOpacity(node) * 0.7"
                    :rx="4"
                    class="pointer-events-none"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>

      <!-- 悬停信息卡片 -->
      <Transition name="fade">
        <div
          v-if="hoveredNode"
          class="absolute z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl pointer-events-none"
          :style="{
            left: mousePos.x + 20 + 'px',
            top: mousePos.y - 20 + 'px',
            maxWidth: '240px'
          }"
        >
          <div class="flex items-center gap-2 mb-2">
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: groupColors[hoveredNode.group] || '#888', boxShadow: `0 0 8px ${groupColors[hoveredNode.group]}` }"
            ></span>
            <span class="font-bold text-white">{{ hoveredNode.label }}</span>
          </div>
          <p class="text-xs text-slate-400 mb-2">{{ hoveredNode.description }}</p>
          <div class="flex gap-3 text-xs">
            <span class="text-slate-300">患者: <span class="text-emerald-400 font-semibold">{{ hoveredNode.size }}</span></span>
            <span class="text-slate-300">分组: <span class="text-purple-400 font-semibold">{{ hoveredNode.group }}</span></span>
          </div>
        </div>
      </Transition>

      <!-- 控制面板 -->
      <Transition name="slide">
        <div
          v-if="showControls"
          class="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-2xl z-20"
        >
          <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            视图控制
          </h3>
          
          <div class="space-y-4">
            <!-- 节点大小模式 -->
            <div>
              <label class="text-xs text-slate-400 mb-1.5 block">节点大小</label>
              <div class="flex gap-2">
                <button
                  v-for="mode in sizeModes"
                  :key="mode.value"
                  @click="sizeMode = mode.value"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition',
                    sizeMode === mode.value
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
                  ]"
                >
                  {{ mode.label }}
                </button>
              </div>
            </div>

            <!-- 布局模式 -->
            <div>
              <label class="text-xs text-slate-400 mb-1.5 block">布局</label>
              <div class="flex gap-2">
                <button
                  v-for="mode in layoutModes"
                  :key="mode.value"
                  @click="setLayout(mode.value)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition',
                    currentLayout === mode.value
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
                  ]"
                >
                  {{ mode.label }}
                </button>
              </div>
            </div>

            <!-- 深度效果 -->
            <div class="flex items-center justify-between">
              <label class="text-xs text-slate-400">深度效果</label>
              <button
                @click="depthEffect = !depthEffect"
                :class="[
                  'w-10 h-5 rounded-full transition relative',
                  depthEffect ? 'bg-purple-500' : 'bg-slate-700'
                ]"
              >
                <span
                  :class="[
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                    depthEffect ? 'left-5' : 'left-0.5'
                  ]"
                ></span>
              </button>
            </div>

            <!-- 动画效果 -->
            <div class="flex items-center justify-between">
              <label class="text-xs text-slate-400">粒子动画</label>
              <button
                @click="particleAnimation = !particleAnimation"
                :class="[
                  'w-10 h-10 h-5 rounded-full transition relative',
                  particleAnimation ? 'bg-cyan-500' : 'bg-slate-700'
                ]"
              >
                <span
                  :class="[
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                    particleAnimation ? 'left-5' : 'left-0.5'
                  ]"
                ></span>
              </button>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-700/50">
            <p class="text-xs text-slate-500">
              🖱️ 拖拽旋转 · 滚轮缩放<br/>
              🔍 悬停查看详情 · 点击锁定
            </p>
          </div>
        </div>
      </Transition>

      <!-- 图例 -->
      <div class="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl z-20">
        <h4 class="text-xs font-semibold text-slate-400 mb-3">疾病分组</h4>
        <div class="space-y-2">
          <div
            v-for="(color, group) in groupColors"
            :key="group"
            class="flex items-center gap-2"
          >
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }"
            ></span>
            <span class="text-xs text-slate-300">{{ group }}</span>
          </div>
        </div>
      </div>

      <!-- 统计 -->
      <div class="absolute top-20 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl z-20">
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-white">{{ nodes.length }}</div>
            <div class="text-xs text-slate-400">疾病</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{{ links.length }}</div>
            <div class="text-xs text-slate-400">关联</div>
          </div>
        </div>
      </div>

      <!-- 锁定提示 -->
      <div
        v-if="selectedNode"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-md border border-purple-500/30 rounded-2xl px-6 py-3 shadow-2xl z-20"
      >
        <p class="text-sm text-purple-300">
          🔒 已锁定 {{ selectedNode.label }} — 点击空白处解除
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force'
import { diseaseNodes, diseaseEdges, groupColors, type DiseaseNode } from '../data/diseaseNetwork'

// 引用
const containerRef = ref<HTMLElement | null>(null)
const vizContainer = ref<HTMLElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)
const bgCanvas = ref<HTMLCanvasElement | null>(null)

// 尺寸
const width = ref(1200)
const height = ref(800)

// 交互状态
const hoveredNode = ref<DiseaseNode | null>(null)
const selectedNode = ref<DiseaseNode | null>(null)
const mousePos = reactive({ x: 0, y: 0 })

// 变换
const rotation = reactive({ x: -20, y: 0 })
const translate = reactive({ y: 0 })
const scale = ref(1)
const targetScale = ref(1)

// 控制
const showControls = ref(true)
const sizeMode = ref<'patients' | 'fixed' | 'connections'>('patients')
const currentLayout = ref('force')
const depthEffect = ref(true)
const particleAnimation = ref(true)

// 鼠标交互
const isDragging = ref(false)
const lastMouse = { x: 0, y: 0 }
const velocity = { x: 0, y: 0 }

// 节点和连线
interface SimNode extends DiseaseNode {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}
interface SimLink {
  source: SimNode
  target: SimNode
  width: number
  label?: string
}

const nodes = ref<SimNode[]>([])
const links = ref<SimLink[]>([])

// 模拟器
let simulation: any = null
let animationId: number | null = null

// 背景粒子
let bgParticles: any[] = []
let bgCtx: CanvasRenderingContext2D | null = null

// 尺寸模式
const sizeModes = [
  { label: '患者数', value: 'patients' as const },
  { label: '固定', value: 'fixed' as const },
  { label: '关联数', value: 'connections' as const },
]

// 布局模式
const layoutModes = [
  { label: '力导向', value: 'force' as const },
  { label: '球形', value: 'sphere' as const },
  { label: '平面', value: 'flat' as const },
]

// 计算节点关联数
const connectionCount = computed(() => {
  const counts: Record<string, number> = {}
  diseaseNodes.forEach(n => { counts[n.id] = 0 })
  diseaseEdges.forEach(e => {
    counts[e.from] = (counts[e.from] || 0) + 1
    counts[e.to] = (counts[e.to] || 0) + 1
  })
  return counts
})

// 获取节点半径
function getNodeRadius(node: SimNode): number {
  if (sizeMode.value === 'patients') {
    return Math.max(8, Math.min(28, node.size * 0.15))
  } else if (sizeMode.value === 'fixed') {
    return 18
  } else {
    const count = connectionCount.value[node.id] || 0
    return Math.max(8, Math.min(28, count * 4))
  }
}

// 3D 投影
function project(node: SimNode) {
  const perspective = 800
  const z = node.z || 0
  const scale3d = perspective / (perspective + z * (depthEffect.value ? 0.5 : 0))
  
  return {
    x: node.x * scale3d,
    y: node.y * scale3d,
    scale: scale3d,
  }
}

// 获取节点透明度（基于 z 深度）
function getNodeOpacity(node: SimNode): number {
  if (!depthEffect.value) return 1
  const z = node.z || 0
  return Math.max(0.3, Math.min(1, 0.5 + (z + 150) / 400))
}

// 获取边透明度
function getEdgeOpacity(link: SimLink): number {
  if (!depthEffect.value) return 0.4
  const avgZ = ((link.source.z || 0) + (link.target.z || 0)) / 2
  return Math.max(0.1, Math.min(0.5, 0.3 + (avgZ + 150) / 500))
}

// 获取边颜色
function getEdgeColor(link: SimLink): string {
  const sourceGroup = (link.source as SimNode).group
  return groupColors[sourceGroup] || '#64748b'
}

// 获取边宽度
function getEdgeWidth(link: SimLink): number {
  return Math.max(1, Math.min(4, link.width * 0.3))
}

// 初始化力导向模拟
function initForceSimulation() {
  const simNodes: SimNode[] = diseaseNodes.map(n => ({
    ...n,
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 400,
    z: (Math.random() - 0.5) * 200,
    vx: 0, vy: 0, vz: 0,
  }))

  const nodeMap = new Map(simNodes.map(n => [n.id, n]))
  const simLinks: SimLink[] = diseaseEdges.map(e => ({
    source: nodeMap.get(e.from)!,
    target: nodeMap.get(e.to)!,
    width: e.width,
    label: e.label,
  })).filter(l => l.source && l.target)

  simulation = forceSimulation(simNodes)
    .force('link', forceLink(simLinks).id((d: any) => d.id).distance(150).strength(0.5))
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceCenter(0, 0))
    .force('collision', forceCollide().radius(40))
    .force('z', (alpha: number) => {
      simNodes.forEach((n: any) => {
        n.vz += (Math.random() - 0.5) * 0.5 * alpha
        n.vz *= 0.95
        n.z += n.vz
        n.z = Math.max(-150, Math.min(150, n.z))
      })
    })
    .on('tick', () => {
      nodes.value = simNodes
      links.value = simLinks
    })

  nodes.value = simNodes
  links.value = simLinks
}

// 设置布局
function setLayout(layout: string) {
  currentLayout.value = layout
  
  if (!nodes.value.length) return

  if (layout === 'sphere') {
    // 球形布局
    const count = nodes.value.length
    const phi = Math.PI * (3 - Math.sqrt(5)) // 黄金角度
    nodes.value.forEach((node, i) => {
      const y = 1 - (i / (count - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = phi * i
      node.x = Math.cos(theta) * radius * 300
      node.y = y * 300
      node.z = Math.sin(theta) * radius * 150
      node.vx = 0; node.vy = 0; node.vz = 0
    })
    // 更新连线
    const nodeMap = new Map(nodes.value.map(n => [n.id, n]))
    links.value = diseaseEdges.map(e => ({
      source: nodeMap.get(e.from)!,
      target: nodeMap.get(e.to)!,
      width: e.width,
      label: e.label,
    })).filter(l => l.source && l.target)
  } else if (layout === 'flat') {
    // 平面布局（分散在 xy 平面）
    nodes.value.forEach((node, i) => {
      const row = Math.floor(i / 4)
      const col = i % 4
      node.x = (col - 2) * 200 + (Math.random() - 0.5) * 50
      node.y = (row - 2) * 180 + (Math.random() - 0.5) * 50
      node.z = (Math.random() - 0.5) * 50
    })
    const nodeMap = new Map(nodes.value.map(n => [n.id, n]))
    links.value = diseaseEdges.map(e => ({
      source: nodeMap.get(e.from)!,
      target: nodeMap.get(e.to)!,
      width: e.width,
      label: e.label,
    })).filter(l => l.source && l.target)
  } else {
    // 力导向
    initForceSimulation()
  }
}

// 鼠标事件
function onMouseDown(e: MouseEvent) {
  isDragging.value = true
  lastMouse.x = e.clientX
  lastMouse.y = e.clientY
  velocity.x = 0
  velocity.y = 0
}

function onMouseMove(e: MouseEvent) {
  mousePos.x = e.clientX
  mousePos.y = e.clientY

  if (isDragging.value) {
    const dx = e.clientX - lastMouse.x
    const dy = e.clientY - lastMouse.y
    
    if (selectedNode.value) {
      // 锁定模式下移动节点
      const node = nodes.value.find(n => n.id === selectedNode.value!.id)
      if (node) {
        node.x += dx * 2
        node.y += dy * 2
        simulation?.alpha(0.3).restart()
      }
    } else {
      rotation.y += dx * 0.5
      rotation.x = Math.max(-60, Math.min(60, rotation.x - dy * 0.3))
      translate.y += dy * 0.5
    }
    
    velocity.x = dx
    velocity.y = dy
    lastMouse.x = e.clientX
    lastMouse.y = e.clientY
  }
}

function onMouseUp() {
  isDragging.value = false
}

function onWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  targetScale.value = Math.max(0.3, Math.min(3, targetScale.value * delta))
}

// 触摸事件
let lastTouch: { x: number; y: number; dist: number } = { x: 0, y: 0, dist: 0 }

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    lastTouch.x = e.touches[0].clientX
    lastTouch.y = e.touches[0].clientY
  } else if (e.touches.length === 2) {
    lastTouch.dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - lastTouch.x
    const dy = e.touches[0].clientY - lastTouch.y
    rotation.y += dx * 0.5
    rotation.x = Math.max(-60, Math.min(60, rotation.x - dy * 0.3))
    lastTouch.x = e.touches[0].clientX
    lastTouch.y = e.touches[0].clientY
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    if (lastTouch.dist) {
      const delta = dist / lastTouch.dist
      targetScale.value = Math.max(0.3, Math.min(3, targetScale.value * delta))
    }
    lastTouch.dist = dist
  }
}

function onTouchEnd() {
  lastTouch.dist = 0
  lastTouch.x = 0
  lastTouch.y = 0
}

// 节点交互
function onNodeHover(node: DiseaseNode) {
  hoveredNode.value = node
}

function onNodeLeave() {
  hoveredNode.value = null
}

function onNodeClick(node: DiseaseNode) {
  if (selectedNode.value?.id === node.id) {
    selectedNode.value = null
  } else {
    selectedNode.value = node
  }
}

// 背景粒子
function initBackgroundParticles() {
  if (!bgCanvas.value) return
  bgCtx = bgCanvas.value.getContext('2d')
  if (!bgCtx) return

  const canvas = bgCanvas.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // 创建粒子
  for (let i = 0; i < 100; i++) {
    bgParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    })
  }
}

function animateBackground() {
  if (!bgCtx || !bgCanvas.value) return
  
  const canvas = bgCanvas.value
  bgCtx.clearRect(0, 0, canvas.width, canvas.height)

  bgParticles.forEach(p => {
    if (particleAnimation.value) {
      p.x += p.speedX
      p.y += p.speedY
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0
    }

    bgCtx!.beginPath()
    bgCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    bgCtx!.fillStyle = `rgba(147, 197, 253, ${p.opacity})`
    bgCtx!.fill()
  })

  animationId = requestAnimationFrame(animateBackground)
}

// 尺寸插值动画
function animate() {
  scale.value += (targetScale.value - scale.value) * 0.1
  
  // 惯性
  if (!isDragging.value) {
    velocity.x *= 0.95
    velocity.y *= 0.95
    if (Math.abs(velocity.x) > 0.1) {
      rotation.y += velocity.x * 0.3
    }
  }

  requestAnimationFrame(animate)
}

// 窗口调整
function onResize() {
  if (vizContainer.value) {
    width.value = vizContainer.value.clientWidth
    height.value = vizContainer.value.clientHeight
  }
  if (bgCanvas.value) {
    bgCanvas.value.width = window.innerWidth
    bgCanvas.value.height = window.innerHeight
  }
}

onMounted(() => {
  onResize()
  initForceSimulation()
  initBackgroundParticles()
  animateBackground()
  animate()

  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (simulation) simulation.stop()
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.animate-pulse {
  animation: nodePulse 1.5s ease-in-out infinite;
}

@keyframes nodePulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
