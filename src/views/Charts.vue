<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import {
  NConfigProvider,
  darkTheme,
} from 'naive-ui'

// Register ECharts components
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  LineChart as LineChartComponent,
  BarChart as BarChartComponent,
  PieChart as PieChartComponent,
  RadarChart as RadarChartComponent,
  GaugeChart as GaugeChartComponent,
  ScatterChart as ScatterChartComponent,
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
  GeoComponent,
  DataZoomComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  RadarChartComponent,
  GaugeChartComponent,
  ScatterChartComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
  GeoComponent,
  DataZoomComponent,
])

const isDark = ref(true)
const themeOverrides = {
  common: {
    primaryColor: '#d4af37',
    primaryColorHover: '#f5d060',
    primaryColorPressed: '#b8942e',
    borderRadius: '8px',
  },
  Card: {
    color: 'rgba(30, 30, 30, 0.8)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
}

// Chart refs
const lineChartRef = ref<HTMLDivElement>()
const barChartRef = ref<HTMLDivElement>()
const pieChartRef = ref<HTMLDivElement>()
const radarChartRef = ref<HTMLDivElement>()
const gaugeChartRef = ref<HTMLDivElement>()
const scatterChartRef = ref<HTMLDivElement>()

let charts: echarts.ECharts[] = []

// Luxury color palette
const colors = {
  gold: '#d4af37',
  champagne: '#f5e6c8',
  darkBg: '#0a0a0a',
  cardBg: 'rgba(20, 20, 20, 0.9)',
  accent: '#c9a227',
  textGold: '#d4af37',
  textGray: '#888888',
  gradient1: '#d4af37',
  gradient2: '#8b7355',
}

const lineOption: echarts.EChartsOption = {
  backgroundColor: 'transparent',
  title: {
    text: 'Performance Metrics',
    subtext: 'Monthly Revenue & Growth',
    left: 'center',
    top: 20,
    textStyle: {
      color: colors.gold,
      fontSize: 20,
      fontWeight: 'normal',
      fontFamily: 'Georgia, serif',
    },
    subtextStyle: {
      color: colors.textGray,
      fontSize: 12,
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderColor: colors.gold,
    textStyle: { color: colors.champagne },
  },
  legend: {
    data: ['Revenue', 'Growth'],
    top: 80,
    textStyle: { color: colors.textGray },
  },
  grid: { left: '10%', right: '10%', top: '25%', bottom: '15%' },
  xAxis: {
    type: 'category',
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
    axisLabel: { color: colors.textGray },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
    axisLabel: { color: colors.textGray },
    splitLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.1)' } },
  },
  series: [
    {
      name: 'Revenue',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [820, 932, 1401, 2134, 1890, 2300],
      lineStyle: { color: colors.gold, width: 3 },
      itemStyle: { color: colors.gold, borderWidth: 2, borderColor: '#fff' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(212, 175, 55, 0.4)' },
          { offset: 1, color: 'rgba(212, 175, 55, 0)' },
        ]),
      },
    },
    {
      name: 'Growth',
      type: 'line',
      smooth: true,
      symbol: 'diamond',
      symbolSize: 8,
      data: [12, 23, 45, 34, 78, 90],
      lineStyle: { color: colors.champagne, width: 2 },
      itemStyle: { color: colors.champagne, borderWidth: 2, borderColor: colors.gold },
    },
  ],
}

const barOption: echarts.EChartsOption = {
  backgroundColor: 'transparent',
  title: {
    text: 'Distribution Analysis',
    subtext: 'Market Share by Sector',
    left: 'center',
    top: 20,
    textStyle: { color: colors.gold, fontSize: 20, fontFamily: 'Georgia, serif' },
    subtextStyle: { color: colors.textGray, fontSize: 12 },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderColor: colors.gold,
    textStyle: { color: colors.champagne },
  },
  legend: {
    data: ['Tech', 'Finance', 'Healthcare', 'Retail'],
    top: 80,
    textStyle: { color: colors.textGray },
  },
  grid: { left: '10%', right: '10%', top: '25%', bottom: '15%' },
  xAxis: {
    type: 'category',
    data: ['Q1', 'Q2', 'Q3', 'Q4'],
    axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
    axisLabel: { color: colors.textGray },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
    axisLabel: { color: colors.textGray },
    splitLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.1)' } },
  },
  series: [
    {
      name: 'Tech',
      type: 'bar',
      data: [320, 432, 501, 634],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#d4af37' },
          { offset: 1, color: '#8b7355' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
      barWidth: '35%',
    },
    {
      name: 'Finance',
      type: 'bar',
      data: [220, 382, 431, 524],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#f5e6c8' },
          { offset: 1, color: '#c9a227' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
      barWidth: '35%',
    },
    {
      name: 'Healthcare',
      type: 'bar',
      data: [180, 252, 331, 414],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#a0a0a0' },
          { offset: 1, color: '#606060' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
      barWidth: '35%',
    },
    {
      name: 'Retail',
      type: 'bar',
      data: [120, 182, 231, 314],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#c9a227' },
          { offset: 1, color: '#8b7355' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
      barWidth: '35%',
    },
  ],
}

const pieOption: echarts.EChartsOption = {
  backgroundColor: 'transparent',
  title: {
    text: 'Portfolio Allocation',
    subtext: 'Asset Distribution',
    left: 'center',
    top: 20,
    textStyle: { color: colors.gold, fontSize: 20, fontFamily: 'Georgia, serif' },
    subtextStyle: { color: colors.textGray, fontSize: 12 },
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderColor: colors.gold,
    textStyle: { color: colors.champagne },
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: { color: colors.textGray },
  },
  series: [
    {
      name: 'Allocation',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#0a0a0a',
        borderWidth: 3,
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: colors.gold,
        },
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(212, 175, 55, 0.5)',
        },
      },
      labelLine: { show: false },
      data: [
        { value: 42, name: 'Stocks', itemStyle: { color: colors.gold } },
        { value: 25, name: 'Bonds', itemStyle: { color: colors.champagne } },
        { value: 18, name: 'Real Estate', itemStyle: { color: '#8b7355' } },
        { value: 10, name: 'Crypto', itemStyle: { color: '#c9a227' } },
        { value: 5, name: 'Cash', itemStyle: { color: '#606060' } },
      ],
    },
  ],
}

const radarOption: echarts.EChartsOption = {
  backgroundColor: 'transparent',
  title: {
    text: 'Skill Matrix',
    subtext: 'Competency Assessment',
    left: 'center',
    top: 20,
    textStyle: { color: colors.gold, fontSize: 20, fontFamily: 'Georgia, serif' },
    subtextStyle: { color: colors.textGray, fontSize: 12 },
  },
  tooltip: {
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderColor: colors.gold,
    textStyle: { color: colors.champagne },
  },
  legend: {
    data: ['Current Level', 'Target Level'],
    bottom: 20,
    textStyle: { color: colors.textGray },
  },
  radar: {
    center: ['50%', '55%'],
    radius: '65%',
    shape: 'polygon',
    indicator: [
      { name: 'Frontend', max: 100 },
      { name: 'Backend', max: 100 },
      { name: 'DevOps', max: 100 },
      { name: 'AI/ML', max: 100 },
      { name: 'System Design', max: 100 },
      { name: 'Leadership', max: 100 },
    ],
    axisName: { color: colors.textGray, fontSize: 12 },
    splitArea: { areaStyle: { color: ['rgba(212, 175, 55, 0.05)', 'rgba(212, 175, 55, 0.1)'] } },
    axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
    splitLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.2)' } },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [85, 72, 65, 80, 75, 60],
          name: 'Current Level',
          lineStyle: { color: colors.gold, width: 2 },
          areaStyle: { color: 'rgba(212, 175, 55, 0.2)' },
          itemStyle: { color: colors.gold },
          symbol: 'circle',
          symbolSize: 6,
        },
        {
          value: [95, 85, 80, 90, 85, 80],
          name: 'Target Level',
          lineStyle: { color: colors.champagne, width: 2, type: 'dashed' },
          areaStyle: { color: 'rgba(245, 230, 200, 0.1)' },
          itemStyle: { color: colors.champagne },
          symbol: 'rect',
          symbolSize: 6,
        },
      ],
    },
  ],
}

const gaugeOption: echarts.EChartsOption = {
  backgroundColor: 'transparent',
  title: {
    text: 'System Health',
    subtext: 'Performance Index',
    left: 'center',
    top: 20,
    textStyle: { color: colors.gold, fontSize: 20, fontFamily: 'Georgia, serif' },
    subtextStyle: { color: colors.textGray, fontSize: 12 },
  },
  series: [
    {
      type: 'gauge',
      center: ['50%', '55%'],
      radius: '80%',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#8b7355' },
          { offset: 0.5, color: colors.gold },
          { offset: 1, color: colors.champagne },
        ]),
      },
      progress: {
        show: true,
        width: 20,
        roundCap: true,
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '55%',
        width: 8,
        offsetCenter: [0, '-10%'],
        itemStyle: { color: colors.gold },
      },
      axisLine: { lineStyle: { width: 20, color: [[1, 'rgba(212, 175, 55, 0.15)']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: {
        show: true,
        size: 12,
        itemStyle: {
          color: colors.gold,
          borderColor: colors.gold,
          borderWidth: 2,
        },
      },
      title: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 36,
        fontFamily: 'Georgia',
        fontWeight: 'normal',
        color: colors.gold,
        offsetCenter: [0, '30%'],
        formatter: '{value}%',
      },
      data: [{ value: 87 }],
    },
  ],
}

const scatterOption: echarts.EChartsOption = {
  backgroundColor: 'transparent',
  title: {
    text: 'Correlation Analysis',
    subtext: 'Experience vs Performance',
    left: 'center',
    top: 20,
    textStyle: { color: colors.gold, fontSize: 20, fontFamily: 'Georgia, serif' },
    subtextStyle: { color: colors.textGray, fontSize: 12 },
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderColor: colors.gold,
    textStyle: { color: colors.champagne },
    formatter: (params: any) =>
      `Experience: ${params.value[0]} years<br/>Performance: ${params.value[1]}%`,
  },
  grid: { left: '12%', right: '10%', top: '25%', bottom: '15%' },
  xAxis: {
    type: 'value',
    name: 'Years of Experience',
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: { color: colors.textGray, fontSize: 12 },
    axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
    axisLabel: { color: colors.textGray },
    splitLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.1)' } },
  },
  yAxis: {
    type: 'value',
    name: 'Performance Score',
    nameLocation: 'middle',
    nameGap: 40,
    nameTextStyle: { color: colors.textGray, fontSize: 12 },
    axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
    axisLabel: { color: colors.textGray },
    splitLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.1)' } },
  },
  series: [
    {
      type: 'scatter',
      symbolSize: 16,
      data: [
        [2, 65], [3, 72], [4, 78], [5, 82], [6, 85], [7, 88], [8, 90],
        [3, 68], [4, 75], [5, 80], [6, 84], [7, 87], [9, 92],
        [1, 55], [2, 60], [5, 78], [8, 88], [10, 95],
      ],
      itemStyle: {
        color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
          { offset: 0, color: colors.gold },
          { offset: 1, color: 'rgba(212, 175, 55, 0.3)' },
        ]),
        shadowBlur: 15,
        shadowColor: 'rgba(212, 175, 55, 0.4)',
      },
    },
  ],
}

function initCharts() {
  if (lineChartRef.value) {
    const chart = echarts.init(lineChartRef.value, undefined, { renderer: 'canvas' })
    chart.setOption(lineOption)
    charts.push(chart)
  }
  if (barChartRef.value) {
    const chart = echarts.init(barChartRef.value, undefined, { renderer: 'canvas' })
    chart.setOption(barOption)
    charts.push(chart)
  }
  if (pieChartRef.value) {
    const chart = echarts.init(pieChartRef.value, undefined, { renderer: 'canvas' })
    chart.setOption(pieOption)
    charts.push(chart)
  }
  if (radarChartRef.value) {
    const chart = echarts.init(radarChartRef.value, undefined, { renderer: 'canvas' })
    chart.setOption(radarOption)
    charts.push(chart)
  }
  if (gaugeChartRef.value) {
    const chart = echarts.init(gaugeChartRef.value, undefined, { renderer: 'canvas' })
    chart.setOption(gaugeOption)
    charts.push(chart)
  }
  if (scatterChartRef.value) {
    const chart = echarts.init(scatterChartRef.value, undefined, { renderer: 'canvas' })
    chart.setOption(scatterOption)
    charts.push(chart)
  }
}

function handleResize() {
  charts.forEach(chart => chart.resize())
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(chart => chart.dispose())
})
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <div class="charts-page">
      <!-- Header -->
      <header class="charts-header">
        <div class="header-content">
          <div class="logo">
            <span class="logo-text">ROME</span><span class="logo-accent">O</span>
          </div>
          <h1 class="page-title">Data Visualization</h1>
          <p class="page-subtitle">Elegant Analytics Dashboard</p>
        </div>
        <div class="header-decoration"></div>
      </header>

      <!-- Main Content -->
      <main class="charts-main">
        <div class="charts-grid">
          <!-- Line Chart -->
          <div class="chart-card">
            <div ref="lineChartRef" class="chart-container"></div>
          </div>

          <!-- Bar Chart -->
          <div class="chart-card">
            <div ref="barChartRef" class="chart-container"></div>
          </div>

          <!-- Pie + Gauge Row -->
          <div class="chart-row">
            <div class="chart-card chart-card-half">
              <div ref="pieChartRef" class="chart-container"></div>
            </div>
            <div class="chart-card chart-card-half">
              <div ref="gaugeChartRef" class="chart-container"></div>
            </div>
          </div>

          <!-- Radar Chart -->
          <div class="chart-card">
            <div ref="radarChartRef" class="chart-container"></div>
          </div>

          <!-- Scatter Chart -->
          <div class="chart-card">
            <div ref="scatterChartRef" class="chart-container"></div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="charts-footer">
        <p>© 2026 Romeo Chen · All Rights Reserved</p>
      </footer>
    </div>
  </NConfigProvider>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Playfair+Display:wght@400;500&display=swap');

.charts-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%);
  color: #f5e6c8;
  font-family: 'Cormorant Garamond', Georgia, serif;
  position: relative;
  overflow-x: hidden;
}

/* Background Pattern */
.charts-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.02) 0%, transparent 40%),
    radial-gradient(circle at 40% 80%, rgba(201, 162, 39, 0.02) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

/* Header */
.charts-header {
  position: relative;
  padding: 80px 40px 60px;
  text-align: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 1;
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 14px;
  letter-spacing: 8px;
  text-transform: uppercase;
  margin-bottom: 30px;
  opacity: 0.6;
}

.logo-text {
  color: #f5e6c8;
}

.logo-accent {
  color: #d4af37;
}

.page-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 48px;
  font-weight: 400;
  letter-spacing: 4px;
  margin: 0 0 15px;
  background: linear-gradient(135deg, #d4af37 0%, #f5e6c8 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 14px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #888888;
  margin: 0;
}

.header-decoration {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

/* Main Content */
.charts-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
  position: relative;
  z-index: 1;
}

.charts-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-row {
  display: flex;
  gap: 30px;
}

.chart-row .chart-card-half {
  flex: 1;
}

/* Chart Cards */
.chart-card {
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 30px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
}

.chart-card:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(212, 175, 55, 0.05);
  transform: translateY(-2px);
}

.chart-container {
  width: 100%;
  height: 380px;
}

.chart-row .chart-container {
  height: 380px;
}

/* Footer */
.charts-footer {
  text-align: center;
  padding: 40px;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  position: relative;
  z-index: 1;
}

.charts-footer p {
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #666666;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .chart-row {
    flex-direction: column;
  }

  .page-title {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .charts-header {
    padding: 60px 20px 40px;
  }

  .charts-main {
    padding: 40px 20px;
  }

  .chart-card {
    padding: 20px;
  }

  .chart-container {
    height: 300px;
  }
}
</style>
