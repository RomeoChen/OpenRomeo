import { describe, it, expect, beforeEach } from 'vitest'
import {
  getArticleRecords,
  saveQuestionRecord,
  getAllRecords,
  isAnswered,
  getQuestionRecord,
  clearArticleRecords,
  type QuestionRecord
} from '../../utils/questionStore'

describe('questionStore', () => {
  const TEST_SLUG = 'test-article'
  const TEST_QUESTION_ID = 'q1'

  describe('getArticleRecords', () => {
    it('returns empty object when no records exist', () => {
      const result = getArticleRecords(TEST_SLUG)
      expect(result).toEqual({})
    })

    it('returns parsed records when they exist', () => {
      const records = { q1: { questionId: 'q1', selectedOption: 'A', isCorrect: true, answeredAt: 123456 } }
      localStorage.setItem(`open-romeo-questions-${TEST_SLUG}`, JSON.stringify(records))
      const result = getArticleRecords(TEST_SLUG)
      expect(result).toEqual(records)
    })

    it('returns empty object on parse error', () => {
      localStorage.setItem(`open-romeo-questions-${TEST_SLUG}`, 'invalid json')
      const result = getArticleRecords(TEST_SLUG)
      expect(result).toEqual({})
    })
  })

  describe('saveQuestionRecord', () => {
    it('saves a question record to localStorage', () => {
      const record: QuestionRecord = {
        questionId: TEST_QUESTION_ID,
        selectedOption: 'B',
        isCorrect: false,
        answeredAt: 123456
      }
      saveQuestionRecord(TEST_SLUG, record)

      const stored = localStorage.getItem(`open-romeo-questions-${TEST_SLUG}`)
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed[TEST_QUESTION_ID]).toEqual(record)
    })

    it('updates existing record for the same question', () => {
      const record1: QuestionRecord = {
        questionId: TEST_QUESTION_ID,
        selectedOption: 'A',
        isCorrect: true,
        answeredAt: 100
      }
      const record2: QuestionRecord = {
        questionId: TEST_QUESTION_ID,
        selectedOption: 'B',
        isCorrect: false,
        answeredAt: 200
      }
      saveQuestionRecord(TEST_SLUG, record1)
      saveQuestionRecord(TEST_SLUG, record2)

      const stored = localStorage.getItem(`open-romeo-questions-${TEST_SLUG}`)
      const parsed = JSON.parse(stored!)
      expect(parsed[TEST_QUESTION_ID]).toEqual(record2)
    })

    it('saves to global index as well', () => {
      const record: QuestionRecord = {
        questionId: TEST_QUESTION_ID,
        selectedOption: 'A',
        isCorrect: true,
        answeredAt: 123456
      }
      saveQuestionRecord(TEST_SLUG, record)

      const globalIndex = localStorage.getItem('open-romeo-questions')
      expect(globalIndex).toBeTruthy()
      const parsed = JSON.parse(globalIndex!)
      expect(parsed[TEST_SLUG]).toBeTruthy()
      expect(parsed[TEST_SLUG][TEST_QUESTION_ID]).toEqual(record)
    })
  })

  describe('getAllRecords', () => {
    it('returns empty object when no records exist', () => {
      const result = getAllRecords()
      expect(result).toEqual({})
    })

    it('returns all records from all articles', () => {
      const record1: QuestionRecord = { questionId: 'q1', selectedOption: 'A', isCorrect: true, answeredAt: 1 }
      const record2: QuestionRecord = { questionId: 'q2', selectedOption: 'B', isCorrect: false, answeredAt: 2 }
      saveQuestionRecord('article1', record1)
      saveQuestionRecord('article2', record2)

      const result = getAllRecords()
      expect(result['article1']['q1']).toEqual(record1)
      expect(result['article2']['q2']).toEqual(record2)
    })
  })

  describe('isAnswered', () => {
    it('returns false when question has not been answered', () => {
      expect(isAnswered(TEST_SLUG, TEST_QUESTION_ID)).toBe(false)
    })

    it('returns true when question has been answered', () => {
      const record: QuestionRecord = {
        questionId: TEST_QUESTION_ID,
        selectedOption: 'A',
        isCorrect: true,
        answeredAt: 123456
      }
      saveQuestionRecord(TEST_SLUG, record)
      expect(isAnswered(TEST_SLUG, TEST_QUESTION_ID)).toBe(true)
    })
  })

  describe('getQuestionRecord', () => {
    it('returns null when question has not been answered', () => {
      const result = getQuestionRecord(TEST_SLUG, TEST_QUESTION_ID)
      expect(result).toBeNull()
    })

    it('returns the record when question has been answered', () => {
      const record: QuestionRecord = {
        questionId: TEST_QUESTION_ID,
        selectedOption: 'C',
        isCorrect: false,
        answeredAt: 999
      }
      saveQuestionRecord(TEST_SLUG, record)
      const result = getQuestionRecord(TEST_SLUG, TEST_QUESTION_ID)
      expect(result).toEqual(record)
    })
  })

  describe('clearArticleRecords', () => {
    it('removes all records for an article', () => {
      const record1: QuestionRecord = { questionId: 'q1', selectedOption: 'A', isCorrect: true, answeredAt: 1 }
      const record2: QuestionRecord = { questionId: 'q2', selectedOption: 'B', isCorrect: false, answeredAt: 2 }
      saveQuestionRecord(TEST_SLUG, record1)
      saveQuestionRecord(TEST_SLUG, record2)

      clearArticleRecords(TEST_SLUG)

      const stored = localStorage.getItem(`open-romeo-questions-${TEST_SLUG}`)
      expect(stored).toBeNull()
      const result = getArticleRecords(TEST_SLUG)
      expect(result).toEqual({})
    })

    it('does not affect other articles', () => {
      const record1: QuestionRecord = { questionId: 'q1', selectedOption: 'A', isCorrect: true, answeredAt: 1 }
      const record2: QuestionRecord = { questionId: 'q2', selectedOption: 'B', isCorrect: false, answeredAt: 2 }
      saveQuestionRecord('article1', record1)
      saveQuestionRecord('article2', record2)

      clearArticleRecords('article1')

      expect(isAnswered('article2', 'q2')).toBe(true)
    })
  })
})
