// 慢病共病网络数据
// 每个节点的 size 表示该疾病的患者数量（越大越常见）
// 每条边的宽度表示两种疾病共病的次数（越粗共病越强）

export interface DiseaseNode {
  id: string
  label: string
  size: number  // 患者数量，节点大小
  group: string // 分组：代谢、心血管、呼吸、消化、其他
  description: string
}

export interface DiseaseEdge {
  from: string
  to: string
  width: number  // 共病次数，边宽度
  label?: string
}

export const diseaseNodes: DiseaseNode[] = [
  // 代谢性疾病
  { id: 'hypertension', label: '高血压', size: 120, group: '代谢', description: '最常见的慢性病之一' },
  { id: 'diabetes', label: '2型糖尿病', size: 95, group: '代谢', description: '血糖代谢异常' },
  { id: 'hyperlipidemia', label: '高脂血症', size: 78, group: '代谢', description: '血脂异常升高' },
  { id: 'obesity', label: '肥胖', size: 62, group: '代谢', description: 'BMI ≥ 28' },
  { id: 'gout', label: '痛风', size: 35, group: '代谢', description: '尿酸代谢异常' },

  // 心脑血管疾病
  { id: 'coronary_heart_disease', label: '冠心病', size: 58, group: '心血管', description: '冠状动脉粥样硬化' },
  { id: 'cerebral_infarction', label: '脑梗死', size: 45, group: '心血管', description: '脑血管堵塞' },
  { id: 'atrial_fibrillation', label: '房颤', size: 28, group: '心血管', description: '心房颤动' },
  { id: 'heart_failure', label: '心衰', size: 22, group: '心血管', description: '心脏功能不全' },

  // 呼吸系统
  { id: 'copd', label: '慢阻肺', size: 40, group: '呼吸', description: '慢性阻塞性肺疾病' },
  { id: 'asthma', label: '哮喘', size: 30, group: '呼吸', description: '气道慢性炎症' },

  // 消化系统
  { id: 'fatty_liver', label: '脂肪肝', size: 55, group: '消化', description: '肝细胞脂肪变性' },
  { id: 'cirrhosis', label: '肝硬化', size: 20, group: '消化', description: '肝脏纤维化' },
  { id: 'gerd', label: '胃食管反流', size: 38, group: '消化', description: '反酸烧心' },

  // 其他
  { id: 'chronic_kidney_disease', label: '慢性肾病', size: 32, group: '其他', description: '肾功能进行性下降' },
  { id: 'anemia', label: '贫血', size: 42, group: '其他', description: '血红蛋白降低' },
  { id: 'osteoporosis', label: '骨质疏松', size: 48, group: '其他', description: '骨密度下降' },
  { id: 'depression', label: '抑郁症', size: 35, group: '其他', description: '情绪障碍' },
]

export const diseaseEdges: DiseaseEdge[] = [
  // 高血压相关
  { from: 'hypertension', to: 'coronary_heart_disease', width: 8, label: '强关联' },
  { from: 'hypertension', to: 'cerebral_infarction', width: 7, label: '强关联' },
  { from: 'hypertension', to: 'heart_failure', width: 5, label: '中关联' },
  { from: 'hypertension', to: 'chronic_kidney_disease', width: 6, label: '强关联' },
  { from: 'hypertension', to: 'hyperlipidemia', width: 9, label: '极强' },
  { from: 'hypertension', to: 'diabetes', width: 8, label: '强关联' },
  { from: 'hypertension', to: 'obesity', width: 7, label: '强关联' },

  // 糖尿病相关
  { from: 'diabetes', to: 'coronary_heart_disease', width: 7, label: '强关联' },
  { from: 'diabetes', to: 'cerebral_infarction', width: 6, label: '强关联' },
  { from: 'diabetes', to: 'chronic_kidney_disease', width: 8, label: '极强' },
  { from: 'diabetes', to: 'hyperlipidemia', width: 7, label: '强关联' },
  { from: 'diabetes', to: 'fatty_liver', width: 6, label: '强关联' },
  { from: 'diabetes', to: 'obesity', width: 8, label: '极强' },
  { from: 'diabetes', to: 'gerd', width: 4, label: '中关联' },

  // 高脂血症相关
  { from: 'hyperlipidemia', to: 'coronary_heart_disease', width: 9, label: '极强' },
  { from: 'hyperlipidemia', to: 'cerebral_infarction', width: 7, label: '强关联' },
  { from: 'hyperlipidemia', to: 'fatty_liver', width: 5, label: '中关联' },
  { from: 'hyperlipidemia', to: 'obesity', width: 6, label: '强关联' },
  { from: 'hyperlipidemia', to: 'chronic_kidney_disease', width: 4, label: '中关联' },

  // 肥胖相关
  { from: 'obesity', to: 'diabetes', width: 8, label: '极强' },
  { from: 'obesity', to: 'hypertension', width: 7, label: '强关联' },
  { from: 'obesity', to: 'hyperlipidemia', width: 6, label: '强关联' },
  { from: 'obesity', to: 'fatty_liver', width: 8, label: '极强' },
  { from: 'obesity', to: 'sleep_apnea', width: 6, label: '强关联' },
  { from: 'obesity', to: 'gerd', width: 5, label: '中关联' },
  { from: 'obesity', to: 'copd', width: 5, label: '中关联' },

  // 冠心病相关
  { from: 'coronary_heart_disease', to: 'heart_failure', width: 6, label: '强关联' },
  { from: 'coronary_heart_disease', to: 'atrial_fibrillation', width: 4, label: '中关联' },
  { from: 'coronary_heart_disease', to: 'cerebral_infarction', width: 5, label: '中关联' },

  // 脑梗死相关
  { from: 'cerebral_infarction', to: 'atrial_fibrillation', width: 5, label: '中关联' },
  { from: 'cerebral_infarction', to: 'hypertension', width: 7, label: '强关联' },

  // 慢阻肺相关
  { from: 'copd', to: 'heart_failure', width: 4, label: '中关联' },
  { from: 'copd', to: 'atrial_fibrillation', width: 3, label: '弱关联' },

  // 脂肪肝相关
  { from: 'fatty_liver', to: 'diabetes', width: 6, label: '强关联' },
  { from: 'fatty_liver', to: 'obesity', width: 8, label: '极强' },
  { from: 'fatty_liver', to: 'hyperlipidemia', width: 5, label: '中关联' },
  { from: 'fatty_liver', to: 'cirrhosis', width: 3, label: '弱关联' },

  // 骨质疏松相关
  { from: 'osteoporosis', to: 'depression', width: 3, label: '弱关联' },
  { from: 'osteoporosis', to: 'anemia', width: 3, label: '弱关联' },

  // 抑郁症相关
  { from: 'depression', to: 'heart_failure', width: 4, label: '中关联' },
  { from: 'depression', to: 'diabetes', width: 5, label: '中关联' },
  { from: 'depression', to: 'gerd', width: 4, label: '中关联' },

  // 慢性肾病相关
  { from: 'chronic_kidney_disease', to: 'anemia', width: 6, label: '强关联' },
  { from: 'chronic_kidney_disease', to: 'hypertension', width: 6, label: '强关联' },
  { from: 'chronic_kidney_disease', to: 'diabetes', width: 8, label: '极强' },

  // 痛风相关
  { from: 'gout', to: 'chronic_kidney_disease', width: 5, label: '中关联' },
  { from: 'gout', to: 'obesity', width: 5, label: '中关联' },
  { from: 'gout', to: 'hypertension', width: 5, label: '中关联' },

  // 贫血相关
  { from: 'anemia', to: 'chronic_kidney_disease', width: 6, label: '强关联' },
  { from: 'anemia', to: 'depression', width: 4, label: '中关联' },
]

// 节点分组颜色配置
export const groupColors: Record<string, string> = {
  '代谢': '#4CAF50',
  '心血管': '#E53935',
  '呼吸': '#1E88E5',
  '消化': '#FB8C00',
  '其他': '#8E24AA',
}
