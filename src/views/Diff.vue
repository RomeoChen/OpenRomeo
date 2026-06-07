<script setup lang="ts">
import { ref, computed } from 'vue'
import { diffImages, diffColors } from '../data/diffData'

const currentIndex = ref(0)
const selectedDiffId = ref<string | null>(null)

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
    selectedDiffId.value = null
  }
}

function prevImage() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedDiffId.value = null
  }
}

function goToImage(index: number) {
  currentIndex.value = index
  selectedDiffId.value = null
}

function selectDiff(diffId: string) {
  selectedDiffId.value = selectedDiffId.value === diffId ? null : diffId
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

      <!-- Image Comparison Area - Vertical Scroll -->
      <div class="comparison-container">
        <!-- Left Column - Original -->
        <div class="image-column left-column">
          <div class="column-header">
            <span class="column-label">Original</span>
          </div>
          <div class="image-wrapper">
            <img :src="currentImage.leftImage" :alt="'Left ' + currentImage.id" class="diff-image" />
            <!-- SVG Overlay for Left -->
            <svg class="overlay-svg">
              <defs>
                <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <!-- Diff boxes -->
              <g v-for="diff in currentImage.diffs" :key="'left-' + diff.id">
                <!-- Semi-transparent background for all -->
                <rect
                  :x="diff.box.x"
                  :y="diff.box.y"
                  :width="diff.box.width"
                  :height="diff.box.height"
                  :fill="diffColors[diff.type]"
                  fill-opacity="0.15"
                  rx="4"
                  class="diff-region"
                  @click="selectDiff(diff.id)"
                  style="cursor: pointer"
                />
                
                <!-- Selected: solid border + dashed line to center -->
                <g v-if="selectedDiffId === diff.id">
                  <rect
                    :x="diff.box.x"
                    :y="diff.box.y"
                    :width="diff.box.width"
                    :height="diff.box.height"
                    :stroke="diffColors[diff.type]"
                    stroke-width="3"
                    fill="transparent"
                    rx="4"
                    filter="url(#glow-green)"
                  />
                  <!-- Dashed line to center -->
                  <line
                    :x1="diff.box.x + diff.box.width"
                    :y1="diff.box.y + diff.box.height / 2"
                    :x2="diff.box.x + diff.box.width + 40"
                    :y2="diff.box.y + diff.box.height / 2"
                    :stroke="diffColors[diff.type]"
                    stroke-width="2"
                    stroke-dasharray="6,3"
                  />
                  <!-- Label -->
                  <rect
                    :x="diff.box.x"
                    :y="diff.box.y - 28"
                    width="50"
                    height="22"
                    :fill="diffColors[diff.type]"
                    rx="4"
                  />
                  <text
                    :x="diff.box.x + 25"
                    :y="diff.box.y - 12"
                    fill="#000"
                    font-size="11"
                    font-weight="bold"
                    text-anchor="middle"
                  >
                    {{ diff.type }}
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>

        <!-- Center Divider with Lines -->
        <div class="center-divider" :class="{ 'has-selection': selectedDiffId }">
          <svg class="connector-svg" v-if="selectedDiffId">
            <path
              v-for="diff in currentImage.diffs.filter(d => d.id === selectedDiffId)"
              :key="'connector-' + diff.id"
              :d="`M 0 ${diff.box.y + diff.box.height / 2} L 40 ${diff.box.y + diff.box.height / 2}`"
              :stroke="diffColors[diff.type]"
              stroke-width="2"
              stroke-dasharray="6,3"
            />
          </svg>
          <div class="center-hint" v-if="!selectedDiffId">
            <span>点击差异点查看详情</span>
          </div>
        </div>

        <!-- Right Column - Modified -->
        <div class="image-column right-column">
          <div class="column-header">
            <span class="column-label">Modified</span>
          </div>
          <div class="image-wrapper">
            <img :src="currentImage.rightImage" :alt="'Right ' + currentImage.id" class="diff-image" />
            <!-- SVG Overlay for Right -->
            <svg class="overlay-svg">
              <!-- Diff boxes -->
              <g v-for="diff in currentImage.diffs" :key="'right-' + diff.id">
                <!-- Semi-transparent background for all -->
                <rect
                  :x="diff.box.x"
                  :y="diff.box.y"
                  :width="diff.box.width"
                  :height="diff.box.height"
                  :fill="diffColors[diff.type]"
                  fill-opacity="0.15"
                  rx="4"
                  class="diff-region"
                  @click="selectDiff(diff.id)"
                  style="cursor: pointer"
                />
                
                <!-- Selected: solid border + dashed line to center -->
                <g v-if="selectedDiffId === diff.id">
                  <rect
                    :x="diff.box.x"
                    :y="diff.box.y"
                    :width="diff.box.width"
                    :height="diff.box.height"
                    :stroke="diffColors[diff.type]"
                    stroke-width="3"
                    fill="transparent"
                    rx="4"
                    filter="url(#glow-green)"
                  />
                  <!-- Dashed line to center -->
                  <line
                    :x1="diff.box.x - 40"
                    :y1="diff.box.y + diff.box.height / 2"
                    :x2="diff.box.x"
                    :y2="diff.box.y + diff.box.height / 2"
                    :stroke="diffColors[diff.type]"
                    stroke-width="2"
                    stroke-dasharray="6,3"
                  />
                  <!-- Label -->
                  <rect
                    :x="diff.box.x"
                    :y="diff.box.y - 28"
                    width="50"
                    height="22"
                    :fill="diffColors[diff.type]"
                    rx="4"
                  />
                  <text
                    :x="diff.box.x + 25"
                    :y="diff.box.y - 12"
                    fill="#000"
                    font-size="11"
                    font-weight="bold"
                    text-anchor="middle"
                  >
                    {{ diff.type }}
                  </text>
                </g>
              </g>
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

      <!-- Selected Diff Details -->
      <div class="diff-details" v-if="selectedDiffId">
        <div class="details-card">
          <div class="details-header">
            <span class="details-title">差异点详情</span>
            <button class="close-btn" @click="selectedDiffId = null">×</button>
          </div>
          <div class="details-content">
            <div class="detail-row" v-for="diff in currentImage.diffs.filter(d => d.id === selectedDiffId)" :key="diff.id">
              <div class="detail-item">
                <span class="detail-label">ID</span>
                <span class="detail-value">{{ diff.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">类型</span>
                <span class="detail-value" :style="{ color: diffColors[diff.type] }">{{ diff.type }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">位置</span>
                <span class="detail-value">X: {{ diff.box.x }}, Y: {{ diff.box.y }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">尺寸</span>
                <span class="detail-value">{{ diff.box.width }} × {{ diff.box.height }}</span>
              </div>
            </div>
          </div>
        </div>
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

.image-counter {
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

/* Comparison Container - Vertical Layout */
.comparison-container {
  display: flex;
  gap: 0;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.image-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.column-header {
  padding: 12px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #666;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.image-wrapper {
  position: relative;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 400px);
}

.diff-image {
  width: 100%;
  display: block;
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

.diff-region {
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease;
}

.diff-region:hover {
  fill-opacity: 0.3;
}

/* Center Divider */
.center-divider {
  width: 60px;
  background: linear-gradient(180deg, 
    rgba(59, 130, 246, 0.05) 0%, 
    rgba(59, 130, 246, 0.1) 50%, 
    rgba(59, 130, 246, 0.05) 100%
  );
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-top: 20px;
}

.center-divider.has-selection {
  background: linear-gradient(180deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(59, 130, 246, 0.2) 50%, 
    rgba(59, 130, 246, 0.1) 100%
  );
}

.connector-svg {
  width: 60px;
  position: absolute;
  left: 0;
}

.center-hint {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 11px;
  color: #444;
  letter-spacing: 2px;
  padding: 10px 0;
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

/* Diff Details Panel */
.diff-details {
  margin-top: 24px;
}

.details-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(59, 130, 246, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.details-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: #888;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.details-content {
  padding: 20px;
}

.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
}

.detail-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #fff;
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

/* Responsive - Tablet & Mobile keep side-by-side */
@media (max-width: 1200px) {
  .detail-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .comparison-container {
    gap: 0;
  }
  
  .image-column {
    min-height: auto;
  }
  
  .image-wrapper {
    max-height: none;
    overflow-y: visible;
    padding: 10px;
  }
  
  .diff-image {
    width: 100%;
    height: auto;
  }
  
  .overlay-svg {
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
  }
  
  .center-divider {
    width: 40px;
    padding-top: 10px;
  }
  
  .connector-svg {
    width: 40px;
  }
}

@media (max-width: 768px) {
  .diff-main {
    padding: 15px;
  }
  
  .diff-header {
    padding: 40px 20px 30px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .stats-center {
    order: -1;
    gap: 20px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .comparison-container {
    flex-direction: row;
    border-radius: 12px;
  }
  
  .image-column {
    flex: 1;
    min-width: 0;
  }
  
  .column-header {
    padding: 8px;
    font-size: 10px;
  }
  
  .image-wrapper {
    padding: 8px;
    min-height: 200px;
  }
  
  .diff-image {
    border-radius: 6px;
  }
  
  .overlay-svg {
    top: 8px;
    left: 8px;
    width: calc(100% - 16px);
    height: calc(100% - 16px);
  }
  
  .center-divider {
    width: 30px;
    min-width: 30px;
    padding-top: 8px;
  }
  
  .connector-svg {
    width: 30px;
  }
  
  .center-hint {
    font-size: 9px;
    letter-spacing: 1px;
  }
  
  .navigation {
    padding: 12px;
    gap: 12px;
  }
  
  .nav-btn {
    padding: 10px 14px;
    font-size: 12px;
  }
  
  .thumbnail {
    min-width: 30px;
    height: 30px;
    font-size: 10px;
  }
  
  .details-content {
    padding: 15px;
  }
  
  .detail-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .detail-value {
    font-size: 12px;
  }
  
  .legend {
    gap: 20px;
    padding: 12px;
  }
  
  .legend-text {
    font-size: 11px;
  }
  
  .diff-footer {
    padding: 20px;
    margin-top: 20px;
  }
}

/* Small mobile - 480px and below */
@media (max-width: 480px) {
  .diff-page {
    font-size: 14px;
  }
  
  .comparison-container {
    border-radius: 8px;
  }
  
  .image-wrapper {
    padding: 5px;
    min-height: 150px;
  }
  
  .overlay-svg {
    top: 5px;
    left: 5px;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
  }
  
  .center-divider {
    width: 24px;
    min-width: 24px;
    padding-top: 5px;
  }
  
  .center-hint {
    font-size: 8px;
  }
  
  .stat-item {
    gap: 4px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .stat-value {
    font-size: 14px;
  }
  
  .thumbnail-strip {
    gap: 4px;
  }
  
  .thumbnail {
    min-width: 26px;
    height: 26px;
    font-size: 9px;
    border-radius: 4px;
  }
}
</style>
