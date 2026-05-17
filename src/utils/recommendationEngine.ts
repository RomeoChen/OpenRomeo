// 推荐引擎：根据患者信息匹配推荐规则
import { recommendationRules, type Rule } from '../data/recommendationRules'

export interface PatientInfo {
  name?: string
  gender: '男' | '女'
  age: number
  diseases: string[]  // 疾病ID列表
}

export interface MatchedRule extends Rule {
  matchedDiseases: string[]
  isComorbidity: boolean  // 是否是多病联合规则
}

// 匹配推荐规则
export function matchRules(patient: PatientInfo): MatchedRule[] {
  const { gender, age, diseases } = patient
  const matched: MatchedRule[] = []

  for (const rule of recommendationRules) {
    // 1. 疾病匹配检查
    const ruleDiseaseMatches = rule.diseases.filter(d => diseases.includes(d))
    if (ruleDiseaseMatches.length === 0) continue

    // 2. 性别匹配检查
    if (rule.gender && rule.gender !== '不限' && rule.gender !== gender) continue

    // 3. 年龄匹配检查
    if (rule.ageMin && age <= rule.ageMin) continue
    if (rule.ageMax && age >= rule.ageMax) continue

    // 判断是否为共病规则（rule.diseases 有多个且都匹配了）
    const isComorbidity = rule.diseases.length > 1 &&
      rule.diseases.every(d => diseases.includes(d))

    matched.push({
      ...rule,
      matchedDiseases: ruleDiseaseMatches,
      isComorbidity,
    })
  }

  // 按优先级降序排列，共病规则优先
  matched.sort((a, b) => {
    if (a.isComorbidity !== b.isComorbidity) {
      return a.isComorbidity ? -1 : 1
    }
    return b.priority - a.priority
  })

  return matched
}

// 合并多个匹配的规则，给出综合建议
export function mergeRecommendations(matchedRules: MatchedRule[]): {
  medications: string[]
  diet: string[]
  exercise: string[]
  monitoring: string[]
  notes: string[]
  matchedDiseases: string[]
  hasComorbidity: boolean
} {
  const medications = new Set<string>()
  const diet = new Set<string>()
  const exercise = new Set<string>()
  const monitoring = new Set<string>()
  const notes = new Set<string>()
  const matchedDiseases = new Set<string>()
  let hasComorbidity = false

  for (const rule of matchedRules) {
    rule.matchedDiseases.forEach(d => matchedDiseases.add(d))
    if (rule.isComorbidity) hasComorbidity = true

    rule.medications.forEach(m => medications.add(m))
    rule.diet.forEach(d => diet.add(d))
    rule.exercise.forEach(e => exercise.add(e))
    rule.monitoring.forEach(m => monitoring.add(m))
    if (rule.notes) notes.add(rule.notes)
  }

  return {
    medications: Array.from(medications),
    diet: Array.from(diet),
    exercise: Array.from(exercise),
    monitoring: Array.from(monitoring),
    notes: Array.from(notes),
    matchedDiseases: Array.from(matchedDiseases),
    hasComorbidity,
  }
}

// 主函数：根据患者信息生成推荐
export function generateRecommendation(patient: PatientInfo): {
  patient: PatientInfo
  recommendations: {
    medications: string[]
    diet: string[]
    exercise: string[]
    monitoring: string[]
    notes: string[]
  }
  matchedDiseases: string[]
  hasComorbidity: boolean
  matchedRulesCount: number
} {
  const matchedRules = matchRules(patient)
  const merged = mergeRecommendations(matchedRules)

  return {
    patient,
    recommendations: {
      medications: merged.medications,
      diet: merged.diet,
      exercise: merged.exercise,
      monitoring: merged.monitoring,
      notes: merged.notes,
    },
    matchedDiseases: merged.matchedDiseases,
    hasComorbidity: merged.hasComorbidity,
    matchedRulesCount: matchedRules.length,
  }
}

// 从Excel数据转换（SheetJS格式 -> 内部Rule格式）
export function parseExcelRules(sheetData: any[][]): Partial<Rule>[] {
  if (!sheetData || sheetData.length < 2) return []

  const headers = sheetData[0].map((h: any) => String(h).trim())
  const rules: Partial<Rule>[] = []

  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i]
    const rule: Partial<Rule> = {}

    headers.forEach((header: string, idx: number) => {
      const value = row[idx]
      if (header === '疾病') rule.diseases = [value]
      else if (header === '性别') rule.gender = value || '不限'
      else if (header === '年龄下限') rule.ageMin = Number(value) || undefined
      else if (header === '年龄上限') rule.ageMax = Number(value) || undefined
      else if (header === '优先级') rule.priority = Number(value) || 1
      else if (header === '药物建议') rule.medications = String(value).split('\n').filter(Boolean)
      else if (header === '饮食建议') rule.diet = String(value).split('\n').filter(Boolean)
      else if (header === '运动建议') rule.exercise = String(value).split('\n').filter(Boolean)
      else if (header === '监测建议') rule.monitoring = String(value).split('\n').filter(Boolean)
      else if (header === '备注') rule.notes = value
    })

    if (rule.diseases && rule.diseases.length > 0) {
      rules.push(rule)
    }
  }

  return rules
}
