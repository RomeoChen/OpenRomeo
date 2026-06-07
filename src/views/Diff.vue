<script setup lang="ts">
import { ref, computed } from 'vue'
import { diffImages, diffColors } from '../data/diffData'

const selectedDiffId = ref<string | null>(null)

// 计算每个图片对的累计高度（用于 SVG 连线定位）
const imagePairs = computed(() => {
  const imagesPerRow = 800 // 每张图片展示高度
  const gap = 60 // 行间距
  
  return diffImages.map((img, index) => {
    const topOffset = index * (imagesPerRow + gap)
    return {
      ...img,
      topOffset,
      height: imagesPerRow
    }
  })
})

// 总高度
const totalHeight = computed(() => {
  return diffImages.length * (800 + 60) + 200
})

function selectDiff(diffId: string) {
  selectedDiffId.value = selectedDiffId.value === diffId ? null : diffId
}

// 生成连接线的路径 - 从左侧框边缘直接连到右侧框边缘
function getConnectionPath(diff: typeof diffImages[0]['diffs'][0], imageTopOffset: number) {
  // 布局: 左图(0-400) + 中心分隔(400-460) + 右图(460-860)
  // 中心分隔 = 60px
  const leftColRight = 400  // 左侧列右边缘（也是左图右边缘）
  const rightColLeft = 460  // 右侧列左边缘（也是右图左边缘）
  
  // 框的位置（相对于各自图片区域）
  const boxLeft = diff.box.x
  const boxTop = imageTopOffset + 20 + diff.box.y
  const boxCenterY = boxTop + diff.box.height / 2
  const boxRight = diff.box.x + diff.box.width
  
  // 连线起点：左侧框的右边缘
  const startX = leftColRight + boxRight  // 直接在左图右边缘上
  // 连线终点：右侧框的左边缘
  const endX = rightColLeft + boxLeft    // 直接在右图左边缘上
  
  // 贝塞尔曲线控制点：让曲线平滑穿过中间区域
  const cpOffset = Math.abs(endX - startX) * 0.3
  
  return `M ${startX} ${boxCenterY} C ${startX + cpOffset} ${boxCenterY}, ${endX - cpOffset} ${boxCenterY}, ${endX} ${boxCenterY}`
}
</script>

<template>
  <div class="diff-page">
    <!-- Header -->
    <header class="diff-header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-text">ROME</span><span class="logo-accent">O</span>
        </div>
        <h1 class="page-title">🔍 Image Diff Viewer</h1>
        <p class="page-subtitle">Visual Comparison Tool</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="diff-main">
      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stats-left">
          <span class="total-images">{{ diffImages.length }} 组图片对比</span>
        </div>
        <div class="stats-center">
          <div class="stat-item stat-add">
            <span class="stat-dot"></span>
            <span class="stat-label">新增</span>
            <span class="stat-value">{{ diffImages.reduce((sum, img) => sum + img.diffs.filter(d => d.type === '新增').length, 0) }}</span>
          </div>
          <div class="stat-item stat-modify">
            <span class="stat-dot"></span>
            <span class="stat-label">修改</span>
            <span class="stat-value">{{ diffImages.reduce((sum, img) => sum + img.diffs.filter(d => d.type === '修改').length, 0) }}</span>
          </div>
          <div class="stat-item stat-delete">
            <span class="stat-dot"></span>
            <span class="stat-label">删除</span>
            <span class="stat-value">{{ diffImages.reduce((sum, img) => sum + img.diffs.filter(d => d.type === '删除').length, 0) }}</span>
          </div>
        </div>
        <div class="stats-right">
          <span class="total-label">总计:</span>
          <span class="total-value">{{ diffImages.reduce((sum, img) => sum + img.diffs.length, 0) }}</span>
        </div>
      </div>

      <!-- All Images Comparison -->
      <div class="comparison-container">
        <!-- Column Headers -->
        <div class="column-headers">
          <div class="column-header left-header">Original</div>
          <div class="column-header right-header">Modified</div>
        </div>
        
        <!-- Image Rows Container -->
        <div class="images-wrapper">
          <!-- SVG Overlay for Connections -->
          <svg class="connections-overlay" :height="totalHeight">
            <defs>
              <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- Connection paths for all diffs -->
            <g v-for="(pair, pIndex) in imagePairs" :key="'connections-' + pIndex">
              <g v-for="diff in pair.diffs" :key="'path-' + diff.id">
                <path
                  :d="getConnectionPath(diff, pair.topOffset)"
                  :stroke="diffColors[diff.type]"
                  :stroke-width="selectedDiffId === diff.id ? 3 : 1.5"
                  :stroke-opacity="selectedDiffId ? (selectedDiffId === diff.id ? 1 : 0.2) : 0.6"
                  fill="none"
                  :stroke-dasharray="selectedDiffId === diff.id ? 'none' : '6,4'"
                  @click="selectDiff(diff.id)"
                  style="cursor: pointer"
                />
                <!-- Connection circles at endpoints when selected -->
                <g v-if="selectedDiffId === diff.id">
                  <circle
                    :cx="400 + diff.box.x + diff.box.width"
                    :cy="pair.topOffset + 20 + diff.box.y + diff.box.height / 2"
                    r="5"
                    :fill="diffColors[diff.type]"
                  />
                  <circle
                    :cx="460 + diff.box.x"
                    :cy="pair.topOffset + 20 + diff.box.y + diff.box.height / 2"
                    r="5"
                    :fill="diffColors[diff.type]"
                  />
                </g>
              </g>
            </g>
          </svg>
          
          <!-- Left Column -->
          <div class="image-column left-column">
            <div
              v-for="(pair, pIndex) in imagePairs"
              :key="'left-' + pair.id"
              class="image-row"
              :style="{ marginTop: pIndex > 0 ? '60px' : '0' }"
            >
              <div class="image-label">#{{ pair.id }}</div>
              <div class="image-container">
                <img :src="pair.leftImage" :alt="'Left ' + pair.id" class="diff-image" />
                <!-- Diff overlays for left -->
                <svg class="image-overlay" :viewBox="`0 0 800 ${pair.height}`">
                  <g v-for="diff in pair.diffs" :key="'left-' + diff.id">
                    <!-- Semi-transparent background -->
                    <rect
                      :x="diff.box.x"
                      :y="diff.box.y"
                      :width="diff.box.width"
                      :height="diff.box.height"
                      :fill="diffColors[diff.type]"
                      :fill-opacity="selectedDiffId === diff.id ? 0.3 : 0.15"
                      :stroke="diffColors[diff.type]"
                      :stroke-width="selectedDiffId === diff.id ? 3 : 1.5"
                      :stroke-opacity="selectedDiffId ? (selectedDiffId === diff.id ? 1 : 0.2) : 0.6"
                      rx="4"
                      class="diff-box"
                      @click="selectDiff(diff.id)"
                      style="cursor: pointer"
                    />
                    <!-- Label -->
                    <rect
                      :x="diff.box.x"
                      :y="diff.box.y - 26"
                      width="50"
                      height="22"
                      :fill="diffColors[diff.type]"
                      rx="4"
                      v-if="selectedDiffId === diff.id"
                    />
                    <text
                      :x="diff.box.x + 25"
                      :y="diff.box.y - 10"
                      fill="#000"
                      font-size="11"
                      font-weight="bold"
                      text-anchor="middle"
                      v-if="selectedDiffId === diff.id"
                    >
                      {{ diff.type }}
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Center Divider -->
          <div class="center-divider">
            <div class="divider-line"></div>
          </div>
          
          <!-- Right Column -->
          <div class="image-column right-column">
            <div
              v-for="(pair, pIndex) in imagePairs"
              :key="'right-' + pair.id"
              class="image-row"
              :style="{ marginTop: pIndex > 0 ? '60px' : '0' }"
            >
              <div class="image-label">#{{ pair.id }}</div>
              <div class="image-container">
                <img :src="pair.rightImage" :alt="'Right ' + pair.id" class="diff-image" />
                <!-- Diff overlays for right -->
                <svg class="image-overlay" :viewBox="`0 0 800 ${pair.height}`">
                  <g v-for="diff in pair.diffs" :key="'right-' + diff.id">
                    <!-- Semi-transparent background -->
                    <rect
                      :x="diff.box.x"
                      :y="diff.box.y"
                      :width="diff.box.width"
                      :height="diff.box.height"
                      :fill="diffColors[diff.type]"
                      :fill-opacity="selectedDiffId === diff.id ? 0.3 : 0.15"
                      :stroke="diffColors[diff.type]"
                      :stroke-width="selectedDiffId === diff.id ? 3 : 1.5"
                      :stroke-opacity="selectedDiffId ? (selectedDiffId === diff.id ? 1 : 0.2) : 0.6"
                      rx="4"
                      class="diff-box"
                      @click="selectDiff(diff.id)"
                      style="cursor: pointer"
                    />
                    <!-- Label -->
                    <rect
                      :x="diff.box.x"
                      :y="diff.box.y - 26"
                      width="50"
                      height="22"
                      :fill="diffColors[diff.type]"
                      rx="4"
                      v-if="selectedDiffId === diff.id"
                    />
                    <text
                      :x="diff.box.x + 25"
                      :y="diff.box.y - 10"
                      fill="#000"
                      font-size="11"
                      font-weight="bold"
                      text-anchor="middle"
                      v-if="selectedDiffId === diff.id"
                    >
                      {{ diff.type }}
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item" @click="selectedDiffId = null" style="cursor: pointer">
          <span class="legend-box all"></span>
          <span class="legend-text">全部显示</span>
        </div>
        <div class="legend-item">
          <span class="legend-box add"></span>
          <span class="legend-text">新增 (Added)</span>
        </div>
        <div class="legend-item">
          <span class="legend-box modify"></span>
          <span class="legend-text">修改 (Modified)</span>
        </div>
        <div class="legend-item">
          <span class="legend-box delete"></span>
          <span class="legend-text">删除 (Deleted)</span>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="diff-footer">
      <p>© 2026 Romeo Chen · Image Diff Viewer</p>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');

* {
  box-sizing: border-box;
}

.diff-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
}

.diff-header {
  padding: 60px 40px 40px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%);
}

.logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0.5;
}

.logo-text { color: #e0e0e0; }
.logo-accent { color: #3b82f6; }

.page-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 2px;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #666;
  margin: 0;
}

.diff-main {
  max-width: 1800px;
  margin: 0 auto;
  padding: 30px 40px;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  margin-bottom: 30px;
}

.stats-center {
  display: flex;
  gap: 32px;
  justify-content: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.stat-add .stat-dot {
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.stat-modify .stat-dot {
  background: #eab308;
  box-shadow: 0 0 8px rgba(234, 179, 8, 0.5);
}

.stat-delete .stat-dot {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.stat-label { font-size: 13px; color: #888; }

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.total-images {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #888;
}

.stats-right { text-align: right; }

.total-label {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
}

.total-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

/* Comparison Container */
.comparison-container {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.column-headers {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.column-header {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #666;
  background: rgba(0, 0, 0, 0.3);
}

.left-header {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.images-wrapper {
  display: flex;
  position: relative;
  min-height: 1000px;
}

/* SVG Overlay */
.connections-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.connections-overlay path {
  pointer-events: stroke;
}

/* Image Columns */
.image-column {
  flex: 1;
  padding: 20px;
}

.image-row {
  position: relative;
}

.image-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #555;
  margin-bottom: 8px;
  padding-left: 4px;
}

.image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
}

.diff-image {
  width: 100%;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.diff-box {
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Center Divider */
.center-divider {
  width: 60px;
  min-width: 60px;
  background: linear-gradient(180deg, 
    rgba(59, 130, 246, 0.05) 0%, 
    rgba(59, 130, 246, 0.1) 50%, 
    rgba(59, 130, 246, 0.05) 100%
  );
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.divider-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, 
    rgba(59, 130, 246, 0.2) 0%, 
    rgba(59, 130, 246, 0.4) 50%, 
    rgba(59, 130, 246, 0.2) 100%
  );
}

/* Legend */
.legend {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  padding: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.2s;
}

.legend-item:hover {
  opacity: 0.8;
}

.legend-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid;
}

.legend-box.all {
  background: linear-gradient(135deg, #22c55e 33%, #eab308 33% 66%, #ef4444 66%);
  border-color: #fff;
}

.legend-box.add {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.legend-box.modify {
  border-color: #eab308;
  background: rgba(234, 179, 8, 0.1);
}

.legend-box.delete {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.legend-text {
  font-size: 13px;
  color: #888;
}

/* Footer */
.diff-footer {
  text-align: center;
  padding: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 40px;
}

.diff-footer p {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #444;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .diff-main {
    padding: 20px;
  }
  
  .stats-bar {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .stats-center {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 900px) {
  .images-wrapper {
    flex-direction: column;
  }
  
  .center-divider {
    width: 100%;
    height: 30px;
    min-width: unset;
    border-left: none;
    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .divider-line {
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: 2px;
  }
  
  .image-column {
    padding: 10px;
  }
  
  .connections-overlay {
    display: none;
  }
  
  .legend {
    gap: 20px;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .diff-header {
    padding: 40px 20px 30px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .diff-main {
    padding: 15px;
  }
  
  .stats-bar {
    padding: 12px 16px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .legend {
    gap: 16px;
    padding: 12px;
  }
  
  .legend-text {
    font-size: 11px;
  }
}
</style>
