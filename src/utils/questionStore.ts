// localStorage key 前缀
const PREFIX = 'open-romeo-questions'

export interface QuestionRecord {
  questionId: string
  selectedOption: string
  isCorrect: boolean
  answeredAt: number
}

export interface ArticleQuestions {
  [articleSlug: string]: {
    [questionId: string]: QuestionRecord
  }
}

/**
 * 获取某篇文章的所有答题记录
 */
export function getArticleRecords(slug: string): ArticleQuestions[string] {
  try {
    const raw = localStorage.getItem(`${PREFIX}-${slug}`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * 保存某道题的答题记录
 */
export function saveQuestionRecord(slug: string, record: QuestionRecord): void {
  try {
    const all = getAllRecords()
    if (!all[slug]) all[slug] = {}
    all[slug][record.questionId] = record
    localStorage.setItem(`${PREFIX}-${slug}`, JSON.stringify(all[slug]))
    // 同时更新全局索引
    localStorage.setItem(PREFIX, JSON.stringify(all))
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
}

/**
 * 获取全局记录（所有文章）
 */
export function getAllRecords(): ArticleQuestions {
  try {
    const raw = localStorage.getItem(PREFIX)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * 检查某道题是否已答过
 */
export function isAnswered(slug: string, questionId: string): boolean {
  const records = getArticleRecords(slug)
  return !!records[questionId]
}

/**
 * 获取某道题的记录
 */
export function getQuestionRecord(slug: string, questionId: string): QuestionRecord | null {
  const records = getArticleRecords(slug)
  return records[questionId] || null
}

/**
 * 清除某篇文章的所有记录
 */
export function clearArticleRecords(slug: string): void {
  localStorage.removeItem(`${PREFIX}-${slug}`)
}
