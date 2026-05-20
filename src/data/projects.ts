export interface ProjectFeature {
  label: string
  description: string
}

export interface Project {
  slug: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  route: string
  routeLabel: string
  features: ProjectFeature[]
  tech: string[]
  highlight: string
  gradientFrom: string
  gradientTo: string
  accentColor: string
}

export const projects: Project[] = [
  {
    slug: 'disease-network',
    title: '慢病共病网络图',
    subtitle: '可视化 · 数据分析',
    description: '基于真实医疗数据，将18种慢性病之间的共病关联关系以交互式网络图呈现。用户可以直观看到哪些疾病经常同时出现、疾病之间的关联强度如何。',
    tags: ['可视化', '数据分析', '慢病管理'],
    route: '/disease-network',
    routeLabel: '网络图',
    features: [
      { label: '18种慢性病', description: '覆盖高血压、糖尿病、冠心病等主要慢性病' },
      { label: '交互式网络', description: '拖拽节点、缩放、聚焦任意疾病查看关联' },
      { label: '共病权重', description: '连线粗细代表共病频率，hover显示详细数据' },
    ],
    tech: ['Vue 3', 'TypeScript', 'vis-network', 'TailwindCSS', 'NaiveUI'],
    highlight: '网络图直观呈现疾病关联，数据脱敏处理',
    gradientFrom: 'from-cyan-500/20',
    gradientTo: 'to-cyan-600/5',
    accentColor: 'text-cyan-400',
  },
  {
    slug: 'globe-3d',
    title: '慢病 3D 星图',
    subtitle: '3D 可视化 · 交互体验',
    description: '将疾病关系以3D星空的方式呈现，节点悬浮在空间中，用户可以360°自由旋转、缩放，探索疾病之间的深层关联。',
    tags: ['3D', '可视化', '交互体验'],
    route: '/globe-3d',
    routeLabel: '3D 星图',
    features: [
      { label: '3D 渲染引擎', description: '基于 Canvas 的自研3D渲染引擎' },
      { label: '自由视角', description: '拖拽旋转、滚轮缩放，360°无死角查看' },
      { label: '动态星空背景', description: '实时粒子星空，增强沉浸感' },
    ],
    tech: ['Vue 3', 'TypeScript', 'Canvas 3D', 'TailwindCSS'],
    highlight: '3D沉浸式体验，探索疾病关系的新视角',
    gradientFrom: 'from-purple-500/20',
    gradientTo: 'to-purple-600/5',
    accentColor: 'text-purple-400',
  },
  {
    slug: 'recommendation',
    title: '慢病干预推荐系统',
    subtitle: '智能推荐 · 健康管理',
    description: '输入患者的基本信息（性别、年龄、当前疾病），系统基于预设规则引擎生成个性化的干预方案，包括用药建议、饮食指导、运动处方。',
    tags: ['智能推荐', '健康管理', '规则引擎'],
    route: '/recommendation',
    routeLabel: '推荐系统',
    features: [
      { label: '患者画像输入', description: '支持年龄、性别、疾病类型等多维度输入' },
      { label: '30+干预规则', description: '覆盖高血压、糖尿病、冠心病等主要慢病' },
      { label: 'PDF 导出', description: '一键导出干预建议报告，方便打印分享' },
    ],
    tech: ['Vue 3', 'TypeScript', 'xlsx (SheetJS)', 'TailwindCSS', 'NaiveUI'],
    highlight: '离线可用的智能推荐Demo，输入患者信息即得方案',
    gradientFrom: 'from-amber-500/20',
    gradientTo: 'to-amber-600/5',
    accentColor: 'text-amber-400',
  },
  {
    slug: 'quiz',
    title: '前端求职刷题练习',
    subtitle: '面试准备 · 学习工具',
    description: '8周系统学习计划，配合55+道精选面试题。每篇文章附带交互式练习题，选择题即时判分、显示解析，帮助巩固知识。',
    tags: ['前端', '面试', '学习'],
    route: '/quiz',
    routeLabel: '刷题系统',
    features: [
      { label: '8周学习计划', description: '从JS基础到系统设计，按周递进' },
      { label: '55+精选题库', description: '涵盖八股文、算法、项目、架构' },
      { label: '即时反馈', description: '选择即判分，附详细解析和正确答案' },
    ],
    tech: ['Vue 3', 'TypeScript', 'localStorage', 'markdown-it', 'TailwindCSS'],
    highlight: '学练一体，题目自动保存进度，反复练习无压力',
    gradientFrom: 'from-green-500/20',
    gradientTo: 'to-green-600/5',
    accentColor: 'text-green-400',
  },
]
