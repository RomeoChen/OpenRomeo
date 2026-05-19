<template>
  <div class="min-h-screen bg-slate-950 overflow-hidden" ref="containerRef">
    <!-- 背景星空 -->
    <canvas ref="bgCanvas" class="fixed inset-0 w-full h-full opacity-40"></canvas>

    <!-- 装饰光晕 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
    </div>

    <!-- 顶部导航 -->
    <header class="relative z-20 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-white">模拟地球 3D</h1>
          <p class="text-xs text-slate-400">拖拽旋转 · 滚轮缩放</p>
        </div>
      </div>

      <router-link 
        to="/" 
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600/50 transition text-sm font-medium"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        返回
      </router-link>
    </header>

    <!-- 3D 地球 -->
    <div 
      class="relative w-full h-[calc(100vh-80px)] flex items-center justify-center cursor-grab active:cursor-grabbing"
      ref="globeContainer"
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
          <!-- 地球渐变 -->
          <radialGradient id="globeGradient" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#1e3a5f"/>
            <stop offset="50%" stop-color="#0f2744"/>
            <stop offset="100%" stop-color="#050d1a"/>
          </radialGradient>
          
          <!-- 球体光效 -->
          <radialGradient id="sphereHighlight" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stop-color="rgba(147, 197, 253, 0.15)"/>
            <stop offset="100%" stop-color="rgba(147, 197, 253, 0)"/>
          </radialGradient>

          <!-- 大气层光晕 -->
          <filter id="atmosphereGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- 大陆发光 -->
          <filter id="landGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g :transform="`translate(${width/2}, ${height/2}) scale(${scale})`">
          <!-- 外层大气 -->
          <circle
            :r="globeRadius + 15"
            fill="none"
            stroke="rgba(147, 197, 253, 0.1)"
            stroke-width="20"
            filter="url(#atmosphereGlow)"
          />

          <!-- 地球主体 -->
          <circle
            :r="globeRadius"
            fill="url(#globeGradient)"
            stroke="rgba(147, 197, 253, 0.2)"
            stroke-width="1"
          />

          <!-- 经纬网格 -->
          <g v-if="showGrid" :opacity="0.1">
            <circle v-for="i in 12" :key="'lat'+i" 
              :r="globeRadius * Math.cos((i - 6) * 15 * Math.PI / 180)"
              fill="none"
              stroke="rgba(147, 197, 253, 0.3)"
              stroke-width="0.5"
            />
          </g>

          <!-- 大陆 -->
          <g :transform="`rotate(${rotation.lon})`">
            <path
              v-for="(feature, idx) in worldFeatures"
              :key="idx"
              :d="getPath(feature)"
              :fill="hoveredContinent === feature.properties.name ? '#22d3ee' : '#334155'"
              :stroke="hoveredContinent === feature.properties.name ? '#22d3ee' : '#475569'"
              :stroke-width="hoveredContinent === feature.properties.name ? 1.5 : 0.5"
              :opacity="hoveredContinent === feature.properties.name ? 1 : 0.8"
              :filter="hoveredContinent === feature.properties.name ? 'url(#landGlow)' : 'none'"
              class="cursor-pointer transition-all duration-200"
              @mouseenter="onContinentHover(feature)"
              @mouseleave="onContinentLeave"
              @click="onContinentClick(feature)"
            />
          </g>

          <!-- 高光层 -->
          <circle
            :r="globeRadius"
            fill="url(#sphereHighlight)"
            pointer-events="none"
          />
        </g>
      </svg>

      <!-- 悬停信息卡片 -->
      <Transition name="fade">
        <div
          v-if="hoveredContinent && continentInfo"
          class="absolute z-30 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 shadow-2xl pointer-events-none min-w-[180px]"
          :style="{ left: mousePos.x + 20 + 'px', top: mousePos.y - 20 + 'px' }"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="w-3 h-3 rounded-full bg-cyan-400" style="box-shadow: 0 0 8px #22d3ee"></span>
            <span class="font-bold text-white">{{ hoveredContinent }}</span>
          </div>
          <p class="text-xs text-slate-400">{{ continentInfo }}</p>
        </div>
      </Transition>

      <!-- 控制面板 -->
      <div class="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl z-20">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <input type="checkbox" v-model="showGrid" class="w-4 h-4 rounded bg-slate-800 border-slate-600">
            显示网格
          </label>
        </div>
      </div>

      <!-- 洲名列表 -->
      <div class="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl z-20">
        <h4 class="text-xs font-semibold text-slate-400 mb-3">七大洲</h4>
        <div class="grid grid-cols-2 gap-x-6 gap-y-1.5">
          <div 
            v-for="continent in continents"
            :key="continent.name"
            class="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition"
            @click="focusContinent(continent)"
          >
            <span 
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: continent.color, boxShadow: `0 0 6px ${continent.color}` }"
            ></span>
            <span class="text-xs text-slate-300">{{ continent.name }}</span>
          </div>
        </div>
      </div>

      <!-- 提示 -->
      <div class="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-full px-4 py-2 shadow-2xl z-20">
        <p class="text-xs text-slate-400">🖱️ 拖拽旋转 · 滚轮缩放 · 点击大洲查看详情</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'


const containerRef = ref<HTMLElement | null>(null)
const globeContainer = ref<HTMLElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)
const bgCanvas = ref<HTMLCanvasElement | null>(null)

const width = ref(1000)
const height = ref(700)
const globeRadius = 280

const rotation = reactive({ lon: 0, lat: 0 })
const scale = ref(1)
const targetScale = ref(1)

const showGrid = ref(false)
const hoveredContinent = ref<string | null>(null)
const continentInfo = ref<string | null>(null)
const mousePos = reactive({ x: 0, y: 0 })

const isDragging = ref(false)
const lastMouse = { x: 0, y: 0 }
const velocity = { x: 0, y: 0 }

let worldData: any = null
let worldFeatures: any[] = []
let bgParticles: any[] = []
let bgCtx: CanvasRenderingContext2D | null = null
let animationId: number | null = null

const continents = [
  { name: '亚洲', color: '#f87171', center: [100, 40] },
  { name: '非洲', color: '#fbbf24', center: [20, 0] },
  { name: '北美洲', color: '#34d399', center: [-100, 45] },
  { name: '南美洲', color: '#60a5fa', center: [-60, -15] },
  { name: '欧洲', color: '#a78bfa', center: [15, 50] },
  { name: '大洋洲', color: '#f472b6', center: [140, -25] },
  { name: '南极洲', color: '#e2e8f0', center: [0, -90] },
]

const continentDescriptions: Record<string, string> = {
  '亚洲': '世界上最大的洲，人口最多的大陆',
  '非洲': '第二大洲，拥有最长的河流尼罗河',
  '北美洲': '包含美国、加拿大等国家',
  '南美洲': '以亚马逊雨林和足球闻名',
  '欧洲': '工业化和现代化程度最高的大洲',
  '大洋洲': '包括澳大利亚、新西兰等国家',
  '南极洲': '地球最南端，被冰层覆盖的大陆',
}

const projection = computed(() => {
  return d3.geoOrthographic()
    .scale(globeRadius)
    .translate([0, 0])
    .rotate([-rotation.lon, -rotation.lat, 0])
    .clipAngle(90)
})

const pathGenerator = computed(() => {
  return d3.geoPath().projection(projection.value)
})

function getPath(feature: any): string {
  return pathGenerator.value(feature) || ''
}

async function loadWorldData() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    const topology = await response.json()
    worldData = topojson.feature(topology, topology.objects.countries)
    worldFeatures = worldData.features
  } catch (error) {
    console.error('Failed to load world data:', error)
  }
}

function initBackgroundParticles() {
  if (!bgCanvas.value) return
  bgCtx = bgCanvas.value.getContext('2d')
  if (!bgCtx) return

  const canvas = bgCanvas.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  for (let i = 0; i < 150; i++) {
    bgParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
    })
  }
}

function animateBackground() {
  if (!bgCtx || !bgCanvas.value) return
  
  const canvas = bgCanvas.value
  bgCtx.clearRect(0, 0, canvas.width, canvas.height)

  bgParticles.forEach(p => {
    p.x += p.speedX
    p.y += p.speedY
    if (p.x < 0) p.x = canvas.width
    if (p.x > canvas.width) p.x = 0
    if (p.y < 0) p.y = canvas.height
    if (p.y > canvas.height) p.y = 0

    bgCtx!.beginPath()
    bgCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    bgCtx!.fillStyle = `rgba(147, 197, 253, ${p.opacity})`
    bgCtx!.fill()
  })

  animationId = requestAnimationFrame(animateBackground)
}

function animate() {
  // 惯性旋转
  if (!isDragging.value) {
    rotation.lon += velocity.x * 0.1
    rotation.lat = Math.max(-60, Math.min(60, rotation.lat + velocity.y * 0.05))
    velocity.x *= 0.98
    velocity.y *= 0.98
  }

  // 缩放插值
  scale.value += (targetScale.value - scale.value) * 0.1

  // 自动缓慢旋转（当不交互时）
  if (!isDragging.value && Math.abs(velocity.x) < 0.1) {
    rotation.lon += 0.05
  }

  requestAnimationFrame(animate)
}

function onResize() {
  if (globeContainer.value) {
    width.value = globeContainer.value.clientWidth
    height.value = globeContainer.value.clientHeight
  }
  if (bgCanvas.value) {
    bgCanvas.value.width = window.innerWidth
    bgCanvas.value.height = window.innerHeight
  }
}

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
    rotation.lon += dx * 0.5
    rotation.lat = Math.max(-60, Math.min(60, rotation.lat - dy * 0.3))
    velocity.x = dx * 0.3
    velocity.y = dy * 0.3
    lastMouse.x = e.clientX
    lastMouse.y = e.clientY
  }
}

function onMouseUp() {
  isDragging.value = false
}

function onWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  targetScale.value = Math.max(0.5, Math.min(2.5, targetScale.value * delta))
}

let lastTouches: { x: number; y: number; dist?: number }[] = []

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    lastTouches = [
      { x: e.touches[0].clientX, y: e.touches[0].clientY }
    ]
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    lastTouches = [
      { x: e.touches[0].clientX, y: e.touches[0].clientY, dist }
    ]
  }
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (e.touches.length === 1 && lastTouches.length >= 1) {
    const dx = e.touches[0].clientX - lastTouches[0].x
    const dy = e.touches[0].clientY - lastTouches[0].y
    rotation.lon += dx * 0.5
    rotation.lat = Math.max(-60, Math.min(60, rotation.lat - dy * 0.3))
    lastTouches[0] = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  } else if (e.touches.length === 2 && lastTouches.length >= 1 && lastTouches[0].dist) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    const delta = dist / lastTouches[0].dist!
    targetScale.value = Math.max(0.5, Math.min(2.5, targetScale.value * delta))
    lastTouches[0].dist = dist
  }
}

function onTouchEnd() {
  lastTouches = []
}

function onContinentHover(feature: any) {
  const name = feature.properties?.name || feature.properties?.continent || '未知地区'
  hoveredContinent.value = name
  continentInfo.value = continentDescriptions[name] || '世界上的一片大陆'
}

function onContinentLeave() {
  hoveredContinent.value = null
  continentInfo.value = null
}

function onContinentClick(feature: any) {
  const name = feature.properties?.name || feature.properties?.continent || '未知地区'
  hoveredContinent.value = name
  continentInfo.value = continentDescriptions[name] || '世界上的一片大陆'
}

function focusContinent(continent: { name: string; center: number[] }) {
  // 将视角转向指定大洲
  const targetLon = -continent.center[0]
  const targetLat = -continent.center[1]
  
  // 动画过渡
  const startLon = rotation.lon
  const startLat = rotation.lat
  const duration = 1000
  const startTime = Date.now()

  function animateFocus() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    rotation.lon = startLon + (targetLon - startLon) * eased
    rotation.lat = startLat + (targetLat - startLat) * eased

    if (progress < 1) {
      requestAnimationFrame(animateFocus)
    }
  }

  animateFocus()
}

onMounted(async () => {
  onResize()
  await loadWorldData()
  initBackgroundParticles()
  animateBackground()
  animate()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
