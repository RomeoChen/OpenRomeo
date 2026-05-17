// 慢病干预推荐规则数据
// 规则格式：针对特定疾病+性别+年龄段，给出药物、饮食、运动、监测建议

export interface Rule {
  diseases: string[]       // 匹配的疾病（任一匹配即可）
  gender?: '男' | '女' | '不限'
  ageMin?: number          // 年龄下限（不含）
  ageMax?: number          // 年龄上限（不含）
  priority: number         // 优先级，数字越大优先级越高
  medications: string[]     // 药物建议
  diet: string[]           // 饮食建议
  exercise: string[]        // 运动建议
  monitoring: string[]      // 监测建议
  notes?: string            // 备注
}

// 疾病名称映射（中文名 -> 英文ID，用于匹配）
export const diseaseNameMap: Record<string, string> = {
  '高血压': 'hypertension',
  '糖尿病': 'diabetes',
  '2型糖尿病': 'diabetes',
  '高脂血症': 'hyperlipidemia',
  '高血脂': 'hyperlipidemia',
  '冠心病': 'coronary_heart_disease',
  '冠状动脉粥样硬化': 'coronary_heart_disease',
  '脑梗死': 'cerebral_infarction',
  '脑卒中': 'cerebral_infarction',
  '慢阻肺': 'copd',
  '慢性阻塞性肺疾病': 'copd',
  '哮喘': 'asthma',
  '脂肪肝': 'fatty_liver',
  '肝硬化': 'cirrhosis',
  '胃食管反流': 'gerd',
  '反流性食管炎': 'gerd',
  '慢性肾病': 'chronic_kidney_disease',
  'CKD': 'chronic_kidney_disease',
  '贫血': 'anemia',
  '骨质疏松': 'osteoporosis',
  '抑郁症': 'depression',
  '抑郁': 'depression',
  '痛风': 'gout',
  '肥胖': 'obesity',
  '超重': 'obesity',
  '房颤': 'atrial_fibrillation',
  '心房颤动': 'atrial_fibrillation',
  '心衰': 'heart_failure',
  '心力衰竭': 'heart_failure',
}

export const reverseDiseaseNameMap: Record<string, string> = Object.fromEntries(
  Object.entries(diseaseNameMap).map(([k, v]) => [v, k])
)

// 所有推荐规则
export const recommendationRules: Rule[] = [
  // ==================== 高血压相关规则 ====================
  {
    diseases: ['hypertension'],
    gender: '不限',
    ageMin: 40,
    ageMax: 80,
    priority: 10,
    medications: [
      '钙通道阻滞剂（CCB）如氨氯地平，首选',
      '血管紧张素受体拮抗剂（ARB）如厄贝沙坦',
      '必要时联合用药',
    ],
    diet: [
      '低盐饮食，每日盐摄入 < 5g',
      '增加钾摄入：香蕉、橙子、菠菜',
      'DASH饮食模式：多吃蔬果、全谷物、低脂奶',
      '限制饱和脂肪：少吃肥肉、动物内脏',
    ],
    exercise: [
      '每周5次有氧运动，每次30分钟',
      '快走、慢跑、游泳、骑自行车',
      '运动强度：中等强度（心率=170-年龄）',
      '避免剧烈运动和憋气用力',
    ],
    monitoring: [
      '家庭血压监测：早中晚各测1次',
      '目标血压：< 140/90 mmHg',
      '每3个月复查：血脂、血糖、肌酐',
      '每年：心电图、尿微量白蛋白、眼底检查',
    ],
    notes: '老年人血压目标可放宽至 < 150/90 mmHg',
  },
  {
    diseases: ['hypertension'],
    gender: '不限',
    ageMin: 18,
    ageMax: 40,
    priority: 9,
    medications: [
      '血管紧张素转换酶抑制剂（ACEI）如培哚普利',
      'ARB类如氯沙坦',
      '年轻患者首选 ACEI/ARB',
    ],
    diet: [
      '严格低盐：< 3g/天',
      '增加膳食纤维：粗粮、蔬菜',
      '避免熬夜和过度咖啡因',
    ],
    exercise: [
      '每周至少150分钟中等强度有氧运动',
      '配合力量训练：每周2-3次',
      '减重目标：BMI < 24',
    ],
    monitoring: [
      '家庭自测血压',
      '排除继发性高血压',
    ],
    notes: '年轻高血压需排查继发性原因',
  },

  // ==================== 糖尿病相关规则 ====================
  {
    diseases: ['diabetes'],
    gender: '不限',
    ageMin: 40,
    ageMax: 80,
    priority: 10,
    medications: [
      '二甲双胍作为一线用药',
      '餐后血糖高加用α-糖苷酶抑制剂（阿卡波糖）',
      '合并心血管疾病加用SGLT-2抑制剂或GLP-1受体激动剂',
    ],
    diet: [
      '控制碳水化合物摄入：每餐不超过2两主食',
      '选择低GI食物：燕麦、荞麦、杂粮',
      '蛋白质：每天0.8-1g/kg体重',
      '避免升糖快的食物：稀饭、甜饮料',
      '进餐顺序：先吃菜→再吃肉→最后吃主食',
    ],
    exercise: [
      '饭后30-60分钟运动最佳',
      '有氧运动：快走/慢跑30分钟',
      '每周至少5次',
      '配合抗阻训练：深蹲、哑铃每周2次',
    ],
    monitoring: [
      '空腹血糖目标：4.4-7.0 mmol/L',
      '餐后2h血糖目标：< 10.0 mmol/L',
      '糖化血红蛋白（HbA1c）：< 7%',
      '每月监测：血糖谱',
      '每3月复查：血脂、肝肾功能',
      '每年：眼底检查、尿微量白蛋白、下肢血管检查',
    ],
    notes: '合并高血压时，血压目标更严格 < 130/80 mmHg',
  },
  {
    diseases: ['diabetes'],
    gender: '不限',
    ageMin: 18,
    ageMax: 40,
    priority: 9,
    medications: [
      '二甲双胍',
      '早期强化治疗可考虑胰岛素',
      'GLP-1受体激动剂（有减重效果）',
    ],
    diet: [
      '严格控制碳水',
      '生酮饮食或低碳水饮食可选（需医生指导）',
      '戒除含糖饮料',
    ],
    exercise: [
      '高强度间歇训练（HIIT）有助于提高胰岛素敏感性',
      '每周运动时间 ≥ 200分钟',
    ],
    monitoring: [
      '更严格的血糖控制目标',
      '警惕低血糖事件',
    ],
    notes: '年轻患者需评估胰岛功能',
  },

  // ==================== 高脂血症规则 ====================
  {
    diseases: ['hyperlipidemia'],
    gender: '不限',
    priority: 8,
    medications: [
      '他汀类药物：阿托伐他汀、瑞舒伐他汀首选',
      'TC高加用依折麦布',
      '甘油三酯 > 5.6 加用贝特类',
    ],
    diet: [
      '严格限制饱和脂肪：< 总热量7%',
      '反式脂肪：避免摄入',
      '增加膳食纤维：燕麦25g/天以上',
      '坚果：每天30g（核桃、杏仁）',
      '深海鱼：每周2-3次（三文鱼、鲭鱼）',
    ],
    exercise: [
      '有氧运动为主：快走/慢跑/游泳',
      '每次30-45分钟，每周5次',
      '运动可升高HDL（好胆固醇）',
    ],
    monitoring: [
      '初治者4-6周复查血脂',
      '稳定后每3月复查',
      '目标：LDL-C < 2.6 mmol/L（高危 < 1.8）',
      'TG < 1.7 mmol/L',
    ],
    notes: '他汀夜间服用效果更佳',
  },

  // ==================== 冠心病规则 ====================
  {
    diseases: ['coronary_heart_disease'],
    gender: '不限',
    priority: 10,
    medications: [
      '抗血小板：阿司匹林终生，氯吡格雷/替格瑞洛至少12个月',
      '降脂：他汀类，LDL-C目标 < 1.4 mmol/L',
      'β受体阻滞剂：美托洛尔',
      'ACEI/ARB：心梗后或心功能不全者',
      '硝酸酯类：发作时临时使用',
    ],
    diet: [
      '地中海饮食模式',
      '严格限盐 < 3g/天',
      '多蔬果：每天 > 500g',
      'Omega-3脂肪酸：深海鱼、亚麻籽',
    ],
    exercise: [
      '心脏康复运动：需在医生评估后进行',
      '从低强度开始：散步、柔软体操',
      '逐步增加强度，循序渐进',
      '避免竞技性运动',
    ],
    monitoring: [
      '心电图定期复查',
      '血脂、血糖严格达标管理',
      '警惕胸痛发作',
      '必要时冠脉CTA或造影随访',
    ],
    notes: '支架术后双抗治疗至少12个月，期间避免择期手术',
  },

  // ==================== 脑梗死规则 ====================
  {
    diseases: ['cerebral_infarction'],
    gender: '不限',
    priority: 10,
    medications: [
      '抗血小板：阿司匹林或氯吡格雷',
      '他汀类降脂治疗',
      '控制血压：BP < 140/90 mmHg',
      '二级预防至关重要',
    ],
    diet: [
      '低盐低脂饮食',
      '地中海饮食',
      '吞咽困难者需留置胃管或改增稠剂',
    ],
    exercise: [
      '康复训练为主',
      '肢体康复、言语康复、认知康复',
      '被动运动→主动运动循序渐进',
    ],
    monitoring: [
      '复查头颅CT/MRI',
      '颈动脉超声评估斑块',
      '监测血压、血糖',
      '警惕复发征兆：头晕、肢体无力、言语不清',
    ],
    notes: '脑梗死复发风险高，需严格控制危险因素',
  },

  // ==================== 慢阻肺规则 ====================
  {
    diseases: ['copd'],
    gender: '不限',
    priority: 9,
    medications: [
      '支气管扩张剂：LAMA（噻托溴铵）或LABA/ICS复方',
      '祛痰药：氨溴索、乙酰半胱氨酸',
      '急性加重时及时就医',
    ],
    diet: [
      '高蛋白饮食：1.2-1.5g/kg/天',
      '少食多餐，避免饱胀',
      '补充维生素D',
      '肥胖者需减重',
    ],
    exercise: [
      '肺康复训练：缩唇呼吸、腹式呼吸',
      '体力可行时做有氧运动',
      '呼吸操：每天2次，每次10分钟',
      '太极、散步等温和运动',
    ],
    monitoring: [
      '监测呼吸困难程度',
      '记录咳嗽、痰量变化',
      '峰流速仪监测肺功能',
      '流感疫苗+肺炎疫苗接种',
      '每年肺功能检测',
    ],
    notes: '戒烟是最重要的治疗措施',
  },

  // ==================== 脂肪肝规则 ====================
  {
    diseases: ['fatty_liver'],
    gender: '不限',
    priority: 8,
    medications: [
      '针对病因治疗（降糖、降脂）',
      '维生素E（抗氧化，用于NASH）',
      '合并转氨酶升高可用双环醇/多烯磷脂酰胆碱',
    ],
    diet: [
      '戒酒',
      '减重：目标体重下降7-10%',
      '低果糖饮食',
      '地中海饮食',
      '咖啡可适量饮用（每天1-2杯）',
    ],
    exercise: [
      '有氧运动为主：每周150分钟以上',
      '高强度运动效果更佳',
      '配合力量训练减少内脏脂肪',
    ],
    monitoring: [
      '每6月复查肝脏B超',
      '肝功能、血糖、血脂',
      'FibroScan评估纤维化',
    ],
    notes: '脂肪肝是可逆的，减重是最有效的方法',
  },

  // ==================== 骨质疏松规则 ====================
  {
    diseases: ['osteoporosis'],
    gender: '不限',
    priority: 8,
    medications: [
      '钙剂+维生素D作为基础治疗',
      '抗骨吸收：双膦酸盐（阿仑膦酸钠）',
      '骨形成促进：特立帕肽（严重者）',
    ],
    diet: [
      '高钙饮食：牛奶500ml/天、豆腐、绿叶蔬菜',
      '维生素D：每天800-1000IU',
      '避免过量咖啡因',
      '戒酒',
    ],
    exercise: [
      '负重运动：快走、慢跑、跳绳',
      '力量训练：深蹲、哑铃',
      '平衡训练：太极拳',
      '每周3-5次，每次30分钟',
    ],
    monitoring: [
      '骨密度检测（DEXA）：每年1次',
      '跌倒风险评估',
      '居家防跌倒改造',
    ],
    notes: '防跌倒是关键，老年人尤其注意',
  },

  // ==================== 抑郁症规则 ====================
  {
    diseases: ['depression'],
    gender: '不限',
    priority: 9,
    medications: [
      'SSRIs类：舍曲林、艾司西酞普兰为首选',
      'SNRIs类：度洛西汀（合并疼痛时优选）',
      '严重者联合用药或MECT治疗',
    ],
    diet: [
      'Omega-3脂肪酸：深海鱼、亚麻籽',
      '叶酸：B族维生素',
      '避免酒精',
      '规律进食，勿过度节食',
    ],
    exercise: [
      '有氧运动：跑步、游泳、骑车',
      '每周3-5次，每次30分钟',
      '运动可提升5-羟色胺水平',
      '太极、瑜伽等舒缓运动',
    ],
    monitoring: [
      'PHQ-9量表定期评估',
      '关注自杀风险',
      '每2-4周复诊',
    ],
    notes: '心理疏导+药物治疗联合效果最佳',
  },

  // ==================== 慢性肾病规则 ====================
  {
    diseases: ['chronic_kidney_disease'],
    gender: '不限',
    priority: 10,
    medications: [
      '控制血压：ACEI/ARB为首选（护肾）',
      'SGLT-2抑制剂（eGFR允许时）',
      '纠正贫血：促红细胞生成素+铁剂',
      '降磷：碳酸镧、司维拉姆',
    ],
    diet: [
      '优质低蛋白饮食：0.6-0.8g/kg/天',
      '控制磷摄入：少吃加工食品、饮料',
      '限制钾：血钾高时避免高钾食物',
      '限制钠：< 2g/天',
      '糖尿病肾病患者需同步控制碳水',
    ],
    exercise: [
      '温和有氧运动',
      '避免剧烈运动',
      '每周3-5次，每次20-30分钟',
    ],
    monitoring: [
      'eGFR每3月监测',
      '尿蛋白/肌酐比值（UACR）',
      '血钾、血磷、血钙',
      '每6月复查肾脏超声',
    ],
    notes: '避免肾毒性药物（NSAIDs、造影剂等）',
  },

  // ==================== 痛风规则 ====================
  {
    diseases: ['gout'],
    gender: '不限',
    priority: 8,
    medications: [
      '急性发作：秋水仙碱/NSAIDs/糖皮质激素',
      '缓解期：降尿酸治疗（别嘌醇/非布司TA/苯溴马隆）',
      '目标尿酸 < 360 μmol/L',
    ],
    diet: [
      '严格限制高嘌呤食物：动物内脏、海鲜、浓汤',
      '戒酒（尤其是啤酒）',
      '限制果糖饮料',
      '每天饮水 > 2000ml',
      '乳制品（低脂奶）可降低尿酸',
    ],
    exercise: [
      '发作期禁止运动',
      '缓解期适度有氧运动',
      '减重有助于降低尿酸',
    ],
    monitoring: [
      '血尿酸监测：目标 < 360 μmol/L',
      '发作频率记录',
      '肾功能评估',
    ],
    notes: '降尿酸治疗初期可能诱发发作，不应停药',
  },

  // ==================== 肥胖规则 ====================
  {
    diseases: ['obesity'],
    gender: '不限',
    priority: 8,
    medications: [
      '奥利司他（脂肪酶抑制剂）：减少脂肪吸收',
      'GLP-1受体激动剂（利拉鲁肽/司美格鲁肽）：显著减重',
      'BMI ≥ 32.5 考虑代谢手术',
    ],
    diet: [
      '能量赤字：每天减少500-750kcal',
      '低碳水饮食或轻断食',
      '增加蛋白质比例',
      '记录饮食日志',
    ],
    exercise: [
      '目标：每周300分钟中等强度运动',
      '有氧+力量训练结合',
      '从快走开始，逐步增加强度',
    ],
    monitoring: [
      '每周称重（固定时间）',
      '每月测体脂、腰围',
      '血糖血脂复查',
    ],
    notes: '减重5-10%可显著改善代谢',
  },

  // ==================== 冠心病+糖尿病 联合规则（高优先级） ====================
  {
    diseases: ['coronary_heart_disease', 'diabetes'],
    gender: '不限',
    priority: 15, // 最高优先级，共病患者
    medications: [
      '抗血小板双抗治疗（阿司匹林+氯吡格雷）至少12个月',
      '高强度他汀治疗，LDL-C目标 < 1.4 mmol/L',
      'β受体阻滞剂+ACEI/ARB',
      '糖尿病药物优选有心血管获益的GLP-1RA或SGLT-2i',
    ],
    diet: [
      '地中海饮食+DASH饮食结合',
      '严格低盐 < 3g/天',
      '严格低饱和脂肪',
      '低升糖指数饮食',
      '多蔬果、深海鱼、坚果',
    ],
    exercise: [
      '心脏康复评估后制定运动处方',
      '从低强度开始，密切监测',
      '推荐有监护的有氧运动',
    ],
    monitoring: [
      '血压、血糖、血脂三高共管',
      '每3月全面复查',
      '心电图、冠脉事件监测',
      '警惕低血糖事件',
    ],
    notes: '心血管疾病合并糖尿病为极高危，需综合管理',
  },

  // ==================== 高血压+糖尿病 联合规则 ====================
  {
    diseases: ['hypertension', 'diabetes'],
    gender: '不限',
    priority: 14,
    medications: [
      'ACEI/ARB为首选（两者兼顾）',
      '氨氯地平联合使用',
      '糖尿病药物优选有心血管获益的SGLT-2i',
    ],
    diet: [
      '低盐 < 3g/天',
      '低GI饮食',
      'DASH饮食模式',
      '增加膳食纤维',
    ],
    exercise: [
      '有氧+力量训练结合',
      '运动时注意监测血糖',
      '避免清晨空腹运动',
    ],
    monitoring: [
      '血压目标更严格：< 130/80 mmHg',
      'HbA1c < 7%',
      '每月复查血糖谱',
    ],
    notes: '两病共管，肾脏保护同样重要',
  },
]

// 获取某疾病的所有规则
export function getRulesForDisease(diseaseIds: string[]): Rule[] {
  return recommendationRules.filter(rule => {
    // 疾病匹配：rule.diseases 中的任何一个在输入疾病中
    const hasMatch = rule.diseases.some(d => diseaseIds.includes(d))
    if (!hasMatch) return false
    return true
  })
}
