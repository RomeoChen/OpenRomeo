<script setup lang="ts">
import { ref, computed } from 'vue'
import { diffImages, diffColors } from '../data/diffData'

const currentIndex = ref(0)

const currentImage = computed(() => diffImages[currentIndex.value])

const diffStats = computed(() => {
  const d = currentImage.value
  return {
    新增: d.diffs.filter(x => x.type === '新增').length,
    修改: d.diffs.filter(x => x.type === '修改').length,
    删除: d.diffs.filter(x => x.type === '删除').length,
    总计: d.diffs.length,
  }
})

function nextImage() {
  if (currentIndex.value < diffImages.length - 1) {
    currentIndex.value++
  }
}

function prevImage() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function goToImage(index: number) {
  currentIndex.value = index
}

// Get line coordinates for connecting diff boxes
function getLineCoords(diff: typeof currentImage.value.diffs[0], isLeft: boolean) {
  const box = diff.box
  const y = box.y + box.height / 2
  
  if (isLeft) {
    return { x1: box.x + box.width, y1: y, x2: box.x + box.width + 30, y2: y }
  } else {
    return { x1: box.x - 30, y1: y, x2: box.x, y2: y }
  }
}

// SVG lines between left and right
const svgLines = computed(() => {
  if (!currentImage.value) return []
  return currentImage.value.diffs.map(diff => ({
    id: diff.id,
    type: diff.type,
    leftLine: getLineCoords(diff, true),
    rightLine: getLineCoords(diff, false),
    leftBox: diff.box,
    rightBox: diff.box,
  }))
})
</script>

<template>
  <div class="diff-page">
    <!-- Header -->
    <header class="diff-header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-text">ROME</span><span class="logo-accent">O</span>
        </div>
        <h1 class="page-title">Image Diff Viewer</h1>
        <p class="page-subtitle">Visual Comparison Tool</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="diff-main">
      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stats-left">
          <span class="image-counter">
            Image {{ currentIndex + 1 }} / {{ diffImages.length }}
          </span>
        </div>
        <div class="stats-center">
          <div class="stat-item stat-add">
            <span class="stat-dot"></span>
            <span class="stat-label">新增</span>
            <span class="stat-value">{{ diffStats.新增 }}</span>
          </div>
          <div class="stat-item stat-modify">
            <span class="stat-dot"></span>
            <span class="stat-label">修改</span>
            <span class="stat-value">{{ diffStats.修改 }}</span>
          </div>
          <div class="stat-item stat-delete">
            <span class="stat-dot"></span>
            <span class="stat-label">删除</span>
            <span class="stat-value">{{ diffStats.删除 }}</span>
          </div>
        </div>
        <div class="stats-right">
          <span class="total-label">Total:</span>
          <span class="total-value">{{ diffStats.总计 }}</span>
        </div>
      </div>

      <!-- Image Comparison Area -->
      <div class="comparison-container">
        <!-- Left Image -->
        <div class="image-panel left-panel">
          <div class="panel-label">Original</div>
          <div class="image-wrapper">
            <img :src="currentImage.leftImage" :alt="'Left ' + currentImage.id" class="diff-image" />
            <svg class="overlay-svg left-svg">
              <rect
                v-for="diff in currentImage.diffs"
                :key="'left-' + diff.id"
                :x="diff.box.x"
                :y="diff.box.y"
                :width="diff.box.width"
                :height="diff.box.height"
                :stroke="diffColors[diff.type]"
                stroke-width="3"
                fill="transparent"
                rx="4"
              />
              <!-- Connection lines from boxes to center -->
              <line
                v-for="diff in currentImage.diffs"
                :key="'left-line-' + diff.id"
                :x1="diff.box.x + diff.box.width"
                :y1="diff.box.y + diff.box.height / 2"
                :x2="diff.box.x + diff.box.width + 20"
                :y2="diff.box.y + diff.box.height / 2"
                :stroke="diffColors[diff.type]"
                stroke-width="2"
                stroke-dasharray="4,2"
              />
              <!-- Type labels -->
              <text
                v-for="diff in currentImage.diffs"
                :key="'left-label-' + diff.id"
                :x="diff.box.x"
                :y="diff.box.y - 8"
                :fill="diffColors[diff.type]"
                font-size="12"
                font-weight="bold"
              >
                {{ diff.type }}
              </text>
            </svg>
          </div>
        </div>

        <!-- Center Divider with Lines -->
        <div class="center-divider">
          <svg class="connector-svg">
            <line
              v-for="line in svgLines"
              :key="'center-' + line.id"
              :x1="800 + 20"
              :y1="line.leftBox.y + line.leftBox.height / 2"
              :x2="800 + 60"
              :y2="line.rightBox.y + line.rightBox.height / 2"
              :stroke="diffColors[line.type]"
              stroke-width="2"
              stroke-dasharray="4,2"
            />
          </svg>
        </div>

        <!-- Right Image -->
        <div class="image-panel right-panel">
          <div class="panel-label">Modified</div>
          <div class="image-wrapper">
            <img :src="currentImage.rightImage" :alt="'Right ' + currentImage.id" class="diff-image" />
            <svg class="overlay-svg right-svg">
              <rect
                v-for="diff in currentImage.diffs"
                :key="'right-' + diff.id"
                :x="diff.box.x"
                :y="diff.box.y"
                :width="diff.box.width"
                :height="diff.box.height"
                :stroke="diffColors[diff.type]"
                stroke-width="3"
                fill="transparent"
                rx="4"
              />
              <!-- Connection lines from center to boxes -->
              <line
                v-for="diff in currentImage.diffs"
                :key="'right-line-' + diff.id"
                :x1="diff.box.x - 20"
                :y1="diff.box.y + diff.box.height / 2"
                :x2="diff.box.x"
                :y2="diff.box.y + diff.box.height / 2"
                :stroke="diffColors[diff.type]"
                stroke-width="2"
                stroke-dasharray="4,2"
              />
              <!-- Type labels -->
              <text
                v-for="diff in currentImage.diffs"
                :key="'right-label-' + diff.id"
                :x="diff.box.x"
                :y="diff.box.y - 8"
                :fill="diffColors[diff.type]"
                font-size="12"
                font-weight="bold"
              >
                {{ diff.type }}
              </text>
            </svg>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="navigation">
        <button class="nav-btn" @click="prevImage" :disabled="currentIndex === 0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          Previous
        </button>
        
        <div class="thumbnail-strip">
          <button
            v-for="(img, idx) in diffImages"
            :key="img.id"
            class="thumbnail"
            :class="{ active: idx === currentIndex }"
            @click="goToImage(idx)"
          >
            {{ idx + 1 }}
          </button>
        </div>

        <button class="nav-btn" @click="nextImage" :disabled="currentIndex === diffImages.length - 1">
          Next
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>

      <!-- Legend -->
      <div class="legend">
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
  position: relative;
}

.logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0.5;
}

.logo-text {
  color: #e0e0e0;
}

.logo-accent {
  color: #3b82f6;
}

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

.stats-left,
.stats-right {
  flex: 1;
}

.stats-right {
  text-align: right;
}

.stats-center {
  display: flex;
  gap: 32px;
  justify-content: center;
}

.image-counter {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #888;
}

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

.stat-label {
  font-size: 13px;
  color: #888;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

/* Comparison Container */
.comparison-container {
  display: flex;
  gap: 0;
  align-items: stretch;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.image-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-label {
  padding: 12px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #666;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.image-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 500px;
}

.diff-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.overlay-svg {
  position: absolute;
  top: 20px;
  left: 20px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  pointer-events: none;
}

.left-svg {
  width: 50%;
  left: 20px;
}

.right-svg {
  width: 50%;
  right: 20px;
}

.center-divider {
  width: 80px;
  background: linear-gradient(180deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(59, 130, 246, 0.2) 50%, 
    rgba(59, 130, 246, 0.1) 100%
  );
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.connector-svg {
  width: 80px;
  height: 100%;
  position: absolute;
}

/* Navigation */
.navigation {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #3b82f6;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.thumbnail-strip {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
}

.thumbnail {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #888;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.thumbnail:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.thumbnail.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Legend */
.legend {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 24px;
  padding: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid;
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
  .comparison-container {
    flex-direction: column;
  }
  
  .center-divider {
    width: 100%;
    height: 60px;
    border-left: none;
    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .connector-svg {
    width: 100%;
    height: 60px;
  }
  
  .image-wrapper {
    min-height: 350px;
  }
}
</style>
